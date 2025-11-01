# Delicious Restaurant Management System

A modern, responsive restaurant management website built with Next.js 15, React, TypeScript, and Tailwind CSS.

## Features

### 🍽️ Complete Restaurant Experience
- **Homepage** with hero section and main dining options
- **Interactive Menu** with categories, add to cart functionality
- **QR Code Ordering System** for table-based ordering
- **Shopping Cart** with online/offline payment options
- **Table Reservations** with date/time selection
- **Special Offers** page with promotional deals
- **Customer Reviews** with rating system
- **Contact Us** form with restaurant information
- **User Authentication** (Login/Signup)

### 📱 QR Code Table Ordering
- Generate unique QR codes for each table
- Customers scan QR code to access menu with table context
- Orders are automatically linked to specific tables
- Supports both dine-in and takeout orders

### 🛒 Shopping Cart & Checkout
- Add/remove items with quantity controls
- Real-time cart updates across the application
- Tax calculation and order summary
- Choose between online payment or pay-at-counter
- Order confirmation with detailed receipt

### 🎨 Modern Design
- Clean, classy, and simple interface
- Fully responsive design for all devices
- Smooth animations and transitions
- Professional color scheme with amber/orange theme
- Consistent typography and spacing

## Getting Started

### Backend setup (MongoDB Atlas + API)

1) Open backend folder and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2) Configure environment variables in `backend/.env`:
   - Set MONGODB_URI with your Atlas connection string
   - Set JWT_SECRET and JWT_REFRESH_SECRET to strong values
   - Ensure ALLOWED_ORIGINS includes http://localhost:3000 (and your prod domain later)
   - Adjust DEFAULT_DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, and TAX_RATE to match your business rules

3) Start backend in development:
   ```bash
   npm run dev
   ```
   Backend will run at http://localhost:4000 (health: /health)

### Frontend setup

1) From project root, install frontend dependencies:
   ```bash
   npm install
   ```

2) Create `.env.local` in the project root:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

3) Run the frontend dev server:
   ```bash
   npm run dev
   ```

4) Open in browser:
   Navigate to http://localhost:3000

## Usage Guide

### For Customers

1. **QR Code Ordering**
   - Scan the QR code at your table
   - Browse the menu and add items to cart
   - Proceed to checkout and choose payment method
   - Your order will be delivered to your table

2. **Online Ordering**
   - Visit the website directly
   - Browse menu and add items to cart
   - Choose pickup or delivery
   - Complete payment online or pay at counter

### For Restaurant Staff

1. **QR Code Management**
   - Visit `/admin/qr-generator`
   - Generate QR codes for table ranges (e.g., 1-10)
   - Download and print QR codes
   - Place QR codes on corresponding tables

## Key Features

### QR Code Workflow
1. Staff generates QR codes for tables
2. Customer scans QR code → taken to homepage with table parameter
3. Table number is automatically captured
4. Orders are tagged with table number

### Complete Ordering Process
1. **Browse Menu** - Organized by categories with visual food cards
2. **Add to Cart** - Real-time quantity updates with cart summary
3. **Checkout** - Choose payment method (online/counter)
4. **Confirmation** - Detailed order summary with table info

## Technologies Used

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide React, QRCode, React Context
- Backend: Node.js, Express, TypeScript, MongoDB Atlas, Mongoose, JWT, bcryptjs, Winston, Nodemailer

## Project Structure

```
ROMS/
├── backend/
│   ├── src/
│   │   ├── config/        # app.ts (Express), database.ts (Mongo connection)
│   │   ├── controllers/   # Route handlers (auth, menu, orders, etc.)
│   │   ├── middleware/    # errorHandler, auth, validate, notFound
│   │   ├── models/        # User, MenuItem, Order, Reservation, Table, Review
│   │   ├── routes/        # auth, menu, orders, reservations, tables, reviews, admin, user
│   │   └── utils/         # logger
│   ├── .env               # Backend environment variables
│   ├── tsconfig.json
│   └── package.json
│
└── src/                   # Frontend (Next.js)
    ├── app/               # Pages (App Router)
    ├── components/        # UI components
    └── contexts/          # React Context (Cart)
```

## Backend API Endpoints (initial)

Public:
- GET  /health
- POST /api/auth/register, /api/auth/login
- GET  /api/menu (placeholder)

Protected (after login):
- /api/orders, /api/reservations, /api/reviews (placeholders)
- /api/admin/* (admin only, placeholders)

Note: Many route handlers are scaffolds now; implement controllers to complete functionality.

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

Notes:
- Keep frontend and backend servers running during development.
- Ensure backend ALLOWED_ORIGINS matches the frontend origin.
- Do not commit secrets. Use environment variables or a secret manager.

Built with ❤️ for great food lovers everywhere!
