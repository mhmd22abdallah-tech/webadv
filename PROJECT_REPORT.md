# Braca Store - E-commerce Web Application
## Project Report

---

## Executive Summary

**Project Name:** Braca Store E-commerce Platform  
**Type:** Full-Stack Web Application  
**Technology Stack:** React.js (Frontend) + Node.js/Express (Backend) + MySQL (Database)  
**Development Period:** 2024  
**Status:** ✅ Complete and Functional

---

## 1. Project Overview

### 1.1 Purpose
Braca Store is a fully functional e-commerce web application designed to provide users with a seamless online shopping experience. The platform enables customers to browse products, manage shopping carts, place orders, and allows administrators to manage inventory, categories, and orders through a comprehensive admin panel.

### 1.2 Key Features
- ✅ User authentication and authorization (Login/Register)
- ✅ Product browsing and search functionality
- ✅ Shopping cart management
- ✅ Order placement and tracking
- ✅ Admin panel for product and category management
- ✅ Image upload for products
- ✅ Category management system
- ✅ User profile management
- ✅ Secure payment processing interface

---

## 2. Technical Architecture

### 2.1 Frontend Architecture

**Technology Stack:**
- **Framework:** React 19.0.0
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM v7.1.5
- **UI Framework:** Bootstrap 5.3.3
- **Icons:** React Icons 5.4.0
- **Notifications:** SweetAlert2 11.16.0
- **HTTP Client:** Fetch API

**Key Components:**
```
src/
├── components/        # Reusable UI components
│   ├── Navbar.js     # Navigation bar with search
│   ├── Footer.js     # Footer component
│   ├── ProductCard.js # Product display card
│   └── ...
├── pages/            # Page components
│   ├── Home.js       # Homepage
│   ├── Shop.js       # Product listing
│   ├── Cart.js       # Shopping cart
│   ├── Checkout.js   # Checkout process
│   ├── Login.js      # Authentication
│   ├── AdminPanel.js # Admin dashboard
│   └── ...
├── redux/            # State management
│   ├── store.js      # Redux store configuration
│   ├── cartSlice.js  # Cart state management
│   └── productSlice.js # Product state management
└── services/         # API services
    └── api.js        # API communication layer
```

### 2.2 Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js
- **Framework:** Express.js 4.18.2
- **Database:** MySQL (via mysql2 3.6.5)
- **Authentication:** JWT (jsonwebtoken 9.0.2)
- **Security:** bcryptjs 2.4.3 (password hashing)
- **File Upload:** Multer 1.4.5-lts.1
- **Environment:** dotenv 16.3.1
- **CORS:** cors 2.8.5

**Backend Structure:**
```
backend/
├── config/
│   └── database.js      # MySQL connection pool
├── middleware/
│   ├── auth.js          # JWT authentication
│   ├── validation.js    # Input validation
│   └── upload.js       # File upload handling
├── routes/
│   ├── auth.js         # Authentication endpoints
│   ├── products.js     # Product CRUD operations
│   ├── orders.js       # Order management
│   ├── categories.js   # Category management
│   ├── users.js        # User profile management
│   └── admin.js        # Admin operations
├── scripts/
│   ├── seed.js         # Database seeding
│   └── resetAdmin.js   # Admin password reset
└── server.js           # Express server entry point
```

### 2.3 Database Architecture

**Database:** MySQL (XAMPP)  
**Database Name:** `ecommerce_db`

**Schema Design:**

1. **users** - User accounts
   - Primary Key: `id`
   - Fields: username, email, password (hashed), phone, role
   - Relationships: One-to-many with orders

2. **products** - Product catalog
   - Primary Key: `id`
   - Fields: name, description, price, category, image_url, stock
   - Relationships: One-to-many with order_items

3. **categories** - Product categories
   - Primary Key: `id`
   - Fields: name, description
   - Relationships: Referenced by products

4. **orders** - Customer orders
   - Primary Key: `id`
   - Foreign Key: `user_id` → users.id
   - Fields: order_number, total_price, status, shipping info, payment_method
   - Relationships: One-to-many with order_items

