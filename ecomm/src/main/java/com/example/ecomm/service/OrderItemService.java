package com.example.ecomm.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.ecomm.dto.OrderItemDto;
import com.example.ecomm.mapper.DtoMapper;
import com.example.ecomm.model.Order;
import com.example.ecomm.model.OrderItem;
import com.example.ecomm.model.Product;
import com.example.ecomm.repo.OrderItemRepo;
import com.example.ecomm.repo.OrderRepo;
import com.example.ecomm.repo.ProductRepo;

@Service
public class OrderItemService {

    private final OrderItemRepo orderItemRepo;
    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;

    public OrderItemService(OrderItemRepo orderItemRepo, OrderRepo orderRepo, ProductRepo productRepo) {
        this.orderItemRepo = orderItemRepo;
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }

    // 1. Create Order Item
    @Transactional
    public OrderItemDto createOrderItem(OrderItemDto dto) {
        if (dto.getOrderId() == null || dto.getProductId() == null) {
            throw bad("orderId and productId are required");
        }
        if (dto.getQuantity() == null || dto.getQuantity() < 1) {
            throw bad("Quantity must be at least 1");
        }
        Order order = orderRepo.findById(dto.getOrderId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setProduct(product);
        item.setQuantity(dto.getQuantity());
        item.setPurchasePrice(dto.getPurchasePrice() != null ? dto.getPurchasePrice() : product.getPrice());
        return DtoMapper.toOrderItemDto(orderItemRepo.save(item));
    }

    // 2. Get All Order Items
    @Transactional(readOnly = true)
    public List<OrderItemDto> getAllOrderItems() {
        return orderItemRepo.findAll().stream().map(DtoMapper::toOrderItemDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderItemDto> getItemsByOrder(Long orderId) {
        return orderItemRepo.findByOrderId(orderId).stream()
                .map(DtoMapper::toOrderItemDto).collect(Collectors.toList());
    }

    // 3. Get Order Item By ID
    @Transactional(readOnly = true)
    public Optional<OrderItemDto> getOrderItemById(Long id) {
        return orderItemRepo.findById(id).map(DtoMapper::toOrderItemDto);
    }

    // 4. Update Order Item
    @Transactional
    public OrderItemDto updateOrderItem(Long id, OrderItemDto dto) {
        OrderItem item = orderItemRepo.findById(id).orElse(null);
        if (item == null) {
            return null;
        }
        if (dto.getProductId() != null && !dto.getProductId().equals(item.getProduct().getId())) {
            Product product = productRepo.findById(dto.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
            item.setProduct(product);
        }
        if (dto.getQuantity() != null) {
            if (dto.getQuantity() < 1) {
                throw bad("Quantity must be at least 1");
            }
            item.setQuantity(dto.getQuantity());
        }
        if (dto.getPurchasePrice() != null) {
            item.setPurchasePrice(dto.getPurchasePrice());
        }
        return DtoMapper.toOrderItemDto(orderItemRepo.save(item));
    }

    // 5. Delete Order Item
    @Transactional
    public boolean deleteOrderItem(Long id) {
        if (orderItemRepo.existsById(id)) {
            orderItemRepo.deleteById(id);
            return true;
        }
        return false;
    }

    private static ResponseStatusException bad(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
