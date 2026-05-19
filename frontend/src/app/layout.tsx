/**
 * Root Layout for Next.js Application
 * 
 * This is the main layout that wraps all pages in the application.
 * It sets up:
 * - HTML/HEAD tags
 * - Global styles
 * - Providers (Context, etc.)
 * - Meta tags
 * 
 * For junior developers:
 * - This layout applies to ALL pages
 * - Global CSS goes here
 * - Think of it as the wrapper for your entire app
 */

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/styles/globals.css';

/**
 * Metadata for SEO
 * Appears in browser tab and search results
 */
export const metadata: Metadata = {
  title: 'HamroSewa - Buy & Sell Anything in Nepal',
  description:
    'HamroSewa is Nepal\'s largest online marketplace. Buy and sell products, find jobs, and more.',
  keywords: 'marketplace, buy, sell, Nepal, classified ads, OLX',
  authors: [{ name: 'HamroSewa Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hamrosewa.com',
    siteName: 'HamroSewa',
  },
  robots: 'index, follow',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

/**
 * Root Layout Component
 * 
 * Props:
 * - children: Page content that will be rendered inside this layout
 */
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://api.khalti.com" />
      </head>
      <body className="bg-light text-dark">
        {/* Providers wrapper - will add context providers here later */}
        <div className="min-h-screen flex flex-col">
          {/* Main content area */}
          <main className="flex-1">{children}</main>

          {/* Footer will go here */}
        </div>
      </body>
    </html>
  );
}
