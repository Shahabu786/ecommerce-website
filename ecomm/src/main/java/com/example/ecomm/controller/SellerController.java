package com.example.ecomm.controller;

import com.example.ecomm.dto.SellerRegistrationRequest;
import com.example.ecomm.dto.SellerResponse;
import com.example.ecomm.service.SellerService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sellers")
public class SellerController {

    private final SellerService sellerService;

    public SellerController(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    @PostMapping("/register")
    public ResponseEntity<SellerResponse> registerSeller(
            @Valid @RequestBody SellerRegistrationRequest request) {

        SellerResponse response =
                sellerService.registerSeller(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}