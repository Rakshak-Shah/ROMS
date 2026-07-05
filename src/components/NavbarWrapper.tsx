'use client';

import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import AdminNavbar from './AdminNavbar';

export default function NavbarWrapper() {
  const { user } = useAuth();

  // Show admin navbar for admin/staff
  if (user && (user.role === 'admin' || user.role === 'staff')) {
    return <AdminNavbar />;
  }

  // Show regular navbar for customers and guests
  return <Navbar />;
}

