package com.example.ecomm.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ecomm.model.Category;

public interface CategoryRepo extends JpaRepository<Category, Long> {

}