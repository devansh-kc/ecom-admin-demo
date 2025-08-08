"use client";

import Link from "next/link";
import { useState } from "react";
import CartSidebar from "@/components/cart-sidebar/cart-sidebar";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-black">
            Acme Electronic Hub
          </Link>

          <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
            <Link href="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/about" className="hover:text-blue-600 transition">
              About
            </Link>
          </nav>

          <div className="flex items-center justify-between gap-4 relative">
            {/* Admin Login Button */}

            <Link
              href={"/admin-dashboard"}
              target="_blank"
              type="button"
              className="bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-900 transition"
            >
              Go To Dashboard
            </Link>
            <Link
              href={"/add-product"}
              target="_blank"
              type="button"
              className="bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-900 transition"
            >
              Add a product
            </Link>

            {/* Cart Button */}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <CartSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Backdrop */}
    </>
  );
}
