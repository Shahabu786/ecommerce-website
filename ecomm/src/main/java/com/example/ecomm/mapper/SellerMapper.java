package com.example.ecomm.mapper;

import com.example.ecomm.dto.SellerRegistrationRequest;
import com.example.ecomm.dto.SellerResponse;
import com.example.ecomm.model.Seller;
import org.springframework.stereotype.Component;

@Component
public class SellerMapper {

    public Seller toEntity(SellerRegistrationRequest request) {
        Seller seller = new Seller();

        seller.setFullLegalName(request.fullLegalName().trim());
        seller.setBusinessName(request.businessName().trim());
        seller.setEmail(request.email());
        seller.setMobileNumber(request.mobileNumber());
        seller.setPanNumber(request.panNumber());
        seller.setGstin(
                request.gstin() == null || request.gstin().isBlank()
                        ? null : request.gstin()
        );
        seller.setAccountHolderName(request.accountHolderName().trim());
        seller.setBankAccountNumber(request.bankAccountNumber());
        seller.setIfscCode(request.ifscCode());
        seller.setBusinessAddress(request.businessAddress().trim());
        seller.setStatus("PENDING");

        return seller;
    }

    public SellerResponse toResponse(Seller seller) {
        String account = seller.getBankAccountNumber();
        String masked = "*".repeat(account.length() - 4)
                + account.substring(account.length() - 4);

        return new SellerResponse(
                seller.getId(),
                seller.getFullLegalName(),
                seller.getBusinessName(),
                seller.getEmail(),
                seller.getMobileNumber(),
                seller.getStatus(),
                masked
        );
    }
}