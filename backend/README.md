# Ecommerce Backend

This is the backend Spring Boot application for the Ecommerce platform.

## Features

- User authentication and management
- Product catalog management
- Shopping cart functionality
- Order processing and management
- RESTful API endpoints

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL database

### Database Setup

1. Create a MySQL database:
   ```sql
   CREATE DATABASE ecommerce_db;
   ```

2. Create a user and grant privileges:
   ```sql
   CREATE USER 'ecom_user'@'localhost' IDENTIFIED BY 'ecom_pass_123';
   GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecom_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. Update `src/main/resources/application.properties` if needed.

### Running the Application

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

The application will start on `http://localhost:8080`.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Users
- `GET /api/users` - Get all users
- `GET /api/users/username/{username}` - Get user by username
- `POST /api/users/signup` - Create user
- `POST /api/users/login` - Authenticate user
- `PUT /api/users/username/{username}` - Update user
- `DELETE /api/users/username/{username}` - Delete user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Cart
- `GET /api/cart/{userId}` - Get user's cart
- `POST /api/cart/{userId}/add` - Add product to cart
- `PUT /api/cart/{userId}/update/{productId}` - Update quantity
- `DELETE /api/cart/{userId}/remove/{productId}` - Remove product
- `DELETE /api/cart/{userId}/clear` - Clear cart

### Orders
- `POST /api/orders/create` - Create order from cart
- `GET /api/orders/user/{userId}` - Get user's orders
- `GET /api/orders/{userId}/{orderId}` - Get specific order
- `PUT /api/orders/{userId}/{orderId}/status` - Update order status
- `DELETE /api/orders/{userId}/{orderId}/cancel` - Cancel order
- `GET /api/orders/status/{status}` - Get orders by status

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/ecommerce/
│   │   │       ├── config/          # Configuration classes
│   │   │       ├── controller/      # REST controllers
│   │   │       ├── order/           # Order management
│   │   │       ├── product/         # Product management
│   │   │       ├── cart/            # Shopping cart
│   │   │       ├── user/            # User management
│   │   │       └── EcommerceApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/                        # Test files
├── pom.xml                          # Maven dependencies
├── mvnw                            # Maven wrapper
└── README.md                       # This file
```

## Technologies Used

- Spring Boot 3.5.5
- Spring Data JPA
- Spring Security (for password encoding)
- MySQL database
- Maven for dependency management
- Lombok for reducing boilerplate code

## Database Schema

The application automatically creates the following tables:
- `users` - User accounts
- `products` - Product catalog
- `carts` - Shopping carts
- `cart_items` - Items in carts
- `orders` - Customer orders
- `order_items` - Items in orders

## Testing

Run tests with:
```bash
./mvnw test
```

## Building

Build the JAR file with:
```bash
./mvnw clean package
```

The JAR file will be created in the `target/` directory.
