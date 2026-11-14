package com.example.ecomm.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ecomm.model.Order;

public interface OrderRepo extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
}
