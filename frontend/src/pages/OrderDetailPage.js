import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Calendar, 
  DollarSign, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../utils/api';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/orders/${orderId}` } } });
    } else {
      fetchOrder();
    }
  }, [isAuthenticated, navigate, orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getById(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock size={20} className="text-yellow-500" />;
      case 'CONFIRMED':
        return <CheckCircle size={20} className="text-blue-500" />;
      case 'SHIPPED':
        return <Truck size={20} className="text-purple-500" />;
      case 'DELIVERED':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'CANCELLED':
        return <XCircle size={20} className="text-red-500" />;
      default:
        return <Clock size={20} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Your order is being processed and will be confirmed shortly.';
      case 'CONFIRMED':
        return 'Your order has been confirmed and is being prepared for shipment.';
      case 'SHIPPED':
        return 'Your order has been shipped and is on its way to you.';
      case 'DELIVERED':
        return 'Your order has been delivered successfully.';
      case 'CANCELLED':
        return 'Your order has been cancelled.';
      default:
        return 'Order status is being updated.';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await ordersAPI.updateStatus(orderId, 'CANCELLED');
        toast.success('Order cancelled successfully');
        fetchOrder();
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Failed to cancel order';
        toast.error(errorMessage);
      }
    }
  };

  const handleReorder = () => {
    // Add all items from this order to cart
    toast.success('Items added to cart for reorder');
    navigate('/cart');
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-48 mb-8"></div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="h-6 bg-neutral-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Order not found</h2>
          <p className="text-neutral-600 mb-8">The order you're looking for doesn't exist or has been removed</p>
          <Link to="/orders" className="btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/orders"
            className="btn-outline flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Order Details</h1>
            <p className="text-neutral-600">Order #{order.orderId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-neutral-800">Order Status</h2>
                <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>
              <p className="text-neutral-600 mb-4">
                {getStatusDescription(order.status)}
              </p>
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <Calendar size={16} />
                <span>Ordered on {formatDate(order.orderDate)}</span>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-neutral-800 mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-neutral-200 rounded-lg">
                    <div className="w-16 h-16 bg-neutral-100 rounded-lg flex-shrink-0">
                      <img
                        src={item.product.imageUrl || 'https://via.placeholder.com/100x100?text=Product'}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-800 mb-1">{item.product.name}</h3>
                      <p className="text-sm text-neutral-600 mb-2">{item.product.description}</p>
                      <div className="flex items-center gap-4 text-sm text-neutral-500">
                        <span>Qty: {item.quantity}</span>
                        <span>Price: ${item.unitPrice.toFixed(2)} each</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-neutral-800">
                        ${item.getSubtotal().toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-neutral-800 mb-6">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-neutral-700 mb-3 flex items-center gap-2">
                    <MapPin size={16} />
                    Shipping Address
                  </h3>
                  <div className="text-neutral-600 space-y-1">
                    <p>{order.shippingAddress}</p>
                    <p>{order.shippingCity}, {order.shippingState} {order.shippingZipCode}</p>
                    <p>{order.shippingCountry}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-neutral-700 mb-3 flex items-center gap-2">
                    <Truck size={16} />
                    Delivery Method
                  </h3>
                  <div className="text-neutral-600">
                    <p>Standard Shipping</p>
                    <p className="text-sm">Estimated delivery: 3-5 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal ({order.orderItems.length} items)</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Tax</span>
                  <span>${(order.totalPrice * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-neutral-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-neutral-800">
                    <span>Total</span>
                    <span>${(order.totalPrice * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Payment Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CreditCard size={16} className="text-neutral-500" />
                  <span className="text-neutral-600">Payment Method</span>
                </div>
                <div className="text-sm text-neutral-500">
                  <p>**** **** **** 1234</p>
                  <p>Expires 12/25</p>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign size={16} className="text-neutral-500" />
                  <span className="text-neutral-600">Payment Status: Paid</span>
                </div>
              </div>
            </div>

            {/* Order Actions */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="btn-outline w-full flex items-center justify-center gap-2">
                  <Download size={16} />
                  Download Invoice
                </button>
                
                {order.status === 'PENDING' && (
                  <button
                    onClick={handleCancelOrder}
                    className="w-full btn-outline text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    Cancel Order
                  </button>
                )}
                
                {order.status === 'DELIVERED' && (
                  <button
                    onClick={handleReorder}
                    className="w-full btn-primary"
                  >
                    Reorder Items
                  </button>
                )}
                
                <Link
                  to="/products"
                  className="w-full btn-outline text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Customer Support */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm text-neutral-600">
                <div className="flex items-center gap-3">
                  <Phone size={16} />
                  <span>1-800-SHOPVERSE</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} />
                  <span>support@shopverse.com</span>
                </div>
                <p className="text-xs text-neutral-500">
                  Available 24/7 for your convenience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;