# Shopping Cart API Examples

## Base URL
```
http://localhost:8080/api/cart
```

## 1. Get User's Cart
**GET** `/api/cart/{userId}`

**Example:**
```bash
curl -X GET http://localhost:8080/api/cart/1
```

**Response:**
```json
{
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
                "name": "iPhone 15",
                "price": 999.99,
                "description": "Latest iPhone model"
            },
            "quantity": 2,
            "unitPrice": 999.99,
            "subtotal": 1999.98
        }
    ],
    "totalItems": 2,
    "totalPrice": 1999.98,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
}
```

## 2. Add Product to Cart
**POST** `/api/cart/{userId}/add`

**Request Body:**
```json
{
    "productId": 1,
    "quantity": 2
}
```

**Example:**
```bash
curl -X POST http://localhost:8080/api/cart/1/add \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2}'
```

**Response:**
```json
{
    "message": "Product added to cart successfully!",
    "cart": {
        "id": 1,
        "cartItems": [...],
        "totalItems": 2,
        "totalPrice": 1999.98
    }
}
```

## 3. Update Product Quantity in Cart
**PUT** `/api/cart/{userId}/update/{productId}`

**Request Body:**
```json
{
    "quantity": 3
}
```

**Example:**
```bash
curl -X PUT http://localhost:8080/api/cart/1/update/1 \
  -H "Content-Type: application/json" \
  -d '{"quantity": 3}'
```

**Response:**
```json
{
    "message": "Cart updated successfully!",
    "cart": {
        "id": 1,
        "cartItems": [...],
        "totalItems": 3,
        "totalPrice": 2999.97
    }
}
```

## 4. Remove Product from Cart
**DELETE** `/api/cart/{userId}/remove/{productId}`

**Example:**
```bash
curl -X DELETE http://localhost:8080/api/cart/1/remove/1
```

**Response:**
```json
{
    "message": "Product removed from cart successfully!",
    "cart": {
        "id": 1,
        "cartItems": [],
        "totalItems": 0,
        "totalPrice": 0.00
    }
}
```

## 5. Clear Entire Cart
**DELETE** `/api/cart/{userId}/clear`

**Example:**
```bash
curl -X DELETE http://localhost:8080/api/cart/1/clear
```

**Response:**
```json
{
    "message": "Cart cleared successfully!",
    "cart": {
        "id": 1,
        "cartItems": [],
        "totalItems": 0,
        "totalPrice": 0.00
    }
}
```

## Cart Features

### Automatic Calculations
- **Subtotal**: Each cart item calculates `unitPrice × quantity`
- **Total Items**: Sum of all quantities in cart
- **Total Price**: Sum of all subtotals in cart

### Smart Item Management
- **Duplicate Products**: If you add a product that already exists, it updates the quantity
- **Stock Validation**: Checks if requested quantity is available
- **Quantity Updates**: Setting quantity to 0 or negative removes the item

### Database Relationships
- **One-to-One**: Each user has exactly one cart
- **One-to-Many**: Each cart contains multiple cart items
- **Many-to-One**: Each cart item references one product

## Testing Workflow

1. **Create a user** using the user signup API
2. **Add products to cart** using the add to cart API
3. **View cart contents** using the get cart API
4. **Update quantities** as needed
5. **Remove items** or clear the entire cart

## Error Handling

The API handles various error scenarios:
- **User not found**: Returns 404
- **Product not found**: Returns 400 with error message
- **Insufficient stock**: Returns 400 with error message
- **Invalid quantity**: Returns 400 with error message

## Notes
- Carts are automatically created when users first add items
- Each user has exactly one cart
- Cart items are automatically removed when products are deleted
- All prices use BigDecimal for precision
- Timestamps track when carts are created and last updated
