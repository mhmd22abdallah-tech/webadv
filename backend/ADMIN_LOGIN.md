# How to Login as Admin

## Step 1: Create Admin User (If Not Already Created)

The admin user needs to be created first. You have two options:

### Option A: Run Seed Script (Recommended)

```bash
cd backend
npm run seed
```

This will create:
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@bracastore.com`
- **Role:** `admin`

### Option B: Create Admin Manually via SQL

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Select `ecommerce_db` database
3. Go to SQL tab
4. Run this SQL (password is hashed for 'admin123'):

```sql
INSERT INTO users (username, email, password, role) 
VALUES (
  'admin', 
  'admin@bracastore.com', 
  '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 
  'admin'
);
```

**Note:** The above hash is a placeholder. It's better to use the seed script which properly hashes the password.

## Step 2: Login as Admin

1. **Start your backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Open your frontend application:**
   - Go to login page: `http://localhost:3000/login`

3. **Enter admin credentials:**
   - **Username:** `admin`
   - **Password:** `admin123`

4. **Click "Sign In"**

## Step 3: Verify Admin Access

After logging in, you can access admin features:

### Admin API Endpoints

- **Dashboard:** `GET /api/admin/dashboard`
- **Manage Users:** `GET /api/users` (see all users)
- **Update User Role:** `PUT /api/admin/users/:id/role`
- **Delete User:** `DELETE /api/admin/users/:id`
- **Manage Products:** Full CRUD on `/api/products`
- **Manage Orders:** Full access to `/api/orders`

### Test Admin Access

You can test if you're logged in as admin by calling:

```javascript
// In browser console or Postman
fetch('http://localhost:5000/api/admin/dashboard', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

## Important Security Notes

⚠️ **Change the admin password after first login!**

1. Login as admin
2. Use the change password endpoint or update directly in database
3. For production, use a strong password

## Troubleshooting

### "Invalid credentials" error
- Make sure admin user exists in database
- Run `npm run seed` to create admin user
- Check database connection in `.env` file

### "Admin access required" error
- Verify your user has `role = 'admin'` in database
- Check JWT token is valid
- Make sure you're logged in

### Check if admin exists in database

Run this SQL in phpMyAdmin:
```sql
SELECT id, username, email, role FROM users WHERE username = 'admin';
```

If no results, the admin user doesn't exist. Run the seed script.

