import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../utils/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZipCode: '',
    shippingCountry: '',
    paymentMethod: 'credit_card',
    notes: ''
  });

  useEffect(() => {
    console.log('CheckoutPage useEffect - isAuthenticated:', isAuthenticated, 'cart:', cart);
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (cart && cart.items && cart.items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [isAuthenticated, cart, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate required fields
    if (!formData.shippingAddress.trim() || !formData.shippingCity.trim() || 
        !formData.shippingState.trim() || !formData.shippingZipCode.trim() || 
        !formData.shippingCountry.trim()) {
      toast.error('Please fill in all required shipping address fields');
      return;
    }

    try {
      setIsProcessing(true);
      
      const orderData = {
        ...formData,
        shippingAddress: formData.shippingAddress.trim(),
        shippingCity: formData.shippingCity.trim(),
        shippingState: formData.shippingState.trim(),
        shippingZipCode: formData.shippingZipCode.trim(),
        shippingCountry: formData.shippingCountry.trim(),
        notes: formData.notes.trim()
      };

      const response = await ordersAPI.create(orderData);
      
      toast.success('Order created successfully!');
      navigate(`/orders/${response.data.order.orderId}`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create order';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Your cart is empty</h2>
          <p className="text-neutral-600 mb-8">Add some items to your cart before checkout</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-800 mb-8 text-center">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex items-center space-x-4 py-2 border-b border-neutral-200">
                  <img
                    src={item.productImage || '/api/placeholder/60/60'}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-800">{item.productName}</h3>
                    <p className="text-sm text-neutral-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-neutral-600">${item.unitPrice.toFixed(2)} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-neutral-800">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-200">
              <div className="flex justify-between items-center text-lg font-semibold text-neutral-800">
                <span>Total:</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Shipping Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="shippingAddress" className="block text-sm font-medium text-neutral-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  id="shippingAddress"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="shippingCity" className="block text-sm font-medium text-neutral-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="shippingCity"
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label htmlFor="shippingState" className="block text-sm font-medium text-neutral-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    id="shippingState"
                    name="shippingState"
                    value={formData.shippingState}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="NY"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="shippingZipCode" className="block text-sm font-medium text-neutral-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="shippingZipCode"
                    name="shippingZipCode"
                    value={formData.shippingZipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label htmlFor="shippingCountry" className="block text-sm font-medium text-neutral-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="shippingCountry"
                    name="shippingCountry"
                    value={formData.shippingCountry}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="United States"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-neutral-700 mb-1">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-1">
                  Order Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Any special instructions for your order..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? 'Processing Order...' : `Place Order - $${cart.totalPrice.toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
