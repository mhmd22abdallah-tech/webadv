const express = require('express');
const { promisePool } = require('../config/database');
const { validateProduct } = require('../middleware/validation');
const { authenticate, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await promisePool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = [];
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    if (search) {
      countQuery += ' AND (name LIKE ? OR description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await promisePool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await promisePool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product: products[0]
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// Create product (admin only) - with file upload support
router.post('/', authenticate, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, image_url, stock } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      // Delete uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category are required'
      });
    }

    // Use uploaded file path or provided image_url
    let finalImageUrl = image_url || null;
    if (req.file) {
      finalImageUrl = `/uploads/images/${req.file.filename}`;
    }

    const [result] = await promisePool.execute(
      'INSERT INTO products (name, description, price, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || null, price, category, finalImageUrl, stock || 0]
    );

    const [products] = await promisePool.execute(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: products[0]
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// Update product (admin only) - with file upload support
router.put('/:id', authenticate, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url, stock } = req.body;

    // Check if product exists
    const [existingProducts] = await promisePool.execute(
      'SELECT id, image_url FROM products WHERE id = ?',
      [id]
    );

    if (existingProducts.length === 0) {
      // Delete uploaded file if product doesn't exist
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const existingProduct = existingProducts[0];
    let finalImageUrl = image_url || existingProduct.image_url;

    // If new file uploaded, use it and delete old file if exists
    if (req.file) {
      finalImageUrl = `/uploads/images/${req.file.filename}`;
      // Delete old image file if it exists and is in uploads folder
      if (existingProduct.image_url && existingProduct.image_url.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', existingProduct.image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    await promisePool.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, category = ?, image_url = ?, stock = ? WHERE id = ?',
      [name, description || null, price, category, finalImageUrl, stock || 0, id]
    );

    const [products] = await promisePool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: products[0]
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists and get image path
    const [existingProducts] = await promisePool.execute(
      'SELECT id, image_url FROM products WHERE id = ?',
      [id]
    );

    if (existingProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const existingProduct = existingProducts[0];

    // Delete product from database
    await promisePool.execute('DELETE FROM products WHERE id = ?', [id]);

    // Delete associated image file if it exists in uploads folder
    if (existingProduct.image_url && existingProduct.image_url.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', existingProduct.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

module.exports = router;


