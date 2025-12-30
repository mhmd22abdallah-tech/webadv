# Braca Store - E-commerce Web Application

A full-stack e-commerce web application built with React (frontend) and Node.js/Express (backend) with MySQL database. This project provides a complete shopping experience with user authentication, product management, order processing, and admin functionality.

## Project Description

Braca Store is a modern e-commerce platform that allows users to browse products, add items to cart, place orders, and manage their accounts. The application includes:

- **User Authentication**: Secure login and registration with JWT tokens
- **Product Management**: Browse products by category, search functionality
- **Shopping Cart**: Add/remove items, view cart summary
- **Order Processing**: Place orders with shipping information and payment methods
- **Admin Panel**: Manage products, categories, users, and orders (admin only)
- **Image Upload**: Upload product images directly from admin panel
- **Category Management**: Admin can create and manage product categories

## Tech Stack

### Frontend
- React 19.0.0
- Redux Toolkit (state management)
- React Router DOM (routing)
- Bootstrap 5 (styling)
- React Icons
- SweetAlert2 (notifications)

### Backend
- Node.js
- Express.js
- MySQL2 (database)
- JWT (authentication)
- Bcryptjs (password hashing)
- Multer (file upload)
- Pure JavaScript validation (no external validation library)

## Project Structure

```
ecommerce-react/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   └── validation.js        # Input validation middleware
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── products.js          # Product CRUD routes
│   │   ├── orders.js            # Order CRUD routes
│   │   ├── users.js             # User profile routes
│   │   └── admin.js             # Admin panel routes
│   ├── database/
│   │   ├── schema.sql          # Database schema
│   │   └── seed.sql            # Sample data
│   ├── scripts/
│   │   └── seed.js              # Database seeding script
│   ├── server.js                # Express server entry point
│   ├── package.json
│   └── .env.example             # Environment variables template
├── src/
│   ├── components/              # React components
│   ├── pages/                  # Page components
│   ├── redux/                  # Redux store and slices
│   ├── services/
│   │   └── api.js              # API service layer
│   └── ...
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create MySQL database:**
   ```sql
   CREATE DATABASE ecommerce_db;
   ```

4. **Configure environment variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and update the following:
     ```env
     PORT=5000
     NODE_ENV=development
     
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_mysql_password
     DB_NAME=ecommerce_db
     
     JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
     
     ```

5. **Initialize database tables:**
   - The database tables will be created automatically when you start the server
   - To seed initial data (admin user and sample products), run:
     ```bash
     node scripts/seed.js
     ```
   - Default admin credentials:
     - Username: `admin`
     - Password: `admin123`

6. **Start the backend server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to project root (if not already there):**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API URL (optional):**
   - Create a `.env` file in the root directory:
     ```env
     REACT_APP_API_URL=http://localhost:5000/api
     ```
   - If not set, it defaults to `http://localhost:5000/api`

4. **Start the development server:**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## Database Schema

