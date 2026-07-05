# ROMS Backend (Node.js + Express + TypeScript + MongoDB Atlas)

This is the backend API for the Restaurant Order Management System (ROMS). It powers your Next.js frontend with:
- Menu management and categories
- Cart, orders, and delivery (with fees and thresholds matching frontend logic)
- Dine-in with QR table numbers
- Reservations with time slots
- Reviews and ratings
- Authentication with JWT and role-based access
- Admin endpoints for managing the system

## Quick start

1) Create a MongoDB Atlas cluster and a database user.
- Get your connection string (URI) from Atlas.
- Replace the placeholder values in backend/.env (MONGODB_URI, JWT secrets, email, etc.).

2) Install dependencies
- Using npm (recommended):
  npm install

3) Start in development
  npm run dev

4) Build and start in production
  npm run build
  npm start

API runs at http://localhost:4000 by default. Health check: http://localhost:4000/health

## Environment variables (backend/.env)
Key variables to set:
- MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/roms_database
- JWT_SECRET, JWT_REFRESH_SECRET
- FRONTEND_URL and ALLOWED_ORIGINS
- ESEWA_* for payment redirects (already aligned to your frontend/cart page)
- DEFAULT_DELIVERY_FEE and FREE_DELIVERY_THRESHOLD (match CartContext defaults)
- TAX_RATE (matches 8.5% used in frontend)

See backend/.env for a complete list with sensible defaults/placeholders.

## Code structure
- src/config: app bootstrap and database connection
- src/models: Mongoose models (User, MenuItem, Order, Reservation, Table, Review)
- src/routes: Express routers (auth, menu, orders, reservations, tables, reviews, admin, users)
- src/middleware: error handling, auth, validation
- src/utils: logger

## Frontend integration points
- Menu categories: appetizers, mains, pasta, desserts, beverages (matching src/app/menu/page.tsx)
- Delivery fee logic: same as frontend (free above FREE_DELIVERY_THRESHOLD)
- Dine-in: QR codes use /menu?table=<number> (Table model generates URLs using QR_CODE_BASE_URL)
- Reservations: time slots aligned with frontend page
- Payment: eSewa success/failure URLs point to /cart?payment=success|failed

## Next steps
- Implement controller logic for all routes (currently placeholders for non-auth routes and auth as a stub)
- Add input validation schemas and replace placeholders
- Connect image uploads to Cloudinary (optional)
- Add email delivery for verification/reservations (optional)
- Write tests and enable API docs

## Scripts
- dev: nodemon with ts-node
- build: tsc to dist/
- start: node dist/server.js

## Notes
- Do NOT commit real secrets. Use a secure secret manager in production.
- Ensure CORS ALLOWED_ORIGINS includes your frontend domain.
- Keep JWT secrets long and random.

