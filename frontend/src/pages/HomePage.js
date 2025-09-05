import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Truck, 
  Shield, 
  Star, 
  ArrowRight,
  Sparkles,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { productsAPI } from '../utils/api';
import { useCart } from '../contexts/CartContext';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getAll({ limit: 8 });
      setFeaturedProducts(response.data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to your doorstep',
      color: 'from-accent-400 to-accent-500'
    },
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'Your data and payments are always protected',
      color: 'from-primary-400 to-primary-500'
    },
    {
      icon: Heart,
      title: 'Quality Assured',
      description: 'Carefully curated products from trusted brands',
      color: 'from-secondary-400 to-secondary-500'
    },
    {
      icon: Star,
      title: 'Expert Support',
      description: 'Dedicated customer service team ready to help',
      color: 'from-warm-400 to-warm-500'
    }
  ];

  const categories = [
    { name: 'Electronics', color: 'from-blue-400 to-blue-500', icon: '💻' },
    { name: 'Fashion', color: 'from-pink-400 to-pink-500', icon: '👗' },
    { name: 'Home & Garden', color: 'from-green-400 to-green-500', icon: '🏡' },
    { name: 'Sports', color: 'from-orange-400 to-orange-500', icon: '⚽' },
    { name: 'Books', color: 'from-purple-400 to-purple-500', icon: '📚' },
    { name: 'Beauty', color: 'from-red-400 to-red-500', icon: '💄' },
    { name: '& more', color: 'from-gray-400 to-gray-500', icon: '➕' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full opacity-20 floating-element"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-full opacity-20 floating-element" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full opacity-20 floating-element" style={{ animationDelay: '2s' }}></div>
          
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-neutral-800 mb-6">
              Welcome to{' '}
              <span className="gradient-text">ShopVerse</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Discover amazing products with our curated collection. 
              Shop with confidence and enjoy a seamless shopping experience.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/products" className="btn-primary text-lg px-8 py-4 group">
              Start Shopping
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register" className="btn-outline text-lg px-8 py-4">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Why Choose ShopVerse?</h2>
            <p className="section-subtitle">
              We're committed to providing you with the best shopping experience possible
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300`}>
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">
              Explore our wide range of product categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.name === '& more' ? '/products' : `/products?category=${category.name.toLowerCase()}`}
                className="group text-center"
              >
                <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1`}>
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <h3 className="font-medium text-neutral-700 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">
              Handpicked products just for you
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="product-card animate-pulse">
                  <div className="w-full h-48 bg-neutral-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-2/3 mb-4"></div>
                  <div className="h-8 bg-neutral-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card group">
                  <div className="relative mb-4 overflow-hidden rounded-xl">
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/300x300?text=Product'}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <button className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-600 hover:text-red-500 transition-colors">
                        <Heart size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-neutral-800">
                      ${product.price}
                    </span>
                    <span className="text-sm text-neutral-500">
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/products/${product.id}`}
                      className="btn-outline flex-1 text-center"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => addToCart(product.id, 1)}
                      disabled={product.stock === 0 || isInCart(product.id)}
                      className={`btn-primary px-4 ${
                        isInCart(product.id) 
                          ? 'bg-accent-500 hover:bg-accent-600' 
                          : ''
                      }`}
                    >
                      {isInCart(product.id) ? (
                        <span className="flex items-center">
                          <ShoppingCart size={16} className="mr-1" />
                          Added
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <ShoppingCart size={16} className="mr-1" />
                          Add
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/products" className="btn-primary text-lg px-8 py-4 group">
              View All Products
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-12 shadow-soft">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-2xl flex items-center justify-center">
              <Sparkles size={40} className="text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Join thousands of satisfied customers and discover amazing products today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                Get Started
              </Link>
              <Link to="/products" className="btn-outline text-lg px-8 py-4">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
