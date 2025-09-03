package com.example.ecommerce.order;

import com.example.ecommerce.cart.Cart;
import com.example.ecommerce.cart.CartItem;
import com.example.ecommerce.cart.CartService;
import com.example.ecommerce.product.Product;
import com.example.ecommerce.product.ProductService;
import com.example.ecommerce.user.User;
import com.example.ecommerce.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    // Create order from cart (checkout)
    public Order createOrderFromCart(CreateOrderRequest request) {
        User user = userService.getUserById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartService.validateCartForCheckout(request.getUserId());
        
        // Create new order with shipping information
        Order order = new Order(user, cart.getTotalPrice());
        
        // Set shipping details if provided
        if (request.getShippingAddress() != null && !request.getShippingAddress().trim().isEmpty()) {
            order.setShippingAddress(request.getShippingAddress());
            order.setShippingCity(request.getShippingCity());
            order.setShippingState(request.getShippingState());
            order.setShippingZipCode(request.getShippingZipCode());
            order.setShippingCountry(request.getShippingCountry());
        }
        
        // Set payment method if provided
        if (request.getPaymentMethod() != null && !request.getPaymentMethod().trim().isEmpty()) {
            order.setPaymentMethod(request.getPaymentMethod());
        }
        
        // Set notes if provided
        if (request.getNotes() != null && !request.getNotes().trim().isEmpty()) {
            order.setNotes(request.getNotes());
        }
        
        // Convert cart items to order items
        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();
            
            // Create order item
            OrderItem orderItem = new OrderItem(
                product, 
                cartItem.getQuantity(), 
                cartItem.getUnitPrice()
            );
            order.addOrderItem(orderItem);
            
            // Update product stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productService.save(product);
        }

        // Save order
        Order savedOrder = orderRepository.save(order);
        
        // Clear the cart after successful order creation
        cartService.clearCart(request.getUserId());
        
        return savedOrder;
    }

    // Get all orders for a user
    public List<Order> getOrdersByUserId(Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return orderRepository.findByUser(user);
    }

    // Get specific order by order ID
    public Order getOrderById(Long orderId) {
        return orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // Get specific order by order ID and user ID (for security)
    public Order getOrderByIdAndUserId(Long orderId, Long userId) {
        Order order = getOrderById(orderId);
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Order not found for this user");
        }
        return order;
    }

    // Update order status
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = getOrderById(orderId);
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    // Update order status with user validation
    public Order updateOrderStatusAndUserId(Long orderId, Long userId, OrderStatus newStatus) {
        Order order = getOrderByIdAndUserId(orderId, userId);
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    // Cancel order (restore stock if possible)
    public Order cancelOrder(Long orderId) {
        Order order = getOrderById(orderId);
        
        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot cancel delivered order");
        }
        
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Order is already cancelled");
        }
        
        // Restore product stock
        for (OrderItem orderItem : order.getOrderItems()) {
            Product product = orderItem.getProduct();
            product.setStock(product.getStock() + orderItem.getQuantity());
            productService.save(product);
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    // Cancel order with user validation
    public Order cancelOrderAndUserId(Long orderId, Long userId) {
        Order order = getOrderByIdAndUserId(orderId, userId);
        
        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot cancel delivered order");
        }
        
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Order is already cancelled");
        }
        
        // Restore product stock
        for (OrderItem orderItem : order.getOrderItems()) {
            Product product = orderItem.getProduct();
            product.setStock(product.getStock() + orderItem.getQuantity());
            productService.save(product);
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    // Get orders by status
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }
}
