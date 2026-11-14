package com.example.ecomm.service;

import com.example.ecomm.dto.SellerRegistrationRequest;
import com.example.ecomm.dto.SellerResponse;
import com.example.ecomm.mapper.SellerMapper;
import com.example.ecomm.model.Seller;
import com.example.ecomm.repo.SellerRepository;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;
    private final SellerMapper sellerMapper;

    public SellerServiceImpl(
            SellerRepository sellerRepository,
            SellerMapper sellerMapper) {
        this.sellerRepository = sellerRepository;
        this.sellerMapper = sellerMapper;
    }

    @Override
    @Transactional
    public SellerResponse registerSeller(
            SellerRegistrationRequest request) {

        if (sellerRepository.existsByEmailIgnoreCase(
                request.email())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already registered"
            );
        }

        if (sellerRepository.existsByMobileNumber(
                request.mobileNumber())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Mobile number is already registered"
            );
        }

        if (sellerRepository.existsByPanNumber(
                request.panNumber())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "PAN number is already registered"
            );
        }

        String gstin = request.gstin();

        if (gstin != null && !gstin.isBlank()
                && sellerRepository.existsByGstin(gstin)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "GSTIN is already registered"
            );
        }

        Seller seller = sellerMapper.toEntity(request);

        try {
            Seller savedSeller =
                    sellerRepository.saveAndFlush(seller);

            return sellerMapper.toResponse(savedSeller);

        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Seller details already exist"
            );
        }
    }
}