5. **order_items** - Order line items
   - Primary Key: `id`
   - Foreign Keys: `order_id` → orders.id, `product_id` → products.id
   - Fields: quantity, price

---

## 3. Core Functionalities

### 3.1 User Authentication

**Features:**
- User registration with validation
- Secure login with JWT tokens
- Password hashing using bcrypt
- Token-based session management
- Role-based access control (user/admin)

**Security Measures:**
- Password requirements: minimum 6 characters
- Email format validation
- Username uniqueness check
- JWT token expiration (7 days)
- Secure password storage (bcrypt hashing)

### 3.2 Product Management

**Public Features:**
- Browse all products
- Filter by category
- Search products by name/description
- View product details
- Pagination support

**Admin Features:**
- Create new products
- Update existing products
- Delete products
- Upload product images
- Manage product stock
- Set product prices and categories

### 3.3 Category Management

**Features:**
- Admin can create categories
- Edit category names and descriptions
- Delete categories (with product usage check)
- Categories automatically appear in product forms
- Prevents deletion of categories in use

### 3.4 Shopping Cart

**Features:**
- Add products to cart
- Remove products from cart
- Update quantities
- View cart total
- Persistent cart (Redux state)
- Cart validation before checkout

### 3.5 Order Processing

**Features:**
- Order creation with shipping information
- Multiple payment methods (COD, Debit Card)
- Order number generation
- Order status tracking
- Order history for users
- Stock management (automatic deduction)

### 3.6 Admin Panel

**Dashboard Features:**
- Product management (CRUD operations)
- Category management (CRUD operations)
- User management (view, role management)
- Order management (view all orders, update status)
- Statistics dashboard (optional)

**Access Control:**
- Admin-only routes protected by middleware
- Role verification on every admin request
- Automatic redirect for non-admin users

---

## 4. API Documentation

### 4.1 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### 4.2 Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/:id` | Get single product | No |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### 4.3 Category Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories` | Get all categories | No |
| GET | `/api/categories/:id` | Get single category | No |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

### 4.4 Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/orders` | Get orders (user's own or all if admin) | Yes |
| GET | `/api/orders/:id` | Get single order | Yes |
| POST | `/api/orders` | Create new order | Yes |
| PUT | `/api/orders/:id` | Update order status | Yes |
| DELETE | `/api/orders/:id` | Delete order | Admin |

### 4.5 User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update profile | Yes |
| PUT | `/api/users/change-password` | Change password | Yes |
| GET | `/api/users` | Get all users | Admin |

### 4.6 Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/dashboard` | Get dashboard stats | Admin |
| PUT | `/api/admin/users/:id/role` | Update user role | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |

---

## 5. Database Schema

### 5.1 Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 5.2 Products Table
```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url VARCHAR(500),
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 5.3 Categories Table
```sql
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 5.4 Orders Table
```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_zip VARCHAR(20) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 5.5 Order Items Table
```sql
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

---

## 6. Security Features

### 6.1 Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Role-based access control (RBAC)
- ✅ Token expiration (7 days)
- ✅ Secure token storage (localStorage)

### 6.2 Input Validation
- ✅ Server-side validation for all inputs
- ✅ Email format validation
- ✅ Password strength requirements
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (input sanitization)

### 6.3 Data Protection
- ✅ Environment variables for sensitive data
- ✅ Database connection pooling
- ✅ Foreign key constraints
- ✅ Transaction support for critical operations
- ✅ Error handling without exposing sensitive information

---

## 7. File Upload System

### 7.1 Image Upload Features
- ✅ Multer middleware for file handling
- ✅ Image file validation (jpeg, jpg, png, gif, webp)
- ✅ File size limit (5MB)
- ✅ Unique filename generation
- ✅ Automatic file cleanup on product deletion
- ✅ Static file serving
- ✅ Image preview before upload

### 7.2 Storage Structure
```
backend/uploads/images/
└── product-{timestamp}-{random}.{ext}
```

---

