import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutPage = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-neutral-800 mb-4">
          Checkout Page
        </h2>
        <p className="text-neutral-600 mb-8">
          This page is under construction. Please check back later!
        </p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default CheckoutPage;
