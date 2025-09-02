# Order Management API Examples

## Base URL
```
http://localhost:8080/api/orders
```

## 1. Create Order from Cart (Checkout)
**POST** `/api/orders/create`

**Request Body:**
```json
{
    "userId": 1
}
```

**Example:**
```bash
curl -X POST http://localhost:8080/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'
```

**Response:**
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
        "orderDate": "2024-01-15T14:30:00",
        "status": "PENDING",
        "totalPrice": 1999.98,
        "orderItems": [
            {
                "id": 1,
                "product": {
                    "id": 1,
                    "name": "iPhone 15",
                    "price": 999.99
                },
                "quantity": 2,
                "unitPrice": 999.99,
                "subtotal": 1999.98
            }
        ],
        "totalItems": 2
    }
}
```

## 2. Get All Orders for a User
**GET** `/api/orders/user/{userId}`

**Example:**
```bash
curl -X GET http://localhost:8080/api/orders/user/1
```

**Response:**
```json
[
    {
        "orderId": 1,
        "orderDate": "2024-01-15T14:30:00",
        "status": "PENDING",
        "totalPrice": 1999.98,
        "totalItems": 2
    },
    {
        "orderId": 2,
        "orderDate": "2024-01-14T10:15:00",
        "status": "DELIVERED",
        "totalPrice": 599.99,
        "totalItems": 1
    }
]
```

## 3. Get Specific Order Details
**GET** `/api/orders/{userId}/{orderId}`

**Example:**
```bash
curl -X GET http://localhost:8080/api/orders/1/1
```

**Response:**
```json
{
    "orderId": 1,
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com"
    },
    "orderDate": "2024-01-15T14:30:00",
    "status": "PENDING",
    "totalPrice": 1999.98,
    "orderItems": [
        {
            "id": 1,
            "product": {
                "id": 1,
                "name": "iPhone 15",
                "price": 999.99,
                "description": "Latest iPhone model"
            },
            "quantity": 2,
            "unitPrice": 999.99,
            "subtotal": 1999.98
        }
    ],
    "totalItems": 2
}
```

## 4. Update Order Status
**PUT** `/api/orders/{userId}/{orderId}/status`

**Request Body:**
```json
{
    "status": "CONFIRMED"
}
```

**Example:**
```bash
curl -X PUT http://localhost:8080/api/orders/1/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "CONFIRMED"}'
```

**Response:**
```json
{
    "message": "Order status updated successfully!",
    "order": {
        "orderId": 1,
        "status": "CONFIRMED",
        "totalPrice": 1999.98
    }
}
```

## 5. Cancel Order
**DELETE** `/api/orders/{userId}/{orderId}/cancel`

**Example:**
```bash
curl -X DELETE http://localhost:8080/api/orders/1/1/cancel
```

**Response:**
```json
{
    "message": "Order cancelled successfully!",
    "order": {
        "orderId": 1,
        "status": "CANCELLED",
        "totalPrice": 1999.98
    }
}
```

## 6. Get Orders by Status
**GET** `/api/orders/status/{status}`

**Example:**
```bash
curl -X GET http://localhost:8080/api/orders/status/PENDING
```

**Response:**
```json
[
    {
        "orderId": 1,
        "orderDate": "2024-01-15T14:30:00",
        "status": "PENDING",
        "totalPrice": 1999.98,
        "totalItems": 2
    }
]
```

## Order Status Values
- **PENDING**: Order created, waiting for payment
- **CONFIRMED**: Payment confirmed
- **PROCESSING**: Order being prepared
- **SHIPPED**: Order shipped
- **DELIVERED**: Order delivered
- **CANCELLED**: Order cancelled

## Complete Checkout Workflow

### 1. Add Items to Cart
```bash
# Add products to cart
curl -X POST http://localhost:8080/api/cart/1/add \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2}'
```

### 2. Review Cart
```bash
# Check cart contents
curl -X GET http://localhost:8080/api/cart/1
```

### 3. Create Order (Checkout)
```bash
# Convert cart to order
curl -X POST http://localhost:8080/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'
```

### 4. View Order
```bash
# Get order details
curl -X GET http://localhost:8080/api/orders/1/1
```

## Key Features

### Automatic Stock Management
- **Stock Reduction**: Product stock is automatically reduced when order is created
- **Stock Restoration**: Stock is restored if order is cancelled
- **Stock Validation**: Prevents orders with insufficient stock

### Cart Integration
- **Automatic Cart Clearing**: Cart is cleared after successful order creation
- **Cart Validation**: Cannot create order from empty cart
- **Price Preservation**: Order items maintain the price at time of purchase

### Order Lifecycle
- **Status Tracking**: Complete order status management
- **Audit Trail**: Order creation and modification timestamps
- **User Association**: Orders are linked to specific users

## Error Handling

The API handles various error scenarios:
- **User not found**: Returns 404
- **Empty cart**: Returns 400 with "Cannot create order from empty cart"
- **Insufficient stock**: Returns 400 with stock error message
- **Order not found**: Returns 404
- **Invalid status changes**: Returns 400 with appropriate error message

## Testing in Postman

1. **Create a collection** for Order APIs
2. **Set base URL** to `http://localhost:8080/api/orders`
3. **Test the complete workflow**:
   - Add items to cart
   - Create order
   - View order details
   - Update order status
   - Cancel order (if needed)

## Notes
- Orders are created from cart contents
- Product stock is automatically managed
- Cart is cleared after successful order creation
- Order status can be updated through the lifecycle
- Cancelled orders restore product stock
- All prices use BigDecimal for precision
