package com.example.ecomm.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity 
@Table(name = "cart_items") 
public class CartItem {

	 @Id 
	 @GeneratedValue(strategy = GenerationType.IDENTITY) 
	 private Long id; 
	 
	 @Column(nullable = false) 
	 private Integer quantity = 1; 
	 
	 public CartItem() {
		 
	 }
	 @ManyToOne(fetch = FetchType.LAZY)
	 @JoinColumn(name="cart_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
	 private Cart cart;
	 
	 @ManyToOne(fetch = FetchType.LAZY)
	 @JoinColumn(name="product_id", nullable=false)
    @com.fasterxml.jackson.annotation.JsonIgnore
	 private Product product;
	 
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public Cart getCart() {
		return cart;
	}

	public void setCart(Cart cart) {
		this.cart = cart;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}
	 
	 
}
