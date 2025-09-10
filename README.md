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

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

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

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **QRCode** - QR code generation
- **React Context** - State management

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin pages (QR generator)
│   ├── cart/              # Shopping cart page
│   ├── contact/           # Contact page
│   ├── login/             # Authentication page
│   ├── menu/              # Menu page
│   ├── reservations/      # Table reservation page
│   ├── reviews/           # Customer reviews page
│   └── special/           # Special offers page
├── components/            # Reusable components
│   ├── FoodImage.tsx      # Food image placeholder
│   ├── Footer.tsx         # Site footer
│   └── Navbar.tsx         # Navigation bar
└── contexts/              # React Context providers
    └── CartContext.tsx    # Shopping cart state
```

## Testing the Application

1. **Test QR Code Flow**:
   - Visit `/admin/qr-generator`
   - Generate QR codes for tables 1-5
   - Scan QR code or visit `/?table=1`
   - Notice table number appears in homepage
   - Order items and see table info in cart

2. **Test Ordering Process**:
   - Visit `/menu`
   - Add items to cart from different categories
   - View cart summary in sidebar
   - Go to `/cart` and complete checkout
   - Try both online and offline payment options

3. **Test Reservations**:
   - Visit `/reservations`
   - Fill out booking form
   - Try submitting with missing fields (validation)
   - Complete successful reservation

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

Built with ❤️ for great food lovers everywhere!
