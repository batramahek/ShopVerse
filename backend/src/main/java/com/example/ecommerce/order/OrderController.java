package com.example.ecommerce.order;

import com.example.ecommerce.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

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

    // POST /api/orders/create - create order from cart (checkout)
    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            // Set the userId from the authenticated user
            request.setUserId(getCurrentUserId());
            Order order = orderService.createOrderFromCart(request);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order created successfully!");
            response.put("order", order);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // GET /api/orders - get all orders for current user
    @GetMapping
    public ResponseEntity<List<Order>> getCurrentUserOrders() {
        try {
            Long userId = getCurrentUserId();
            List<Order> orders = orderService.getOrdersByUserId(userId);
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/orders/{orderId} - get specific order details for current user
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        try {
            Long userId = getCurrentUserId();
            Order order = orderService.getOrderByIdAndUserId(orderId, userId);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT /api/orders/{orderId}/status - update order status for current user
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody UpdateOrderStatusRequest request) {
        try {
            Long userId = getCurrentUserId();
            Order order = orderService.updateOrderStatusAndUserId(orderId, userId, request.getStatus());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order status updated successfully!");
            response.put("order", order);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // DELETE /api/orders/{orderId}/cancel - cancel order for current user
    @DeleteMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId) {
        try {
            Long userId = getCurrentUserId();
            Order order = orderService.cancelOrderAndUserId(orderId, userId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order cancelled successfully!");
            response.put("order", order);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // GET /api/orders/status/{status} - get orders by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable OrderStatus status) {
        List<Order> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }
}
