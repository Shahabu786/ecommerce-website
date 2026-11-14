package com.example.ecomm.dto;

import jakarta.validation.constraints.*;
import java.util.Locale;

public record SellerRegistrationRequest(

        @NotBlank(message = "Full legal name is required")
        @Size(max = 150)
        String fullLegalName,

        @NotBlank(message = "Business name is required")
        @Size(max = 150)
        String businessName,

        @NotBlank
        @Email(message = "Enter a valid email")
        String email,

        @NotBlank
        @Pattern(regexp = "^[6-9][0-9]{9}$",
                message = "Enter a valid 10-digit Indian mobile number")
        String mobileNumber,

        @NotBlank
        @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]$",
                message = "Invalid PAN format")
        String panNumber,

        @Pattern(regexp = "^$|^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$",
                message = "Invalid GSTIN format")
        String gstin,

        @NotBlank
        @Size(max = 150)
        String accountHolderName,

        @NotBlank
        @Pattern(regexp = "^[0-9]{9,18}$",
                message = "Bank account number must be 9-18 digits")
        String bankAccountNumber,

        @NotBlank
        @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$",
                message = "Invalid IFSC code")
        String ifscCode,

        @NotBlank
        @Size(max = 1000)
        String businessAddress

) {
    public SellerRegistrationRequest {
        if (email != null) {
            email = email.trim().toLowerCase(Locale.ROOT);
        }
        if (panNumber != null) {
            panNumber = panNumber.trim().toUpperCase(Locale.ROOT);
        }
        if (gstin != null) {
            gstin = gstin.trim().toUpperCase(Locale.ROOT);
        }
        if (ifscCode != null) {
            ifscCode = ifscCode.trim().toUpperCase(Locale.ROOT);
        }
    }
}