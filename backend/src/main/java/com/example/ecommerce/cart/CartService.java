package com.example.ecommerce.cart;

import com.example.ecommerce.product.Product;
import com.example.ecommerce.product.ProductService;
import com.example.ecommerce.user.User;
import com.example.ecommerce.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.math.BigDecimal;

@Service
@Transactional
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    // Get or create cart for a user
    public Cart getOrCreateCart(User user) {
        Optional<Cart> existingCart = cartRepository.findByUser(user);
        if (existingCart.isPresent()) {
            return existingCart.get();
        } else {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        }
    }

    // Add product to cart
    public Cart addToCart(Long userId, Long productId, Integer quantity) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Product product = productService.findById(productId);
        if (product == null) {
            throw new RuntimeException("Product not found");
        }

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be positive");
        }

        if (product.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        Cart cart = getOrCreateCart(user);
        
        // Check if product already exists in cart
        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            // Update quantity
            CartItem item = existingItem.get();
            item.updateQuantity(item.getQuantity() + quantity);
        } else {
            // Add new item
            CartItem newItem = new CartItem(product, quantity);
            cart.addItem(newItem);
        }

        return cartRepository.save(cart);
    }

    // Remove product from cart
    public Cart removeFromCart(Long userId, Long productId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Cart cart = getOrCreateCart(user);
        
        cart.getCartItems().removeIf(item -> item.getProduct().getId().equals(productId));
        
        return cartRepository.save(cart);
    }

    // Update product quantity in cart
    public Cart updateQuantity(Long userId, Long productId, Integer newQuantity) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Cart cart = getOrCreateCart(user);
        
        Optional<CartItem> item = cart.getCartItems().stream()
                .filter(cartItem -> cartItem.getProduct().getId().equals(productId))
                .findFirst();

        if (item.isPresent()) {
            if (newQuantity <= 0) {
                cart.removeItem(item.get());
            } else {
                if (item.get().getProduct().getStock() < newQuantity) {
                    throw new RuntimeException("Insufficient stock");
                }
                item.get().updateQuantity(newQuantity);
            }
        }

        return cartRepository.save(cart);
    }

    // Clear cart
    public Cart clearCart(Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Cart cart = getOrCreateCart(user);
        cart.clearCart();
        
        return cartRepository.save(cart);
    }

    // Get cart for user
    public Cart getCart(Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return getOrCreateCart(user);
    }

    // Checkout validation - validates cart before creating order
    public Cart validateCartForCheckout(Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Cart cart = getOrCreateCart(user);
        
        if (cart.isEmpty()) {
            throw new RuntimeException("Cannot checkout with empty cart");
        }

        // Validate stock availability for all items
        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName() + 
                    " (Available: " + product.getStock() + ", Requested: " + cartItem.getQuantity() + ")");
            }
        }

        return cart;
    }

    // Get cart total for checkout display
    public BigDecimal getCartTotal(Long userId) {
        Cart cart = getCart(userId);
        return cart.getTotalPrice();
    }
}
