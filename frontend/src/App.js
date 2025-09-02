import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Placeholder components (to be implemented)
const Home = () => <div className="page">Home Page - Welcome to Ecommerce Platform</div>;
const Products = () => <div className="page">Products Page - Browse our catalog</div>;
const Cart = () => <div className="page">Cart Page - Your shopping cart</div>;
const Orders = () => <div className="page">Orders Page - Track your orders</div>;
const Login = () => <div className="page">Login Page - Sign in to your account</div>;
const Signup = () => <div className="page">Signup Page - Create new account</div>;

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Ecommerce Platform</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/products">Products</a>
            <a href="/cart">Cart</a>
            <a href="/orders">Orders</a>
            <a href="/login">Login</a>
            <a href="/signup">Signup</a>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>

        <footer>
          <p>&copy; 2024 Ecommerce Platform. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
