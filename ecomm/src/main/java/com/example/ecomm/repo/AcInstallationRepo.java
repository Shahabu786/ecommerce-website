package com.example.ecomm.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ecomm.model.AcInstallation;

public interface AcInstallationRepo extends JpaRepository<AcInstallation, Long> {
}
