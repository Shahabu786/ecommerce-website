package com.example.ecomm.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CartDto {

    private Long id;
    private LocalDateTime createdAt;
    private Long userId;
    private List<Long> itemIds = new ArrayList<>();

    public CartDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<Long> getItemIds() {
        return itemIds;
    }

    public void setItemIds(List<Long> itemIds) {
        this.itemIds = itemIds;
    }

    private List<CartItemDto> items = new ArrayList<>();

    public List<CartItemDto> getItems() { return items; }
    public void setItems(List<CartItemDto> items) { this.items = items; }

}
