package com.example.ecommerce.order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    // POST /api/orders/create - create order from cart (checkout)
    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            Order order = orderService.createOrderFromCart(request.getUserId());
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

    // GET /api/orders/{userId} - get all orders for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Long userId) {
        try {
            List<Order> orders = orderService.getOrdersByUserId(userId);
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/orders/{userId}/{orderId} - get specific order details for a user
    @GetMapping("/{userId}/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long userId, @PathVariable Long orderId) {
        try {
            Order order = orderService.getOrderByIdAndUserId(orderId, userId);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT /api/orders/{userId}/{orderId}/status - update order status
    @PutMapping("/{userId}/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long userId,
            @PathVariable Long orderId,
            @RequestBody UpdateOrderStatusRequest request) {
        try {
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

    // DELETE /api/orders/{userId}/{orderId}/cancel - cancel order
    @DeleteMapping("/{userId}/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long userId, @PathVariable Long orderId) {
        try {
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
