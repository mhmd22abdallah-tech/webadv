const express = require('express');
const { promisePool } = require('../config/database');
const { validateOrder } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all orders (authenticated users see their own, admins see all)
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT o.*, u.username, u.email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    // Regular users only see their own orders
    if (req.user.role !== 'admin') {
      query += ' AND o.user_id = ?';
      params.push(req.user.id);
    }

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [orders] = await promisePool.execute(query, params);

    // Get order items for each order
    for (let order of orders) {
      const [items] = await promisePool.execute(
        `SELECT oi.*, p.name as product_name, p.image_url 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE 1=1';
    const countParams = [];
    if (req.user.role !== 'admin') {
      countQuery += ' AND user_id = ?';
      countParams.push(req.user.id);
    }
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const [countResult] = await promisePool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Get single order
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    let query = `
      SELECT o.*, u.username, u.email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      WHERE o.id = ?
    `;
    const params = [id];

    // Regular users can only see their own orders
    if (req.user.role !== 'admin') {
      query += ' AND o.user_id = ?';
      params.push(req.user.id);
    }

    const [orders] = await promisePool.execute(query, params);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Get order items
    const [items] = await promisePool.execute(
      `SELECT oi.*, p.name as product_name, p.image_url 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [id]
    );
    order.items = items;

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// Create new order
router.post('/', authenticate, validateOrder, async (req, res) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const { products, shippingAddress, shippingCity, shippingZip, paymentMethod } = req.body;

    // Calculate total price and validate products
    let totalPrice = 0;
    for (const item of products) {
      const [productRows] = await connection.execute(
        'SELECT price, stock FROM products WHERE id = ?',
        [item.productId]
      );

      if (productRows.length === 0) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      const product = productRows[0];
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ID ${item.productId}`);
      }

      totalPrice += product.price * item.quantity;
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, order_number, total_price, shipping_address, shipping_city, shipping_zip, payment_method) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, orderNumber, totalPrice, shippingAddress, shippingCity, shippingZip, paymentMethod]
    );

    const orderId = orderResult.insertId;

    // Create order items and update stock
    for (const item of products) {
      const [productRows] = await connection.execute(
        'SELECT price FROM products WHERE id = ?',
        [item.productId]
      );
      const product = productRows[0];

      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.productId, item.quantity, product.price]
      );

      // Update product stock
      await connection.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    await connection.commit();

    // Get created order with items
    const [orders] = await promisePool.execute(
      `SELECT o.*, u.username, u.email 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.id = ?`,
      [orderId]
    );
    const order = orders[0];

    const [items] = await promisePool.execute(
      `SELECT oi.*, p.name as product_name, p.image_url 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [orderId]
    );
    order.items = items;

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

// Update order status (admin only or user can cancel)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if order exists
    let query = 'SELECT * FROM orders WHERE id = ?';
    const params = [id];

    if (req.user.role !== 'admin') {
      query += ' AND user_id = ?';
      params.push(req.user.id);
    }

    const [orders] = await promisePool.execute(query, params);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Regular users can only cancel their own orders
    if (req.user.role !== 'admin' && status !== 'cancelled') {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel orders'
      });
    }

    await promisePool.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    const [updatedOrders] = await promisePool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrders[0]
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
});

// Delete order (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { id } = req.params;

    const [orders] = await promisePool.execute(
      'SELECT id FROM orders WHERE id = ?',
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await promisePool.execute('DELETE FROM orders WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
});

module.exports = router;


