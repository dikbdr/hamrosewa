/**
 * Home Page - Main Landing Page
 * 
 * This is the main page users see when they visit the website.
 * It should showcase:
 * - Featured listings
 * - Categories
 * - How it works
 * - Call to action
 */

import React from 'react';

/**
 * Home Component
 * 
 * For junior developers:
 * - This is a Server Component by default (recommended)
 * - You can fetch data directly here
 * - No 'use client' directive needed unless you use hooks
 */
export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white">
      {/* Header/Navigation will be added later */}

      {/* Hero Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Buy & Sell Anything on HamroSewa
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Nepal's largest online marketplace for buying and selling products
          </p>

          {/* Search Bar (placeholder for now) */}
          <div className="flex gap-2 mb-8">
            <input
              type="text"
              placeholder="Search for products..."
              className="flex-1 px-4 py-3 rounded-lg text-dark focus:outline-none"
            />
            <button className="px-6 py-3 bg-accent text-dark font-semibold rounded-lg hover:bg-opacity-90 transition">
              Search
            </button>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Mobiles', 'Electronics', 'Vehicles', 'Property'].map((category) => (
              <a
                key={category}
                href={`/listings?category=${category.toLowerCase()}`}
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition text-center font-semibold"
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Browse Categories</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'Mobiles', icon: '📱', count: '15K+' },
              { name: 'Electronics', icon: '💻', count: '8K+' },
              { name: 'Vehicles', icon: '🚗', count: '5K+' },
              { name: 'Property', icon: '🏠', count: '12K+' },
              { name: 'Fashion', icon: '👔', count: '25K+' },
              { name: 'Furniture', icon: '🛋️', count: '10K+' },
              { name: 'Services', icon: '🔧', count: '20K+' },
              { name: 'Jobs', icon: '💼', count: '3K+' },
            ].map((cat) => (
              <a
                key={cat.name}
                href={`/listings?category=${cat.name.toLowerCase()}`}
                className="card-padded text-center hover:scale-105 transition transform"
              >
                <div className="text-4xl mb-2">{cat.icon}</div>
                <h3 className="font-semibold mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-600">{cat.count} listings</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 md:px-8 bg-gray-100">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Post Your Ad',
                description: 'Create a free account and post your listing in minutes',
              },
              {
                step: '2',
                title: 'Connect with Buyers',
                description: 'Chat directly with potential buyers or sellers',
              },
              {
                step: '3',
                title: 'Complete the Deal',
                description: 'Arrange payment and complete your transaction safely',
              },
            ].map((item) => (
              <div key={item.step} className="card-padded text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex-center mx-auto mb-4">
                  <span className="text-lg font-bold">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-r from-secondary to-primary text-white text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-8 text-lg opacity-90">
            Join thousands of buyers and sellers on HamroSewa today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="btn-primary bg-white text-primary hover:bg-gray-100">
              Sign Up Now
            </a>
            <a href="/listings" className="btn-outline border-white text-white hover:bg-white/10">
              Browse Listings
            </a>
          </div>
        </div>
      </section>

      {/* Footer will be added later */}
    </div>
  );
}
