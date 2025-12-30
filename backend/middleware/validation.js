// Pure JavaScript validation functions (no external dependencies)

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (basic validation)
const isValidPhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// User registration validation
const validateRegister = (req, res, next) => {
  const { username, email, password, phone } = req.body;
  const errors = [];

  // Validate username
  if (!username || username.trim().length < 3 || username.trim().length > 50) {
    errors.push('Username must be between 3 and 50 characters');
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }

  // Validate email
  if (!email || !isValidEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  // Validate password
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  // Validate phone (optional)
  if (phone && !isValidPhone(phone)) {
    errors.push('Please provide a valid phone number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// User login validation
const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  const errors = [];

  if (!username || username.trim().length === 0) {
    errors.push('Username is required');
  }

  if (!password || password.length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Product validation
const validateProduct = (req, res, next) => {
  const { name, price, category } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0 || name.trim().length > 255) {
    errors.push('Product name is required and must be less than 255 characters');
  }

  if (!price || isNaN(price) || parseFloat(price) < 0) {
    errors.push('Price must be a positive number');
  }

  if (!category || category.trim().length === 0) {
    errors.push('Category is required');
  }

  if (req.body.stock !== undefined && (isNaN(req.body.stock) || parseInt(req.body.stock) < 0)) {
    errors.push('Stock must be a non-negative integer');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Order validation
const validateOrder = (req, res, next) => {
  const { products, shippingAddress, shippingCity, shippingZip, paymentMethod } = req.body;
  const errors = [];

  if (!products || !Array.isArray(products) || products.length === 0) {
    errors.push('At least one product is required');
  } else {
    products.forEach((item, index) => {
      if (!item.productId || isNaN(item.productId) || parseInt(item.productId) < 1) {
        errors.push(`Product ${index + 1}: Valid product ID is required`);
      }
      if (!item.quantity || isNaN(item.quantity) || parseInt(item.quantity) < 1) {
        errors.push(`Product ${index + 1}: Quantity must be at least 1`);
      }
    });
  }

  if (!shippingAddress || shippingAddress.trim().length < 5) {
    errors.push('Shipping address is required');
  }

  if (!shippingCity || shippingCity.trim().length === 0) {
    errors.push('Shipping city is required');
  }

  if (!shippingZip || shippingZip.trim().length === 0) {
    errors.push('Shipping zip code is required');
  }

  const validPaymentMethods = ['cod', 'dc', 'credit_card', 'debit_card'];
  if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
    errors.push('Valid payment method is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validateOrder
};
