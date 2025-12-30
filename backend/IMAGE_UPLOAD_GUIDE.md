# Image Upload Guide

## Features Added

✅ **File Upload Support** - Upload product images directly from admin panel
✅ **Image Preview** - See image before saving
✅ **Automatic File Management** - Old images deleted when updating/deleting products
✅ **Fallback to URL** - Can still use image URLs if preferred
✅ **File Validation** - Only image files allowed (jpeg, jpg, png, gif, webp)
✅ **File Size Limit** - Maximum 5MB per image

## How to Use

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install `multer` package for file uploads.

### 2. Upload Directory

The uploads directory is automatically created at:
- `backend/uploads/images/`

Images are stored with unique filenames like: `product-1234567890-987654321.jpg`

### 3. Using Admin Panel

1. **Login as admin** (username: `admin`, password: `admin123`)
2. **Go to Admin Panel**: Click "Admin" link in navbar or visit `/admin`
3. **Add/Edit Product**:
   - Click "Add New Product" or "Edit" on existing product
   - Fill in product details
   - **Upload Image**: Click "Choose File" and select an image
   - OR enter an Image URL (if you don't want to upload)
   - Preview will show automatically
   - Click "Create Product" or "Update Product"

### 4. Image Access

Uploaded images are accessible at:
- `http://localhost:5000/uploads/images/filename.jpg`

The backend automatically serves these files statically.

## Technical Details

### Backend Changes

- **Multer Middleware**: Handles file uploads
- **File Storage**: Disk storage in `uploads/images/`
- **File Naming**: Unique filenames with timestamp
- **File Validation**: Only image types, max 5MB
- **Auto Cleanup**: Old images deleted when product updated/deleted

### Frontend Changes

- **File Input**: Added file upload input in admin form
- **FormData**: Uses FormData instead of JSON for file uploads
- **Image Preview**: Shows preview before upload
- **Dual Mode**: Supports both file upload and URL input

## File Structure

```
backend/
├── uploads/
│   └── images/          # Uploaded product images
├── middleware/
│   └── upload.js       # Multer configuration
└── routes/
    └── products.js     # Updated with file upload support
```

## Troubleshooting

### "Cannot find module 'multer'"
- Run: `npm install` in backend directory

### "Upload directory not found"
- The directory is created automatically on first upload
- Or create manually: `backend/uploads/images/`

### "File too large"
- Maximum file size is 5MB
- Compress images before uploading

### "Only image files allowed"
- Make sure file is: jpeg, jpg, png, gif, or webp
- Check file extension

### Images not displaying
- Check that backend server is running
- Verify image path in database starts with `/uploads/images/`
- Check browser console for 404 errors

## Notes

- Uploaded images are stored on the server
- Old images are automatically deleted when products are updated/deleted
- Image URLs in database are relative paths: `/uploads/images/filename.jpg`
- For production, consider using cloud storage (AWS S3, Cloudinary, etc.)

