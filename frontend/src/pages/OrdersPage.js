import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Calendar, 
  DollarSign, 
  Eye, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  ArrowLeft,
  Filter,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../utils/api';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'amount_high', label: 'Amount: High to Low' },
    { value: 'amount_low', label: 'Amount: Low to High' }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/orders' } } });
    } else {
      fetchOrders();
    }
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock size={16} className="text-yellow-500" />;
      case 'CONFIRMED':
        return <CheckCircle size={16} className="text-blue-500" />;
      case 'SHIPPED':
        return <Truck size={16} className="text-purple-500" />;
      case 'DELIVERED':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'CANCELLED':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = order.id.toString().includes(searchQuery) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'amount_high':
          return b.totalAmount - a.totalAmount;
        case 'amount_low':
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-48 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-soft">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-6 bg-neutral-200 rounded w-32"></div>
                    <div className="h-6 bg-neutral-200 rounded w-20"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
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
              to="/profile"
              className="btn-outline flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Profile
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-neutral-800">My Orders</h1>
              <p className="text-neutral-600">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-soft mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search orders by ID or product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10 w-full"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
              <Package size={32} className="text-neutral-400" />
            </div>
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
              {orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
            </h2>
            <p className="text-neutral-600 mb-8">
              {orders.length === 0 
                ? 'Start shopping to see your orders here'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {orders.length === 0 && (
              <Link to="/products" className="btn-primary text-lg px-8 py-4">
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center">
                      <Package size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800">
                        Order #{order.id}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Calendar size={14} />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-neutral-800">
                        ${order.totalAmount.toFixed(2)}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                    
                    <Link
                      to={`/orders/${order.id}`}
                      className="btn-outline flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View Details
                    </Link>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="border-t border-neutral-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-neutral-100 rounded-lg flex-shrink-0">
                          <img
                            src={item.imageUrl || 'https://via.placeholder.com/100x100?text=Product'}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-neutral-800 truncate">
                            {item.name}
                          </h4>
                          <p className="text-sm text-neutral-600">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center text-sm text-neutral-500">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-neutral-200">
                  <div className="flex-1">
                    <div className="text-sm text-neutral-600">
                      <strong>Shipping Address:</strong> {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {order.status === 'PENDING' && (
                      <button className="btn-outline text-red-600 hover:text-red-700 hover:border-red-300">
                        Cancel Order
                      </button>
                    )}
                    {order.status === 'DELIVERED' && (
                      <button className="btn-outline">
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;