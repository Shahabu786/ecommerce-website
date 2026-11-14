package com.example.ecomm.dto;

import java.math.BigDecimal;

public class OrderItemDto {

    private Long id;
    private Integer quantity;
    private BigDecimal purchasePrice;
    private Long orderId;
    private Long productId;

    public OrderItemDto() {
    }

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

    public BigDecimal getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(BigDecimal purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    private String productName;

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

}
