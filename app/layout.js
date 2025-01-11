'use client';
import './../styles/global.css';
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
});

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.className} bg-[var(--background)] text-[var(--foreground)]`}>
        {/* Navigation Bar */}
        <nav className="bg-[var(--foreground)] text-[var(--background)] shadow-md py-4">
          <div className="container mx-auto flex justify-between items-center px-4">
            {/* Logo or Brand */}
            <Link href="/" className="text-2xl font-semibold hover:text-gray-300 transition-all">
              Bookmark Tracker
            </Link>

            {/* Navigation Links */}
            <div className="space-x-6">
              <Link
                href="/"
                className="text-lg hover:text-gray-300 transition-all"
              >
                Home
              </Link>
              <Link
                href="/bookmarks"
                className="text-lg hover:text-gray-300 transition-all"
              >
                Bookmarks
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto p-6">
          <SessionProvider>{children}</SessionProvider>
        </main>

        {/* Footer */}
        <footer className="bg-[var(--foreground)] text-[var(--background)] text-center py-4 mt-8">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Bookmark Tracker. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
