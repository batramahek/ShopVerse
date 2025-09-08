# Ecommerce Platform

A full-stack ecommerce application with Spring Boot backend and React frontend.

## Project Structure

```
ecommerce/
├── backend/          # Spring Boot REST API
├── frontend/         # React frontend application
├── .gitignore        # Git ignore file
└── README.md         # Current file
```

## Quick Start

### Backend (Spring Boot)

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Set up MySQL database (see backend/README.md for details)

3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

The backend will start on `http://localhost:8080`

### Frontend (React)

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will start on `http://localhost:3000`

## Features

### Backend API
- **User Management**: Registration, authentication, profile management
- **Product Catalog**: CRUD operations for products
- **Shopping Cart**: Add, remove, update cart items, checkout preview
- **Order Management**: Checkout with shipping/payment info, order tracking, status updates
- **Security**: Password hashing, user validation

### Frontend 
- User authentication interface
- Product browsing and search
- Shopping cart management
- **Checkout process with shipping and payment information**
- Order placement and tracking
- Responsive design

## API Documentation

- **User APIs**: See `test_api_examples.md`
- **Cart APIs**: See `cart_api_examples.md`
- **Order APIs**: See `order_api_examples.md`
- **Checkout APIs**: See `checkout_api_examples.md`

## Technologies

### Backend
- Spring Boot 3.5.5
- Spring Data JPA
- MySQL Database
- Maven

### Frontend
- React 18
- React Router
- Axios for API calls
- CSS for styling

## Development

### Running Both Services

1. **Terminal 1** - Backend:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **Terminal 2** - Frontend:
   ```bash
   cd frontend
   npm start
   ```

### Database

The backend automatically creates all necessary tables on startup. Make sure MySQL is running and the database is configured in `backend/src/main/resources/application.properties`.


## License

This project is for educational purposes.
