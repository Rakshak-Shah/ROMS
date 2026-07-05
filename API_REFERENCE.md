# 📡 ROMS API Reference

Base URL: `http://localhost:4000`

---

## 🔓 Authentication Endpoints

### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@deliciousrestaurant.com",
  "password": "AdminPass123!"
}
```

### Logout
```http
POST /api/auth/logout
```

---

## 🍕 Menu Endpoints

### Get All Menu Items
```http
GET /api/menu
GET /api/menu?category=appetizers
GET /api/menu?available=true
```

**Response:**
```json
{
  "status": "success",
  "results": 10,
  "data": {
    "menuItems": [
      {
        "id": "...",
        "name": "Bruschetta al Pomodoro",
        "description": "Toasted bread...",
        "price": 12.99,
        "category": "appetizers",
        "isAvailable": true,
        "preparationTime": 10,
        "rating": 0,
        "createdBy": "..."
      }
    ]
  }
}
```

### Get Menu Item by ID
```http
GET /api/menu/507f1f77bcf86cd799439011
```

### Get Items by Category
```http
GET /api/menu/category/appetizers
GET /api/menu/category/mains
GET /api/menu/category/pasta
GET /api/menu/category/desserts
GET /api/menu/category/beverages
```

### Create Menu Item (Admin Only)
```http
POST /api/menu
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "New Dish",
  "description": "Delicious new item",
  "price": 24.99,
  "category": "mains",
  "preparationTime": 20,
  "servingSize": "1 portion",
  "ingredients": ["chicken", "sauce", "vegetables"],
  "isVegetarian": false
}
```

### Update Menu Item (Admin Only)
```http
PATCH /api/menu/507f1f77bcf86cd799439011
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "price": 22.99,
  "isAvailable": false
}
```

### Delete Menu Item (Admin Only)
```http
DELETE /api/menu/507f1f77bcf86cd799439011
Authorization: Bearer <admin-token>
```

---

## 🛒 Order Endpoints (Protected)

All order endpoints require authentication.

### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "menuItem": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "specialInstructions": "No onions"
    }
  ],
  "orderType": "delivery",
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001",
    "phone": "+1234567890"
  },
  "paymentMethod": "online"
}
```

### Get My Orders
```http
GET /api/orders/my-orders
Authorization: Bearer <token>
```

### Get Single Order
```http
GET /api/orders/507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

### Cancel Order
```http
PATCH /api/orders/507f1f77bcf86cd799439011/cancel
Authorization: Bearer <token>
```

### Get All Orders (Admin/Staff)
```http
GET /api/orders
Authorization: Bearer <admin-token>
```

### Update Order Status (Admin/Staff)
```http
PATCH /api/orders/507f1f77bcf86cd799439011/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "preparing"
}
```

**Status Values:**
- `pending`
- `confirmed`
- `preparing`
- `ready`
- `out-for-delivery`
- `delivered`
- `cancelled`

---

## 📅 Reservation Endpoints (Protected)

### Create Reservation
```http
POST /api/reservations
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "date": "2025-11-01",
  "time": "7:00 PM",
  "guests": 4,
  "specialRequests": "Window seat preferred"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "reservation": {
      "confirmationCode": "RES123456789",
      "status": "pending",
      "date": "2025-11-01T00:00:00.000Z",
      "time": "7:00 PM",
      "guests": 4
    }
  }
}
```

### Get My Reservations
```http
GET /api/reservations/my-reservations
Authorization: Bearer <token>
```

### Get All Reservations (Admin/Staff)
```http
GET /api/reservations
Authorization: Bearer <admin-token>
```

### Confirm Reservation (Admin/Staff)
```http
PATCH /api/reservations/507f1f77bcf86cd799439011/confirm
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "tableNumber": 5
}
```

---

## 🪑 Table Endpoints

### Get Table Info via QR Code (Public)
```http
GET /api/tables/qr/5
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "table": {
      "number": 5,
      "capacity": 4,
      "status": "available",
      "qrCodeMenuUrl": "http://localhost:3000/menu?table=5"
    }
  }
}
```

### Get All Tables (Admin/Staff)
```http
GET /api/tables
Authorization: Bearer <admin-token>
```

### Create Table (Admin)
```http
POST /api/tables
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "number": 10,
  "capacity": 4,
  "location": "Main dining area",
  "features": ["window-view", "wheelchair-accessible"]
}
```

### Generate QR Code (Admin)
```http
POST /api/tables/507f1f77bcf86cd799439011/generate-qr
Authorization: Bearer <admin-token>
```

### Update Table Status (Admin/Staff)
```http
PATCH /api/tables/507f1f77bcf86cd799439011/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "occupied"
}
```

---

## ⭐ Review Endpoints

### Get All Reviews (Public)
```http
GET /api/reviews
GET /api/reviews?page=1&limit=10
```

### Get Reviews for Menu Item
```http
GET /api/reviews/menu-item/507f1f77bcf86cd799439011
```

### Get Review Statistics
```http
GET /api/reviews/stats
```

### Create Review (Protected)
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "order": "507f1f77bcf86cd799439011",
  "menuItem": "507f1f77bcf86cd799439012",
  "rating": 5,
  "title": "Amazing food!",
  "comment": "Best pasta I've ever had. Will definitely order again!"
}
```

