package com.example.ecommerce.cart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    // GET /api/cart/{userId} - get user's cart
    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable Long userId) {
        try {
            Cart cart = cartService.getCart(userId);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // POST /api/cart/{userId}/add - add product to cart
    @PostMapping("/{userId}/add")
    public ResponseEntity<?> addToCart(
            @PathVariable Long userId,
            @RequestBody AddToCartRequest request) {
        try {
            Cart cart = cartService.addToCart(userId, request.getProductId(), request.getQuantity());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product added to cart successfully!");
            response.put("cart", cart);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // DELETE /api/cart/{userId}/remove/{productId} - remove product from cart
    @DeleteMapping("/{userId}/remove/{productId}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        try {
            Cart cart = cartService.removeFromCart(userId, productId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product removed from cart successfully!");
            response.put("cart", cart);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // PUT /api/cart/{userId}/update/{productId} - update product quantity in cart
    @PutMapping("/{userId}/update/{productId}")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Long userId,
            @PathVariable Long productId,
            @RequestBody UpdateQuantityRequest request) {
        try {
            Cart cart = cartService.updateQuantity(userId, productId, request.getQuantity());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Cart updated successfully!");
            response.put("cart", cart);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // DELETE /api/cart/{userId}/clear - clear entire cart
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        try {
            Cart cart = cartService.clearCart(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Cart cleared successfully!");
            response.put("cart", cart);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
