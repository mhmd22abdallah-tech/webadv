const express = require('express');
const { promisePool } = require('../config/database');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    // Get total users
    const [userCount] = await promisePool.execute('SELECT COUNT(*) as total FROM users');
    
    // Get total products
    const [productCount] = await promisePool.execute('SELECT COUNT(*) as total FROM products');
    
    // Get total orders
    const [orderCount] = await promisePool.execute('SELECT COUNT(*) as total FROM orders');
    
    // Get total revenue
    const [revenue] = await promisePool.execute(
      'SELECT SUM(total_price) as total FROM orders WHERE status != "cancelled"'
    );
    
    // Get orders by status
    const [ordersByStatus] = await promisePool.execute(
      'SELECT status, COUNT(*) as count FROM orders GROUP BY status'
    );
    
    // Get recent orders
    const [recentOrders] = await promisePool.execute(
      `SELECT o.*, u.username 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC 
       LIMIT 10`
    );

    res.json({
      success: true,
      stats: {
        totalUsers: userCount[0].total,
        totalProducts: productCount[0].total,
        totalOrders: orderCount[0].total,
        totalRevenue: revenue[0].total || 0,
        ordersByStatus: ordersByStatus.reduce((acc, item) => {
          acc[item.status] = item.count;
          return acc;
        }, {}),
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

// Update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "user" or "admin"'
      });
    }

    // Prevent changing own role
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    const [users] = await promisePool.execute(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await promisePool.execute(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );

    res.json({
      success: true,
      message: 'User role updated successfully'
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role',
      error: error.message
    });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting own account
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const [users] = await promisePool.execute(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await promisePool.execute('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

module.exports = router;