### Get My Reviews
```http
GET /api/reviews/my-reviews
Authorization: Bearer <token>
```

### Update Review
```http
PATCH /api/reviews/507f1f77bcf86cd799439011
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated: Still good but service was slow"
}
```

### Mark Review as Helpful
```http
POST /api/reviews/507f1f77bcf86cd799439011/helpful
Authorization: Bearer <token>
```

### Approve Review (Admin)
```http
PATCH /api/reviews/507f1f77bcf86cd799439011/approve
Authorization: Bearer <admin-token>
```

### Respond to Review (Admin/Staff)
```http
POST /api/reviews/507f1f77bcf86cd799439011/respond
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "content": "Thank you for your feedback! We're glad you enjoyed your meal."
}
```

---

## 👤 User Profile Endpoints (Protected)

### Get My Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

### Update Profile
```http
PATCH /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+0987654321"
}
```

### Get My Addresses
```http
GET /api/users/addresses
Authorization: Bearer <token>
```

### Add Address
```http
POST /api/users/addresses
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "home",
  "address": "456 Oak Street",
  "city": "Boston",
  "state": "MA",
  "zipCode": "02101",
  "isDefault": true
}
```

### Get Order History
```http
GET /api/users/orders
Authorization: Bearer <token>
```

### Get Reservation History
```http
GET /api/users/reservations
Authorization: Bearer <token>
```

---

## 🔧 Admin Endpoints (Admin Only)

### Get Dashboard Data
```http
GET /api/admin/dashboard
Authorization: Bearer <admin-token>
```

### Get Analytics
```http
GET /api/admin/analytics
Authorization: Bearer <admin-token>
```

### Get Sales Reports
```http
GET /api/admin/reports/sales?start=2025-01-01&end=2025-12-31
Authorization: Bearer <admin-token>
```

### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <admin-token>
```

### Deactivate User
```http
PATCH /api/admin/users/507f1f77bcf86cd799439011/deactivate
Authorization: Bearer <admin-token>
```

---

## 🏥 Health Check

### Check Server Status (Public)
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-29T07:54:13.000Z",
  "uptime": 3600.45,
  "environment": "development",
  "version": "1.0.0"
}
```

---

## 📊 Response Formats

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    ...
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## 🔑 Authentication

Most endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Expiration:**
- Access Token: 7 days
- Refresh Token: 30 days

---

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
- `501` - Not Implemented (scaffolded endpoints)

---

## 🧪 Testing with cURL

### Register User
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@deliciousrestaurant.com",
    "password": "AdminPass123!"
  }'
```

### Get Menu
```bash
curl http://localhost:4000/api/menu
```

### Get Menu with Auth
```bash
curl http://localhost:4000/api/orders/my-orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 💡 Quick Tips

1. **Always include Content-Type header** for POST/PATCH requests
2. **Store tokens securely** - never expose in client-side code
3. **Handle token expiration** - use refresh tokens or re-authenticate
4. **Test with Postman** for easier API testing
5. **Check server logs** at `backend/logs/` for debugging

---

**🎯 Ready to Test!**

Start your backend with `npm start` and begin making requests!
