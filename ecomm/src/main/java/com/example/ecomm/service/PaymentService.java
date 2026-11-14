package com.example.ecomm.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.ecomm.dto.PaymentDto;
import com.example.ecomm.mapper.DtoMapper;
import com.example.ecomm.model.Order;
import com.example.ecomm.model.Payment;
import com.example.ecomm.repo.OrderRepo;
import com.example.ecomm.repo.PaymentRepo;

@Service
public class PaymentService {

    private final PaymentRepo paymentRepo;
    private final OrderRepo orderRepo;

    public PaymentService(PaymentRepo paymentRepo, OrderRepo orderRepo) {
        this.paymentRepo = paymentRepo;
        this.orderRepo = orderRepo;
    }

    // 1. Add Payment
    @Transactional
    public PaymentDto addPayment(PaymentDto dto) {
        Payment payment = new Payment();
        if (dto.getOrderId() != null) {
            Order order = orderRepo.findById(dto.getOrderId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
            if (paymentRepo.findByOrderId(order.getId()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "This order already has a payment");
            }
            payment.setOrder(order);
            payment.setAmount(dto.getAmount() != null ? dto.getAmount() : order.getTotalAmount());
            payment.setPaymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : order.getPaymentMethod());
        } else {
            if (dto.getAmount() == null || dto.getPaymentMethod() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "amount and paymentMethod are required");
            }
            payment.setAmount(dto.getAmount());
            payment.setPaymentMethod(dto.getPaymentMethod());
        }
        payment.setPaymentReference(dto.getPaymentReference() != null && !dto.getPaymentReference().isBlank()
                ? dto.getPaymentReference()
                : "PAY-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase());
        applyStatus(payment, dto.getPaymentStatus());
        return DtoMapper.toPaymentDto(paymentRepo.save(payment));
    }

    // 2. Get All Payments
    @Transactional(readOnly = true)
    public List<PaymentDto> getAllPayments() {
        return paymentRepo.findAll().stream().map(DtoMapper::toPaymentDto).collect(Collectors.toList());
    }

    // 3. Get Payment By ID
    @Transactional(readOnly = true)
    public Optional<PaymentDto> getPaymentById(Long id) {
        return paymentRepo.findById(id).map(DtoMapper::toPaymentDto);
    }

    @Transactional(readOnly = true)
    public Optional<PaymentDto> getPaymentByOrder(Long orderId) {
        return paymentRepo.findByOrderId(orderId).map(DtoMapper::toPaymentDto);
    }

    // 4. Update Payment
    @Transactional
    public Optional<PaymentDto> updatePayment(Long id, PaymentDto dto) {
        Payment payment = paymentRepo.findById(id).orElse(null);
        if (payment == null) {
            return Optional.empty();
        }
        if (dto.getPaymentMethod() != null) {
            payment.setPaymentMethod(dto.getPaymentMethod());
        }
        if (dto.getAmount() != null) {
            payment.setAmount(dto.getAmount());
        }
        if (dto.getPaymentReference() != null && !dto.getPaymentReference().isBlank()) {
            payment.setPaymentReference(dto.getPaymentReference());
        }
        applyStatus(payment, dto.getPaymentStatus());
        return Optional.of(DtoMapper.toPaymentDto(paymentRepo.save(payment)));
    }

    // 5. Delete Payment
    @Transactional
    public boolean deletePayment(Long id) {
        if (!paymentRepo.existsById(id)) {
            return false;
        }
        paymentRepo.deleteById(id);
        return true;
    }

    private void applyStatus(Payment payment, String status) {
        if (status == null || status.isBlank()) {
            return;
        }
        String s = status.trim().toUpperCase();
        payment.setPaymentStatus(s);
        if ("PAID".equals(s) && payment.getPaymentDate() == null) {
            payment.setPaymentDate(LocalDateTime.now());
        }
    }
}
