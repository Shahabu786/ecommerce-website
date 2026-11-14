package com.example.ecomm.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity 
@Table(name = "products") 
public class Product {

	@Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id; 
 
    @Column(nullable = false, length = 150) 
    private String productName; 
 
    @Column(length = 2000) 
    private String description; 
 
    @Column(nullable = false, precision = 12, scale = 2) 
    private BigDecimal price; 
 
    @Column(nullable = false) 
    private Integer stockQuantity; 
 
    private String imagePath;
    
    public Product() {
    	
    }
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="category_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Category category;
    
    @OneToMany(mappedBy = "product")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<CartItem> items=new ArrayList<CartItem>();
    
    @OneToMany(mappedBy = "product")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<OrderItem> orders =new ArrayList<OrderItem>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public Integer getStockQuantity() {
		return stockQuantity;
	}

	public void setStockQuantity(Integer stockQuantity) {
		this.stockQuantity = stockQuantity;
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}
    
    

    @Column(length = 100)
    private String brand;

    @Column(precision = 12, scale = 2)
    private BigDecimal oldPrice;

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public BigDecimal getOldPrice() { return oldPrice; }
    public void setOldPrice(BigDecimal oldPrice) { this.oldPrice = oldPrice; }

}
