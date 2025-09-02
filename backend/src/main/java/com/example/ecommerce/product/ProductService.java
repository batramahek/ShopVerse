package com.example.ecommerce.product;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    // get all products
    public List<Product> findAll() {
        return repo.findAll();
    }

    // find product by id
    public Product findById(Long id) {
        return repo.findById(id).orElseThrow();
    }

    // create/update product
    public Product save(Product p) {
        return repo.save(p);
    }

    // delete product
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
