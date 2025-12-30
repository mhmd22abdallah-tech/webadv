# Database Setup for XAMPP

This folder contains SQL scripts to set up the database for XAMPP's MySQL.

## Setup Instructions for XAMPP

### Method 1: Using phpMyAdmin (Recommended)

1. **Start XAMPP:**
   - Open XAMPP Control Panel
   - Start Apache and MySQL services

2. **Access phpMyAdmin:**
   - Open your browser
   - Go to: `http://localhost/phpmyadmin`

3. **Create Database:**
   - Click on "New" in the left sidebar
   - Database name: `ecommerce_db`
   - Collation: `utf8mb4_unicode_ci`
   - Click "Create"

4. **Import Schema:**
   - Select `ecommerce_db` database
   - Click on "Import" tab
   - Click "Choose File" and select `schema.sql`
   - Click "Go" at the bottom

5. **Import Seed Data (Optional):**
   - While still in `ecommerce_db` database
   - Click on "Import" tab again
   - Click "Choose File" and select `seed.sql`
   - Click "Go"

### Method 2: Using MySQL Command Line

1. **Open MySQL Command Line:**
   - Open XAMPP Control Panel
   - Click "Shell" button
   - Or open Command Prompt and navigate to: `C:\xampp\mysql\bin`

2. **Run SQL Scripts:**
   ```bash
   mysql -u root -p < schema.sql
   mysql -u root -p < seed.sql
   ```
   (Press Enter when prompted for password, or enter your MySQL root password if set)

### Method 3: Using Node.js Seed Script (Recommended for Admin User)

The Node.js seed script will create the admin user with proper password hashing:

1. **First, import schema.sql** (using Method 1 or 2)

2. **Then run the Node.js seed script:**
   ```bash
   cd backend
   npm run seed
   ```

   This will:
   - Create admin user with username: `admin`, password: `admin123`
   - Insert sample products

## Database Configuration

After setting up the database, update your `backend/.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          # Leave empty if no password set in XAMPP
DB_NAME=ecommerce_db
```

## Default Admin Credentials

After running the seed script:
- **Username:** `admin`
- **Password:** `admin123`

**Important:** Change the admin password after first login in production!

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
- XAMPP MySQL root user might have a password
- Update `DB_PASSWORD` in `.env` file
- Or reset MySQL password in XAMPP

### Error: "Table already exists"
- The tables are already created
- You can drop the database and recreate it, or
- Use `DROP TABLE IF EXISTS` statements before creating tables

### Error: "Cannot connect to MySQL"
- Make sure MySQL service is running in XAMPP Control Panel
- Check if port 3306 is available
- Verify `DB_HOST` is set to `localhost` in `.env`

## Database Structure

- **users** - User accounts and authentication
- **products** - Product catalog
- **orders** - Customer orders
- **order_items** - Items in each order

All tables have proper foreign key relationships and indexes for optimal performance.

