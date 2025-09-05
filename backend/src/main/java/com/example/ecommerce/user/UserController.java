package com.example.ecommerce.user;

import com.example.ecommerce.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // GET /api/users - get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // GET /api/users/username/{username} - get user by username
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/users/signup - create new user (signup)
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            System.out.println("Received user data: " + user);
            System.out.println("Username: " + user.getUsername());
            System.out.println("FullName: " + user.getFullName());
            System.out.println("Email: " + user.getEmail());
            System.out.println("Password: " + (user.getPassword() != null ? "[PROVIDED]" : "[NULL]"));
            
            User createdUser = userService.createUser(user);
            String token = jwtUtil.generateToken(createdUser.getUsername());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully!");
            response.put("user", createdUser);
            response.put("token", token);
            response.put("tokenType", "Bearer");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            System.err.println("Unexpected error during registration: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // POST /api/users/login - authenticate user (login)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Received login request for email: " + loginRequest.getEmail());
            
            // Find user by email first
            Optional<User> userOpt = userService.getUserByEmail(loginRequest.getEmail());
            if (!userOpt.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid email or password");
                return ResponseEntity.badRequest().body(error);
            }
            
            User user = userOpt.get();
            boolean isAuthenticated = userService.authenticateUser(
                    user.getUsername(), 
                    loginRequest.getPassword()
            );
            
            if (isAuthenticated) {
                String token = jwtUtil.generateToken(user.getUsername());
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful!");
                response.put("user", user);
                response.put("token", token);
                response.put("tokenType", "Bearer");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid email or password");
                return ResponseEntity.badRequest().body(error);
            }
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // PUT /api/users/username/{username} - update user
    @PutMapping("/username/{username}")
    public ResponseEntity<User> updateUser(@PathVariable String username, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUserByUsername(username, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/users/username/{username} - delete user
    @DeleteMapping("/username/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        try {
            userService.deleteUserByUsername(username);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User deleted successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "User not found");
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/users/me - get current authenticated user
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            Optional<User> user = userService.getUserByUsername(username);
            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "User not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication failed");
            return ResponseEntity.status(401).body(error);
        }
    }

    // GET /api/users/test - test endpoint
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Backend is working!");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
}
