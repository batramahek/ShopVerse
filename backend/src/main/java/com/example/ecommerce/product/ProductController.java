package com.example.ecommerce.product;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")

public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // get /api/products - list all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.findAll();
    }

    // get /api/products/{id} - get product by id
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.findById(id);
    }

    // post /api/products - create new product
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.save(product);
    }

    // put /api/products/{id} - updates existing product
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        Product cur = productService.findById(id);
        cur.setName(product.getName());
        cur.setDescription(product.getDescription());
        cur.setPrice(product.getPrice());
        cur.setCategory(product.getCategory());
        cur.setImageUrl(product.getImageUrl());
        cur.setStock(product.getStock());

        return productService.save(cur);
    }

    // delete /api/products/{id} - deletes product
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id)
    {
        productService.delete(id);
    }
}