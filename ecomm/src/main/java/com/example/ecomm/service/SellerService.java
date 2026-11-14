package com.example.ecomm.service;

import com.example.ecomm.dto.SellerRegistrationRequest;
import com.example.ecomm.dto.SellerResponse;

public interface SellerService {

    SellerResponse registerSeller(
            SellerRegistrationRequest request
    );
}