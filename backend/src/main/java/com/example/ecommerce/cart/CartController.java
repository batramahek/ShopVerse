package com.example.ecommerce.cart;

import com.example.ecommerce.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    // Helper method to get current user ID
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    // GET /api/cart - get current user's cart
    @GetMapping
    public ResponseEntity<Cart> getCart() {
        try {
            Long userId = getCurrentUserId();
            Cart cart = cartService.getCart(userId);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // POST /api/cart/add - add product to cart
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody AddToCartRequest request) {
        try {
            Long userId = getCurrentUserId();
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

    // DELETE /api/cart/remove/{productId} - remove product from cart
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long productId) {
        try {
            Long userId = getCurrentUserId();
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

    // PUT /api/cart/update/{productId} - update product quantity in cart
    @PutMapping("/update/{productId}")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Long productId,
            @RequestBody UpdateQuantityRequest request) {
        try {
            Long userId = getCurrentUserId();
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

    // DELETE /api/cart/clear - clear entire cart
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart() {
        try {
            Long userId = getCurrentUserId();
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

    // GET /api/cart/checkout-preview - preview cart for checkout
    @GetMapping("/checkout-preview")
    public ResponseEntity<?> getCheckoutPreview() {
        try {
            Long userId = getCurrentUserId();
            Cart cart = cartService.validateCartForCheckout(userId);
            BigDecimal total = cartService.getCartTotal(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Cart is ready for checkout!");
            response.put("cart", cart);
            response.put("total", total);
            response.put("itemCount", cart.getTotalItems());
            response.put("canCheckout", true);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("canCheckout", false);
            return ResponseEntity.badRequest().body(error);
        }
    }
}
