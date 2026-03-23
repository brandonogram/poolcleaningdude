"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { siteConfig } from "@/lib/config";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo-mascot.jpg"
              alt="Pool Cleaning Dude"
              width={160}
              height={160}
              className="h-12 w-12 rounded-lg"
              priority
            />
            <span className="text-lg font-bold text-sky-700 hidden sm:inline">
              Pool Cleaning Dude
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/services"
              className="text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors"
            >
              Services
            </Link>
            <Link
              href="/gallery"
              className="text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors"
            >
              Our Work
            </Link>
            <Link
              href="/areas/gladwyne-pa"
              className="text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors"
            >
              Service Areas
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact-us"
              className="text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors"
            >
              Contact
            </Link>
            <a
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
            >
              {siteConfig.phoneFormatted}
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-700"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/services"
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-gray-700"
            >
              Services
            </Link>
            <Link
              href="/gallery"
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-gray-700"
            >
              Our Work
            </Link>
            <Link
              href="/areas/gladwyne-pa"
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-gray-700"
            >
              Service Areas
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-gray-700"
            >
              About
            </Link>
            <Link
              href="/contact-us"
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-gray-700"
            >
              Contact
            </Link>
            <a
              href={`tel:${siteConfig.phone}`}
              className="block rounded-full bg-sky-600 px-5 py-2 text-center text-sm font-semibold text-white"
            >
              Call {siteConfig.phoneFormatted}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
