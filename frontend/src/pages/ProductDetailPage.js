import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  ShoppingCart, 
  Plus, 
  Minus,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { productsAPI } from '../utils/api';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getCartItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const images = product?.imageUrl ? [product.imageUrl] : [
    'https://via.placeholder.com/600x600?text=Product+Image+1',
    'https://via.placeholder.com/600x600?text=Product+Image+2',
    'https://via.placeholder.com/600x600?text=Product+Image+3'
  ];

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(productId);
      setProduct(response.data);
      setQuantity(1);
      
      // Fetch related products
      const relatedResponse = await productsAPI.getAll({ 
        category: response.data.category,
        limit: 4 
      });
      setRelatedProducts(relatedResponse.data.filter(p => p.id !== parseInt(productId)));
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${productId}` } } });
      return;
    }

    const success = await addToCart(productId, quantity);
    if (success) {
      setQuantity(1);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={`${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const cartItem = getCartItem(parseInt(productId));

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-full h-96 bg-neutral-200 rounded-xl"></div>
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-neutral-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                <div className="h-12 bg-neutral-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Product not found</h2>
          <p className="text-neutral-600 mb-8">The product you're looking for doesn't exist or has been removed</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-neutral-600">
          <Link to="/products" className="hover:text-primary-600 transition-colors">
            Products
          </Link>
          <span>/</span>
          <span className="text-neutral-800">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl shadow-soft"
              />
              <button
                onClick={handleWishlistToggle}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isWishlisted 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/80 backdrop-blur-sm text-neutral-600 hover:text-red-500'
                }`}
              >
                <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
              </button>
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? 'border-primary-500' 
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-800 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {renderStars(product.rating || 0)}
                </div>
                <span className="text-neutral-600">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>

              <div className="text-3xl font-bold text-neutral-800 mb-6">
                ${product.price}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-neutral-600 leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-neutral-600">
                <span className={`px-3 py-1 rounded-full ${
                  product.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
                <span>SKU: {product.sku || 'N/A'}</span>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-neutral-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-neutral-200 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || (cartItem && cartItem.quantity >= product.stock)}
                  className={`btn-primary flex-1 py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                    cartItem 
                      ? 'bg-accent-500 hover:bg-accent-600' 
                      : ''
                  }`}
                >
                  {cartItem ? (
                    <span className="flex items-center justify-center">
                      <ShoppingCart size={20} className="mr-2" />
                      In Cart ({cartItem.quantity})
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <ShoppingCart size={20} className="mr-2" />
                      Add to Cart
                    </span>
                  )}
                </button>
                
                <button
                  onClick={handleShare}
                  className="btn-outline p-3"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 pt-6 border-t border-neutral-200">
              <div className="flex items-center gap-3 text-sm text-neutral-600">
                <Truck size={16} className="text-blue-500" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-600">
                <Shield size={16} className="text-green-500" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-600">
                <RotateCcw size={16} className="text-purple-500" />
                <span>Easy returns and exchanges</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-neutral-800 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.id}`}
                  className="product-card group"
                >
                  <div className="relative mb-4 overflow-hidden rounded-xl">
                    <img
                      src={relatedProduct.imageUrl || 'https://via.placeholder.com/300x300?text=Product'}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <h3 className="font-semibold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {relatedProduct.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-neutral-800">
                      ${relatedProduct.price}
                    </span>
                    <span className="text-sm text-neutral-500">
                      {relatedProduct.stock > 0 ? `${relatedProduct.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;