# Troubleshooting Guide

## "Route not found" Error When Creating Category

If you're getting a "Route not found" error when creating a category, follow these steps:

### 1. Restart Backend Server

The most common cause is that the backend server needs to be restarted to load the new categories route.

**Steps:**
1. Stop the backend server (Ctrl+C in the terminal where it's running)
2. Restart it:
   ```bash
   cd backend
   npm start
   ```

### 2. Verify Route is Registered

Check the console output when starting the server. You should see:
```
Registered routes:
  - /api/auth
  - /api/products
  - /api/orders
  - /api/users
  - /api/admin
  - /api/categories
```

### 3. Check Database Table Exists

Make sure the `categories` table exists in your database:

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Select `ecommerce_db` database
3. Check if `categories` table exists
4. If not, run the SQL from `backend/database/schema.sql` or restart the server (it auto-creates tables)

### 4. Verify Authentication

Make sure you're logged in as admin:
- Check browser console for authentication errors
- Verify token exists: `localStorage.getItem('token')` in browser console
- Try logging out and logging back in

### 5. Test API Directly

Test the categories endpoint directly:

**Get all categories:**
```bash
curl http://localhost:5000/api/categories
```

**Create category (requires admin token):**
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"Test Category","description":"Test"}'
```

### 6. Check Browser Console

Open browser developer tools (F12) and check:
- Network tab: See the actual request being sent
- Console tab: Check for any JavaScript errors
- Look for the actual error message and status code

### 7. Verify Backend is Running

Make sure the backend server is actually running:
- Check terminal for "Server is running on port 5000"
- Try accessing: `http://localhost:5000/api/health`
- Should return: `{"status":"OK","message":"Server is running"}`

### Common Solutions

1. **Restart backend server** - Most common fix
2. **Clear browser cache** - Sometimes cached routes cause issues
3. **Check API URL** - Verify `REACT_APP_API_URL` is correct
4. **Verify database connection** - Check `.env` file settings
5. **Check for typos** - Verify route path matches exactly

### Still Not Working?

1. Check backend console logs for errors
2. Verify the categories route file exists: `backend/routes/categories.js`
3. Check if port 5000 is available and not blocked
4. Try accessing the route directly in browser: `http://localhost:5000/api/categories`

