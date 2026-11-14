package com.example.ecomm.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.ecomm.dto.ProductDto;
import com.example.ecomm.mapper.DtoMapper;
import com.example.ecomm.model.Category;
import com.example.ecomm.model.Product;
import com.example.ecomm.repo.CategoryRepo;
import com.example.ecomm.repo.ProductRepo;

@Service
public class ProductService {

    private final ProductRepo productRepo;
    private final CategoryRepo categoryRepo;

    public ProductService(ProductRepo productRepo, CategoryRepo categoryRepo) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
    }

    // 1. CREATE
    @Transactional
    public ProductDto addProduct(ProductDto dto) {
        Product product = new Product();
        apply(product, dto);
        return DtoMapper.toProductDto(productRepo.save(product));
    }

    // 2. READ ALL
    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts() {
        return productRepo.findAll().stream()
                .map(DtoMapper::toProductDto)
                .collect(Collectors.toList());
    }

    // 3. READ BY ID
    @Transactional(readOnly = true)
    public Optional<ProductDto> getProductById(Long id) {
        return productRepo.findById(id).map(DtoMapper::toProductDto);
    }

    // 4. UPDATE
    @Transactional
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = productRepo.findById(id).orElse(null);
        if (product == null) {
            return null;
        }
        apply(product, dto);
        return DtoMapper.toProductDto(productRepo.save(product));
    }

    // 5. DELETE
    @Transactional
    public boolean deleteProduct(Long id) {
        if (!productRepo.existsById(id)) {
            return false;
        }
        try {
            productRepo.deleteById(id);
            productRepo.flush();
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This product is part of existing carts or orders and cannot be deleted.");
        }
        return true;
    }

    private void apply(Product product, ProductDto dto) {
        if (dto.getProductName() == null || dto.getProductName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product name is required");
        }
        if (dto.getPrice() == null || dto.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid price is required");
        }
        product.setProductName(dto.getProductName().trim());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setOldPrice(dto.getOldPrice());
        product.setBrand(dto.getBrand());
        product.setStockQuantity(dto.getStockQuantity() == null ? 0 : dto.getStockQuantity());
        product.setImagePath(dto.getImagePath());
        if (dto.getCategoryId() != null) {
            Category category = categoryRepo.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Category not found: " + dto.getCategoryId()));
            product.setCategory(category);
        }
    }
}
