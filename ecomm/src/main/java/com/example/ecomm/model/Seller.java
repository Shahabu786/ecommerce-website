package com.example.ecomm.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sellers")
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullLegalName;

    @Column(name = "business_name", nullable = false)
    private String businessName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String mobileNumber;

    @Column(nullable = false, unique = true)
    private String panNumber;

    @Column(unique = true)
    private String gstin;

    @Column(nullable = false)
    private String accountHolderName;

    @Column(nullable = false)
    private String bankAccountNumber;

    @Column(nullable = false)
    private String ifscCode;

    @Column(nullable = false, length = 1000)
    private String businessAddress;

    @Column(nullable = false)
    private String status = "PENDING";

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public String getFullLegalName() { return fullLegalName; }
    public void setFullLegalName(String value) {
        this.fullLegalName = value;
    }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String value) {
        this.businessName = value;
    }

    public String getEmail() { return email; }
    public void setEmail(String value) { this.email = value; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String value) {
        this.mobileNumber = value;
    }

    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String value) {
        this.panNumber = value;
    }

    public String getGstin() { return gstin; }
    public void setGstin(String value) { this.gstin = value; }

    public String getAccountHolderName() {
        return accountHolderName;
    }
    public void setAccountHolderName(String value) {
        this.accountHolderName = value;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }
    public void setBankAccountNumber(String value) {
        this.bankAccountNumber = value;
    }

    public String getIfscCode() { return ifscCode; }
    public void setIfscCode(String value) {
        this.ifscCode = value;
    }

    public String getBusinessAddress() {
        return businessAddress;
    }
    public void setBusinessAddress(String value) {
        this.businessAddress = value;
    }

    public String getStatus() { return status; }
    public void setStatus(String value) { this.status = value; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}