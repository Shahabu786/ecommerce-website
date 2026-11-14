package com.example.ecomm.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ecomm.model.Product;

public interface ProductRepo extends JpaRepository<Product, Long> {

}