### Users Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `username` (VARCHAR(50), UNIQUE, NOT NULL)
- `email` (VARCHAR(100), UNIQUE, NOT NULL)
- `password` (VARCHAR(255), NOT NULL) - hashed with bcrypt
- `phone` (VARCHAR(20))
- `role` (ENUM: 'user', 'admin') - default: 'user'
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Products Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `name` (VARCHAR(255), NOT NULL)
- `description` (TEXT)
- `price` (DECIMAL(10, 2), NOT NULL)
- `category` (VARCHAR(100), NOT NULL)
- `image_url` (VARCHAR(500))
- `stock` (INT, DEFAULT 0)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Orders Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (INT, FOREIGN KEY → users.id)
- `order_number` (VARCHAR(50), UNIQUE, NOT NULL)
- `total_price` (DECIMAL(10, 2), NOT NULL)
- `status` (ENUM: 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
- `shipping_address` (TEXT, NOT NULL)
- `shipping_city` (VARCHAR(100), NOT NULL)
- `shipping_zip` (VARCHAR(20), NOT NULL)
- `payment_method` (VARCHAR(50), NOT NULL)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Order Items Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `order_id` (INT, FOREIGN KEY → orders.id)
- `product_id` (INT, FOREIGN KEY → products.id)
- `quantity` (INT, NOT NULL)
- `price` (DECIMAL(10, 2), NOT NULL)
- `created_at` (TIMESTAMP)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (admin only, supports file upload)
- `PUT /api/products/:id` - Update product (admin only, supports file upload)
- `DELETE /api/products/:id` - Delete product (admin only)

### Categories
- `GET /api/categories` - Get all categories (public)
- `GET /api/categories/:id` - Get single category (public)
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Orders
- `GET /api/orders` - Get all orders (user's own or all if admin)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order (requires auth)
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order (admin only)

### Users
- `GET /api/users/profile` - Get user profile (requires auth)
- `PUT /api/users/profile` - Update user profile (requires auth)
- `PUT /api/users/change-password` - Change password (requires auth)
- `GET /api/users` - Get all users (admin only)

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics (admin only)
- `PUT /api/admin/users/:id/role` - Update user role (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

## Features

### User Features
- ✅ User registration and login
- ✅ Browse products by category
- ✅ Search products
- ✅ Add products to cart
- ✅ View cart and checkout
- ✅ Place orders
- ✅ View order history
- ✅ Update profile
- ✅ Change password

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ Manage products (CRUD operations with image upload)
- ✅ Manage categories (CRUD operations)
- ✅ Manage users
- ✅ View all orders
- ✅ Update order status
- ✅ Manage user roles

### Additional Features
- ✅ Image upload for products
- ✅ Category management system
- ✅ Input validation and error handling
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Admin panel with tabbed interface
- ✅ File upload with preview
- ✅ Automatic file cleanup

## Deployment

### Backend Deployment (Render/Railway)

1. **Prepare for deployment:**
   - Update `.env` with production database credentials
   - Ensure all environment variables are set in your hosting platform

2. **For Render:**
   - Connect your GitHub repository
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`
   - Add environment variables in Render dashboard

3. **For Railway:**
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Add environment variables in Railway dashboard

### Frontend Deployment (GitHub Pages)

1. **Update API URL:**
   - Update `REACT_APP_API_URL` in `.env` to your deployed backend URL

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Deploy to GitHub Pages:**
   - Install gh-pages: `npm install --save-dev gh-pages`
   - Add to `package.json`:
     ```json
     "homepage": "https://yourusername.github.io/ecommerce-react",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
     ```
   - Deploy: `npm run deploy`

## Git Version Control

This project uses Git for version control. Make sure to:

1. Initialize git repository (if not already):
   ```bash
   git init
   ```

2. Add all files:
   ```bash
   git add .
   ```

3. Commit changes:
   ```bash
   git commit -m "Initial commit: Complete e-commerce application with backend"
   ```

4. Connect to remote repository:
   ```bash
   git remote add origin <your-repository-url>
   git push -u origin main
   ```

## Testing the Application

1. **Start backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Start frontend server:**
   ```bash
   npm start
   ```

3. **Test user registration:**
   - Navigate to `/register`
   - Create a new account

4. **Test admin access:**
   - Login with admin credentials (username: `admin`, password: `admin123`)
   - Access admin dashboard at `/api/admin/dashboard`

5. **Test product browsing:**
   - Browse products on home page
   - Search for products
   - Filter by category

6. **Test order placement:**
   - Add products to cart
   - Proceed to checkout
   - Place an order

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists: `CREATE DATABASE ecommerce_db;`

### Port Already in Use
- Change `PORT` in backend `.env` file
- Update `REACT_APP_API_URL` in frontend `.env` accordingly

### Image Upload Issues
- Check `backend/uploads/images/` directory exists
- Verify file size is under 5MB
- Ensure file type is: jpeg, jpg, png, gif, or webp
- Check backend console for upload errors

## License

This project is created for educational purposes.

## Author

Developed as part of a full-stack web development project.

---

**Note:** Make sure to change the default admin password and JWT secret in production!
