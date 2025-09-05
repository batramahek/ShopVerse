package com.example.ecommerce.config;

import com.example.ecommerce.user.User;
import com.example.ecommerce.user.UserRepository;
import com.example.ecommerce.product.Product;
import com.example.ecommerce.product.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if users already exist
        if (userRepository.count() == 0) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            
            // Create a default admin user
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setFullName("Admin User");
            adminUser.setEmail("admin@example.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            
            // Create a default regular user
            User regularUser = new User();
            regularUser.setUsername("user");
            regularUser.setFullName("Regular User");
            regularUser.setEmail("user@example.com");
            regularUser.setPassword(passwordEncoder.encode("user123"));
            
            userRepository.save(adminUser);
            userRepository.save(regularUser);
            
            System.out.println("Default users created!");
            System.out.println("Admin user: admin/admin123");
            System.out.println("Regular user: user/user123");
        }
        
        // Check if products already exist
        if (productRepository.count() == 0) {
            // Create sample products
            Product product1 = Product.builder()
                .name("Wireless Bluetooth Headphones")
                .description("High-quality wireless headphones with noise cancellation and 30-hour battery life.")
                .price(new BigDecimal("99.99"))
                .category("Electronics")
                .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500")
                .stock(50)
                .build();
                
            Product product2 = Product.builder()
                .name("Smart Fitness Watch")
                .description("Track your fitness with this advanced smartwatch featuring heart rate monitoring and GPS.")
                .price(new BigDecimal("199.99"))
                .category("Electronics")
                .imageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500")
                .stock(30)
                .build();
                
            Product product3 = Product.builder()
                .name("Organic Cotton T-Shirt")
                .description("Comfortable and sustainable organic cotton t-shirt in various colors.")
                .price(new BigDecimal("24.99"))
                .category("Fashion")
                .imageUrl("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500")
                .stock(100)
                .build();
                
            Product product4 = Product.builder()
                .name("Ceramic Coffee Mug Set")
                .description("Set of 4 beautiful ceramic coffee mugs perfect for your morning routine.")
                .price(new BigDecimal("39.99"))
                .category("Home & Garden")
                .imageUrl("https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=500")
                .stock(25)
                .build();
                
            Product product5 = Product.builder()
                .name("Yoga Mat Premium")
                .description("Non-slip yoga mat with extra cushioning for all your fitness activities.")
                .price(new BigDecimal("49.99"))
                .category("Sports")
                .imageUrl("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500")
                .stock(40)
                .build();
                
            Product product6 = Product.builder()
                .name("Programming Book: Clean Code")
                .description("Essential reading for software developers. Learn to write clean, maintainable code.")
                .price(new BigDecimal("34.99"))
                .category("Books")
                .imageUrl("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500")
                .stock(20)
                .build();
                
            Product product7 = Product.builder()
                .name("Skincare Set")
                .description("Complete skincare routine with cleanser, moisturizer, and serum.")
                .price(new BigDecimal("79.99"))
                .category("Beauty")
                .imageUrl("https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500")
                .stock(35)
                .build();
                
            Product product8 = Product.builder()
                .name("LED Desk Lamp")
                .description("Adjustable LED desk lamp with multiple brightness levels and USB charging port.")
                .price(new BigDecimal("59.99"))
                .category("Electronics")
                .imageUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500")
                .stock(15)
                .build();
            
            productRepository.save(product1);
            productRepository.save(product2);
            productRepository.save(product3);
            productRepository.save(product4);
            productRepository.save(product5);
            productRepository.save(product6);
            productRepository.save(product7);
            productRepository.save(product8);
            
            System.out.println("Sample products created!");
        }
    }
}
