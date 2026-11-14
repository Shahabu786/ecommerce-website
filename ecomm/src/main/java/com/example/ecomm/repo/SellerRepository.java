package com.example.ecomm.repo;

import com.example.ecomm.model.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerRepository
        extends JpaRepository<Seller, Long> {

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByMobileNumber(String mobileNumber);

    boolean existsByPanNumber(String panNumber);

    boolean existsByGstin(String gstin);
}