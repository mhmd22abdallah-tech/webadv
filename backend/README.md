# E-commerce Backend - Pure Node.js with MySQL (XAMPP)

Pure Node.js backend API for e-commerce application using Express.js and MySQL database (XAMPP).

## Dependencies

Only essential packages (no email/SMS services):
- **express** - Web framework
- **mysql2** - MySQL database driver
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup XAMPP MySQL Database

1. **Start XAMPP:**
   - Open XAMPP Control Panel
   - Start MySQL service

2. **Create Database:**
   - Open phpMyAdmin: `http://localhost/phpmyadmin`
   - Click "New" → Database name: `ecommerce_db` → Create

3. **Import SQL Schema:**
   - Select `ecommerce_db` database
   - Click "Import" tab
   - Choose file: `database/schema.sql`
   - Click "Go"

4. **Seed Database (Optional):**
   ```bash
   npm run seed
   ```
   This creates admin user (username: `admin`, password: `admin123`) and sample products.

### 3. Configure Environment Variables

Create `.env` file in `backend` folder:

```env
PORT=5000
NODE_ENV=development

# XAMPP MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          # Leave empty if no password set
DB_NAME=ecommerce_db

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. Start Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order (requires auth)
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order (admin only)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics (admin only)
- `PUT /api/admin/users/:id/role` - Update user role (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

## Database Schema

The database includes 4 main tables:
- **users** - User accounts and authentication
- **products** - Product catalog
- **orders** - Customer orders
- **order_items** - Items in each order

See `database/schema.sql` for complete table structure.

## Default Admin Credentials

After running seed script:
- **Username:** `admin`
- **Password:** `admin123`

**Important:** Change the admin password after first login!

## Features

✅ User authentication (JWT)
✅ Password hashing (bcrypt)
✅ CRUD operations for products
✅ CRUD operations for orders
✅ User profile management
✅ Admin panel
✅ Input validation (pure JavaScript)
✅ Error handling
✅ MySQL database with XAMPP

## Project Structure

```
backend/
├── config/
│   └── database.js          # MySQL connection
├── middleware/
│   ├── auth.js             # JWT authentication
│   └── validation.js       # Input validation (pure JS)
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── products.js         # Product routes
│   ├── orders.js           # Order routes
│   ├── users.js            # User routes
│   └── admin.js            # Admin routes
├── database/
│   ├── schema.sql          # Database schema
│   └── seed.sql            # Sample data
├── scripts/
│   └── seed.js             # Database seeding script
├── server.js               # Express server
└── package.json           # Dependencies
```

## Troubleshooting

### Database Connection Error
- Make sure MySQL is running in XAMPP
- Check `DB_HOST`, `DB_USER`, `DB_PASSWORD` in `.env`
- Verify database `ecommerce_db` exists

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop other services using port 5000

### Module Not Found
- Run `npm install` again
- Check `package.json` dependencies

## License

ISC

