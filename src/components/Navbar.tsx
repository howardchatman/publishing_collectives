"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, User, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-16 h-16 relative rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Publishing Collectives Logo"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-2xl font-bold text-dark tracking-tight">
            Publishing Collectives
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-dark font-medium hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-dark font-medium hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-dark font-medium hover:text-primary transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/shop"
            className="text-dark font-medium hover:text-primary transition-colors"
          >
            Shop
          </Link>
          <Link href="/shop" className="text-dark hover:text-primary transition-colors">
            <User size={22} />
          </Link>
          <Link href="/shop" className="relative text-dark hover:text-primary transition-colors">
            <ShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 bg-primary text-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-dark"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          <Link href="/" className="text-dark font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/about" className="text-dark font-medium" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link href="/contact" className="text-dark font-medium" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          <Link href="/shop" className="text-dark font-medium" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
        </nav>
      )}
    </header>
  );
}
