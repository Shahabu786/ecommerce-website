package com.example.ecomm.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecomm.dto.ExchangeRequestDto;
import com.example.ecomm.model.ExchangeRequest;
import com.example.ecomm.repo.ExchangeRequestRepo;

@RestController
@RequestMapping("/api/exchange")
public class ExchangeController {

    private final ExchangeRequestRepo repo;

    public ExchangeRequestRepo getRepo() { return repo; }

    public ExchangeController(ExchangeRequestRepo repo) {
        this.repo = repo;
    }

    @PostMapping
    public ResponseEntity<ExchangeRequest> submit(@RequestBody ExchangeRequestDto dto) {
        ExchangeRequest ex = new ExchangeRequest();
        ex.setCategory(dto.getCategory());
        ex.setBrand(dto.getBrand());
        ex.setModel(dto.getModel());
        ex.setApplianceAge(dto.getAge());
        ex.setApplianceCondition(dto.getCondition());
        ex.setFullName(dto.getFullName());
        ex.setEmail(dto.getEmail());
        ex.setPhone(dto.getPhone());
        ex.setAddress(dto.getAddress());
        ex.setCity(dto.getCity());
        ex.setPincode(dto.getPincode());
        ex.setNotes(dto.getNotes());

        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(ex));
    }
}