## 8. Project Setup & Installation

### 8.1 Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher) / XAMPP
- npm or yarn

### 8.2 Backend Setup
```bash
cd backend
npm install
# Create .env file with database credentials
npm start
```

### 8.3 Frontend Setup
```bash
npm install
npm start
```

### 8.4 Database Setup
1. Start XAMPP MySQL
2. Create database: `ecommerce_db`
3. Import `backend/database/schema.sql`
4. Run seed script: `npm run seed`

---

## 9. Testing & Validation

### 9.1 Functionality Testing
- ✅ User registration and login
- ✅ Product browsing and search
- ✅ Shopping cart operations
- ✅ Order placement
- ✅ Admin panel operations
- ✅ Category management
- ✅ Image upload

### 9.2 Security Testing
- ✅ Authentication token validation
- ✅ Role-based access control
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ Password hashing verification

---

## 10. Project Statistics

### 10.1 Code Metrics
- **Frontend Files:** 20+ React components
- **Backend Routes:** 6 route modules
- **Database Tables:** 5 tables
- **API Endpoints:** 25+ endpoints
- **Lines of Code:** ~3000+ lines

### 10.2 Features Implemented
- ✅ User Authentication (Login/Register)
- ✅ Product Management (CRUD)
- ✅ Category Management (CRUD)
- ✅ Shopping Cart
- ✅ Order Processing
- ✅ Admin Panel
- ✅ Image Upload
- ✅ Search & Filter
- ✅ User Profile Management

---

## 11. Deployment Information

### 11.1 Backend Deployment
- **Recommended:** Render, Railway, or Heroku
- **Database:** MySQL (cloud or local)
- **Environment Variables:** Required for production

### 11.2 Frontend Deployment
- **Recommended:** GitHub Pages, Netlify, or Vercel
- **Build Command:** `npm run build`
- **API URL:** Must be configured for production backend

---

## 12. Future Enhancements

### 12.1 Potential Improvements
- Payment gateway integration (Stripe, PayPal)
- Email notification system (Nodemailer)
- SMS notifications (Twilio)
- Product reviews and ratings
- Wishlist functionality
- Order tracking with real-time updates
- Advanced search with filters
- Product recommendations
- Multi-language support
- Responsive mobile app

### 12.2 Performance Optimizations
- Image optimization and CDN
- Caching strategies
- Database indexing optimization
- API response pagination
- Lazy loading for images

---

## 13. Project Deliverables

### 13.1 Code Deliverables
- ✅ Complete frontend React application
- ✅ Complete backend Node.js/Express API
- ✅ MySQL database schema
- ✅ Database seeding scripts
- ✅ Configuration files
- ✅ Documentation

### 13.2 Documentation Deliverables
- ✅ README.md (setup instructions)
- ✅ API documentation
- ✅ Database schema documentation
- ✅ Troubleshooting guide
- ✅ Admin login guide
- ✅ Image upload guide

---

## 14. Conclusion

### 14.1 Project Summary
Braca Store is a fully functional e-commerce platform that successfully implements all required features including user authentication, product management, order processing, and administrative controls. The application follows modern web development best practices with a clean architecture, secure authentication, and comprehensive error handling.

### 14.2 Technical Achievements
- ✅ Complete CRUD operations for all entities
- ✅ Secure authentication system
- ✅ Role-based access control
- ✅ File upload functionality
- ✅ Database relationships and constraints
- ✅ Input validation and error handling
- ✅ Responsive user interface
- ✅ Admin panel with full management capabilities

### 14.3 Learning Outcomes
- Full-stack web development
- RESTful API design
- Database design and management
- Authentication and security
- State management with Redux
- File upload handling
- Error handling and validation

---

## 15. Contact & Support

For questions or issues:
1. Check `README.md` for setup instructions
2. Review `backend/TROUBLESHOOTING.md` for common issues
3. Check backend console logs for errors
4. Verify database connection and environment variables

---

**Project Status:** ✅ Complete  
**Last Updated:** December 2024  
**Version:** 1.0.0

