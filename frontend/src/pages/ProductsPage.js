import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Heart, 
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { productsAPI } from '../utils/api';
import { useCart } from '../contexts/CartContext';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isSearching, setIsSearching] = useState(false);
  const { addToCart, isInCart } = useCart();

  const itemsPerPage = 12;

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
    'Beauty',
    'Toys',
    'Health',
    'Automotive',
    'Other'
  ];

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [isSearching, searchQuery, selectedCategory, sortBy, priceRange, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined
      };

      // Only add search and category if user is actively searching/filtering
      if (isSearching && searchQuery) {
        params.search = searchQuery;
      }
      if (selectedCategory) {
        params.category = selectedCategory;
      }

      // Remove undefined values
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const response = await productsAPI.getAll(params);
      setProducts(response.data.products || response.data);
      setTotalPages(Math.ceil((response.data.total || response.data.length) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    setSearchQuery(query);
    setIsSearching(query.length > 0);
    setCurrentPage(1);
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  const handleCategoryFilter = (category) => {
    const newCategory = category === selectedCategory ? '' : category;
    setSelectedCategory(newCategory);
    setCurrentPage(1);
    if (newCategory) {
      setSearchParams({ category: newCategory.toLowerCase() });
    } else {
      setSearchParams({});
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (e) => {
    const value = parseInt(e.target.value);
    const isMin = e.target.name === 'minPrice';
    setPriceRange(prev => 
      isMin ? [value, prev[1]] : [prev[0], value]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange([0, 1000]);
    setSortBy('name');
    setCurrentPage(1);
    setIsSearching(false);
    setSearchParams({});
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderProductCard = (product) => (
    <div key={product.id} className="product-card group">
      <div className="relative mb-4 overflow-hidden rounded-xl">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300x300?text=Product'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-600 hover:text-red-500 transition-colors">
            <Heart size={16} />
          </button>
        </div>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <h3 className="font-semibold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
        {product.name}
      </h3>
      <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
        {product.description}
      </p>
      
      <div className="flex items-center mb-2">
        <div className="flex items-center">
          {renderStars(product.rating || 0)}
        </div>
        <span className="text-sm text-neutral-500 ml-2">
          ({product.reviewCount || 0})
        </span>
      </div>
      
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
  );

  const renderProductList = (product) => (
    <div key={product.id} className="bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-all duration-300">
      <div className="flex gap-6">
        <div className="relative w-32 h-32 flex-shrink-0">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/300x300?text=Product'}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-neutral-800 mb-2">
            {product.name}
          </h3>
          <p className="text-neutral-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {renderStars(product.rating || 0)}
            </div>
            <span className="text-sm text-neutral-500 ml-2">
              ({product.reviewCount || 0} reviews)
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-neutral-800">
                ${product.price}
              </span>
              <span className="text-sm text-neutral-500 ml-2">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
            
            <div className="flex gap-3">
              <Link
                to={`/products/${product.id}`}
                className="btn-outline"
              >
                View Details
              </Link>
              <button
                onClick={() => addToCart(product.id, 1)}
                disabled={product.stock === 0 || isInCart(product.id)}
                className={`btn-primary ${
                  isInCart(product.id) 
                    ? 'bg-accent-500 hover:bg-accent-600' 
                    : ''
                }`}
              >
                {isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">Products</h1>
          <p className="text-neutral-600">
            Discover amazing products from our curated collection
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl p-6 shadow-soft sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-neutral-800">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-neutral-500 hover:text-neutral-700"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      name="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input-field pl-10 w-full"
                    />
                  </div>
                </form>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-neutral-700 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryFilter(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-neutral-700 mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-neutral-600 mb-1">Min Price</label>
                    <input
                      type="number"
                      name="minPrice"
                      value={priceRange[0]}
                      onChange={handlePriceRangeChange}
                      className="input-field w-full"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-600 mb-1">Max Price</label>
                    <input
                      type="number"
                      name="maxPrice"
                      value={priceRange[1]}
                      onChange={handlePriceRangeChange}
                      className="input-field w-full"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full btn-outline text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl p-4 shadow-soft mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden btn-outline flex items-center gap-2"
                  >
                    <Filter size={16} />
                    Filters
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-600">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={handleSortChange}
                      className="input-field text-sm"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-600">View:</span>
                  <div className="flex border border-neutral-200 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'text-neutral-600'}`}
                    >
                      <Grid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'text-neutral-600'}`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

                    {/* Products Grid/List */}
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                {viewMode === 'grid' ? (
                  <div className="product-card">
                    <div className="w-full h-48 bg-neutral-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-2/3 mb-4"></div>
                    <div className="h-8 bg-neutral-200 rounded"></div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex gap-6">
                      <div className="w-32 h-32 bg-neutral-200 rounded-lg"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-6 bg-neutral-200 rounded w-3/4"></div>
                        <div className="h-4 bg-neutral-200 rounded w-full"></div>
                        <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                        <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {products.map(viewMode === 'grid' ? renderProductCard : renderProductList)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-8 gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn-outline p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-primary-600 text-white'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn-outline p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
              <Search size={32} className="text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">
              {isSearching ? 'No products found' : 'No products available'}
            </h3>
            <p className="text-neutral-600 mb-6">
              {isSearching 
                ? 'Try adjusting your search or filter criteria'
                : 'There are currently no products available'
              }
            </p>
            {isSearching && (
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;