
package com.example.ecomm.service;

import com.example.ecomm.model.Category;
import com.example.ecomm.repo.CategoryRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepo categoryRepo;

    public CategoryService(CategoryRepo categoryRepo) {
        this.categoryRepo = categoryRepo;
    }

    // Add Category
    public Category addCategory(Category category) {
        return categoryRepo.save(category);
    }

    // Get All Categories
    public List<Category> getAllCategories() {
        return categoryRepo.findAll();
    }

    // Get Category By ID
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepo.findById(id);
    }

    // Update Category
    public Category updateCategory(Long id, Category newCategory) {
        Optional<Category> optionalCategory =
                categoryRepo.findById(id);

        if (optionalCategory.isPresent()) {
            Category category = optionalCategory.get();

            category.setCategoryName(newCategory.getCategoryName());
            category.setDescription(newCategory.getDescription());

            return categoryRepo.save(category);
        }

        return null;
    }

    // Delete Category
    public boolean deleteCategory(Long id) {
        if (categoryRepo.existsById(id)) {
            categoryRepo.deleteById(id);
            return true;
        }

        return false;
    }
}
