# Checkout API Examples

This document provides examples of how to use the checkout functionality to convert cart items into orders.

## Checkout Flow

The checkout process involves two main steps:
1. **Checkout Preview** - Validate cart and show checkout information
2. **Create Order** - Convert cart to order and clear cart

## API Endpoints

### 1. Checkout Preview
**GET** `/api/cart/{userId}/checkout-preview`

Validates the cart and shows checkout information before creating an order.

**Example Request:**
```bash
GET /api/cart/1/checkout-preview
```

**Success Response (200):**
```json
{
  "message": "Cart is ready for checkout!",
  "cart": {
    "id": 1,
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "cartItems": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Laptop",
          "price": 999.99,
          "stock": 10
        },
        "quantity": 1,
        "unitPrice": 999.99
      }
    ],
    "totalPrice": 999.99,
    "totalItems": 1
  },
  "total": 999.99,
  "itemCount": 1,
  "canCheckout": true
}
```

**Error Response (400):**
```json
{
  "error": "Insufficient stock for product: Laptop (Available: 0, Requested: 1)",
  "canCheckout": false
}
```

### 2. Create Order (Checkout)
**POST** `/api/orders/create`

Converts cart items to order items, updates product stock, and clears the cart.

**Example Request:**
```bash
POST /api/orders/create
Content-Type: application/json

{
  "userId": 1,
  "shippingAddress": "123 Main Street",
  "shippingCity": "New York",
  "shippingState": "NY",
  "shippingZipCode": "10001",
  "shippingCountry": "USA",
  "paymentMethod": "Credit Card",
  "notes": "Please deliver during business hours"
}
```

**Success Response (200):**
```json
{
  "message": "Order created successfully!",
  "order": {
    "orderId": 1,
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "orderDate": "2024-01-15T10:30:00",
    "status": "PENDING",
    "totalPrice": 999.99,
    "orderItems": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Laptop",
          "price": 999.99,
          "stock": 9
        },
        "quantity": 1,
        "unitPrice": 999.99,
        "subtotal": 999.99
      }
    ],
    "shippingAddress": "123 Main Street",
    "shippingCity": "New York",
    "shippingState": "NY",
    "shippingZipCode": "10001",
    "shippingCountry": "USA",
    "paymentMethod": "Credit Card",
    "notes": "Please deliver during business hours",
    "totalItems": 1
  }
}
```

**Error Response (400):**
```json
{
  "error": "Cannot checkout with empty cart"
}
```

## Complete Checkout Workflow

### Step 1: Add Items to Cart
```bash
POST /api/cart/1/add
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2
}
```

### Step 2: Preview Checkout
```bash
GET /api/cart/1/checkout-preview
```

### Step 3: Create Order
```bash
POST /api/orders/create
Content-Type: application/json

{
  "userId": 1,
  "shippingAddress": "123 Main Street",
  "shippingCity": "New York",
  "shippingState": "NY",
  "shippingZipCode": "10001",
  "shippingCountry": "USA",
  "paymentMethod": "Credit Card"
}
```

### Step 4: Verify Order Created
```bash
GET /api/orders/1/1
```

### Step 5: Verify Cart Cleared
```bash
GET /api/cart/1
```

## Business Logic

### What Happens During Checkout:

1. **Validation**: 
   - Checks if cart is empty
   - Validates stock availability for all items
   - Ensures user exists

2. **Order Creation**:
   - Creates new order with PENDING status
   - Converts cart items to order items
   - Sets shipping and payment information
   - Calculates total price

3. **Inventory Update**:
   - Reduces product stock by ordered quantities
   - Updates product entities in database

4. **Cart Management**:
   - Clears all items from user's cart
   - Cart remains but becomes empty

5. **Order Status**:
   - Initial status: PENDING
   - Can be updated to: CONFIRMED, SHIPPED, DELIVERED, CANCELLED

### Error Handling:

- **Insufficient Stock**: Prevents checkout if any product lacks sufficient stock
- **Empty Cart**: Prevents checkout with empty cart
- **Invalid User**: Returns error for non-existent users
- **Database Errors**: Handles transaction failures gracefully

## Frontend Integration

The frontend should implement this flow:

1. **Cart Page**: Show cart items with "Proceed to Checkout" button
2. **Checkout Preview**: Display cart summary and validation results
3. **Checkout Form**: Collect shipping and payment information
4. **Order Confirmation**: Show order details after successful creation
5. **Order History**: Display user's order history

## Testing

Test the checkout flow with various scenarios:

- ✅ Valid cart with sufficient stock
- ❌ Empty cart
- ❌ Insufficient stock
- ❌ Invalid user ID
- ❌ Missing required fields
- ✅ Partial shipping information
- ✅ Full shipping information
- ✅ With and without notes
