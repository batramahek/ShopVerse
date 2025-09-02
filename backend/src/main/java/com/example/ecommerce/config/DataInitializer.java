package com.example.ecommerce.config;

import com.example.ecommerce.user.User;
import com.example.ecommerce.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if users already exist
        if (userRepository.count() == 0) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            
            // Create a default admin user
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@example.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            
            // Create a default regular user
            User regularUser = new User();
            regularUser.setUsername("user");
            regularUser.setEmail("user@example.com");
            regularUser.setPassword(passwordEncoder.encode("user123"));
            
            userRepository.save(adminUser);
            userRepository.save(regularUser);
            
            System.out.println("Default users created!");
            System.out.println("Admin user: admin/admin123");
            System.out.println("Regular user: user/user123");
        }
    }
}
