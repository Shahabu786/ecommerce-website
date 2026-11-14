package com.example.ecomm.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ecomm.model.OrderItem;

public interface OrderItemRepo extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);
}
