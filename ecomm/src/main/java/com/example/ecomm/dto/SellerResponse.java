package com.example.ecomm.dto;

public record SellerResponse(
        Long id,
        String fullLegalName,
        String businessName,
        String email,
        String mobileNumber,
        String status,
        String maskedBankAccount
) {}