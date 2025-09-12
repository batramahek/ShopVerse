import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  CreditCard,
  Truck,
  Shield,
  Heart,
  Star
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartItemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
    }
  }, [isAuthenticated, navigate]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const token = localStorage.getItem('jwt_token');
    if (!token) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }

    // Redirect to checkout page
    navigate('/checkout');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-soft">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-neutral-200 rounded-lg"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                        <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                        <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="space-y-4">
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                  <div className="h-12 bg-neutral-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/products"
              className="btn-outline flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-neutral-800">Shopping Cart</h1>
              <p className="text-neutral-600">
                {getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
          
          {cart && cart.items && cart.items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="btn-outline text-red-600 hover:text-red-700 hover:border-red-300"
            >
              <Trash2 size={16} className="mr-2" />
              Clear Cart
            </button>
          )}
        </div>

        {!cart || !cart.items || cart.items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
              <ShoppingCart size={32} className="text-neutral-400" />
            </div>
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Your cart is empty</h2>
            <p className="text-neutral-600 mb-8">
              Looks like you haven't added any items to your cart yet
            </p>
            <Link to="/products" className="btn-primary text-lg px-8 py-4">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-all duration-300">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img
                        src={item.productImage || 'https://via.placeholder.com/300x300?text=Product'}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {item.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-neutral-800 mb-2 line-clamp-2">
                        {item.productName}
                      </h3>
                      <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                        {item.productDescription}
                      </p>
                      
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {renderStars(item.rating || 0)}
                        </div>
                        <span className="text-sm text-neutral-500 ml-2">
                          ({item.reviewCount || 0})
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-neutral-200 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-2 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              disabled={item.stock > 0 && item.quantity >= item.stock}
                              className="p-2 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-semibold text-neutral-800">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-neutral-500">
                              ${item.unitPrice} each
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-soft sticky top-4">
                <h3 className="text-xl font-semibold text-neutral-800 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal ({getCartItemCount()} items)</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Tax</span>
                    <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold text-neutral-800">
                      <span>Total</span>
                      <span>${(getCartTotal() * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={cart.items.some(item => item.stock === 0)}
                  className="btn-primary w-full py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  <div className="flex items-center justify-center">
                    <CreditCard size={20} className="mr-2" />
                    Proceed to Checkout
                  </div>
                </button>

                {cart.items.some(item => item.stock === 0) && (
                  <p className="text-sm text-red-600 text-center mb-4">
                    Some items are out of stock and cannot be checked out
                  </p>
                )}

                {/* Security Features */}
                <div className="space-y-3 pt-4 border-t border-neutral-200">
                  <div className="flex items-center text-sm text-neutral-600">
                    <Shield size={16} className="mr-2 text-green-600" />
                    Secure checkout with SSL encryption
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Truck size={16} className="mr-2 text-blue-600" />
                    Free shipping on orders over $50
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;