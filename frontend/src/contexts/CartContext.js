import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    console.log('fetchCart called - isAuthenticated:', isAuthenticated);
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await cartAPI.get();
      console.log('Cart response:', response.data);
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    console.log('CartContext useEffect - isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return false;
    }

    try {
      setLoading(true);
      const response = await cartAPI.addItem(productId, quantity);
      setCart(response.data.cart);
      toast.success('Item added to cart successfully!');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to add item to cart';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return false;

    try {
      setLoading(true);
      const response = await cartAPI.updateQuantity(productId, quantity);
      setCart(response.data.cart);
      toast.success('Cart updated successfully!');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update cart';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return false;

    try {
      setLoading(true);
      const response = await cartAPI.removeItem(productId);
      setCart(response.data.cart);
      toast.success('Item removed from cart');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to remove item';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return false;

    try {
      setLoading(true);
      const response = await cartAPI.clear();
      setCart(response.data.cart);
      toast.success('Cart cleared successfully!');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to clear cart';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cart?.totalPrice || 0;
  };

  const getCartItemCount = () => {
    return cart?.totalItems || 0;
  };

  const isInCart = (productId) => {
    return cart?.items?.some(item => item.productId === productId) || false;
  };

  const getCartItem = (productId) => {
    return cart?.items?.find(item => item.productId === productId);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
    getCartItem,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
