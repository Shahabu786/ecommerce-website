package com.example.ecomm.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecomm.dto.AcInstallationDto;
import com.example.ecomm.model.AcInstallation;
import com.example.ecomm.repo.AcInstallationRepo;

@RestController
@RequestMapping("/api/ac-installation")
public class AcInstallationController {

    private final AcInstallationRepo repo;

    public AcInstallationController(AcInstallationRepo repo) {
        this.repo = repo;
    }

    @PostMapping
    public ResponseEntity<AcInstallation> book(@RequestBody AcInstallationDto dto) {
        AcInstallation ac = new AcInstallation();
        ac.setServiceName(dto.getServiceName());
        ac.setFullName(dto.getFullName());
        ac.setEmail(dto.getEmail());
        ac.setPhone(dto.getPhone());
        ac.setAddress(dto.getAddress());
        ac.setCity(dto.getCity());
        ac.setPincode(dto.getPincode());
        ac.setAcBrand(dto.getAcBrand());
        ac.setAcTon(dto.getAcTon());
        ac.setPreferredDate(dto.getDate());
        ac.setTimeSlot(dto.getTimeSlot());
        ac.setNotes(dto.getNotes());

        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(ac));
    }
}
