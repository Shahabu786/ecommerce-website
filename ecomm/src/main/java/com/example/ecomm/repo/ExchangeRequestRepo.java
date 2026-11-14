package com.example.ecomm.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ecomm.model.ExchangeRequest;

public interface ExchangeRequestRepo extends JpaRepository<ExchangeRequest, Long> {
}
