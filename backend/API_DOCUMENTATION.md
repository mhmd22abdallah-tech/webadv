# API Documentation - Braca Store

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication via JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

---

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Get Current User
**GET** `/api/auth/me`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## Product Endpoints

### Get All Products
**GET** `/api/products`

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search in name/description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Get Single Product
**GET** `/api/products/:id`

**Response:**
```json
{
  "success": true,
  "product": {
    "id": 1,
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "category": "T-Shirt",
    "image_url": "/uploads/images/product-123.jpg",
    "stock": 50
  }
}
```

### Create Product
**POST** `/api/products`  
**Auth Required:** Admin

**Request Body (FormData):**
```
name: "Product Name"
description: "Product description"
price: 99.99
category: "T-Shirt"
stock: 50
image: <file> (optional)
image_url: "/images/product.png" (optional, if no file)
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {...}
}
```

### Update Product
**PUT** `/api/products/:id`  
**Auth Required:** Admin

**Request Body:** Same as Create Product

### Delete Product
**DELETE** `/api/products/:id`  
**Auth Required:** Admin

---

## Category Endpoints

### Get All Categories
**GET** `/api/categories`

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "id": 1,
      "name": "T-Shirt",
      "description": "T-Shirt category"
    }
  ]
}
```

### Create Category
**POST** `/api/categories`  
**Auth Required:** Admin

**Request Body:**
```json
{
  "name": "New Category",
  "description": "Category description"
}
```

### Update Category
**PUT** `/api/categories/:id`  
**Auth Required:** Admin

### Delete Category
**DELETE** `/api/categories/:id`  
**Auth Required:** Admin  
**Note:** Cannot delete if used by products

---

## Order Endpoints

### Get Orders
**GET** `/api/orders`  
**Auth Required:** Yes

**Query Parameters:**
- `page` (optional)
- `limit` (optional)
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": 1,
      "order_number": "ORD-1234567890-ABC",
      "total_price": 199.98,
      "status": "pending",
      "items": [...]
    }
  ]
}
```

### Create Order
**POST** `/api/orders`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "products": [
    {
      "productId": 1,
      "quantity": 2
    }
  ],
  "shippingAddress": "123 Main St",
  "shippingCity": "New York",
  "shippingZip": "10001",
  "paymentMethod": "cod"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {...}
}
```

### Update Order Status
**PUT** `/api/orders/:id`  
**Auth Required:** Yes (Admin can update, users can only cancel)

**Request Body:**
```json
{
  "status": "processing"
}
```

---

## User Endpoints

### Get Profile
**GET** `/api/users/profile`  
**Auth Required:** Yes

### Update Profile
**PUT** `/api/users/profile`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "phone": "+1234567890"
}
```

### Change Password
**PUT** `/api/users/change-password`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

---

## Admin Endpoints

### Get Dashboard
**GET** `/api/admin/dashboard`  
**Auth Required:** Admin

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 100,
    "totalProducts": 50,
    "totalOrders": 200,
    "totalRevenue": 50000.00,
    "ordersByStatus": {...},
    "recentOrders": [...]
  }
}
```

### Update User Role
**PUT** `/api/admin/users/:id/role`  
**Auth Required:** Admin

**Request Body:**
```json
{
  "role": "admin"
}
```

### Delete User
**DELETE** `/api/admin/users/:id`  
**Auth Required:** Admin

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Validation error 1", "Validation error 2"] // Optional
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting
Currently not implemented. Recommended for production.

## CORS
Configured to allow requests from frontend origin.

