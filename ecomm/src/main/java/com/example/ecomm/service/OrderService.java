
package com.example.ecomm.service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.ecomm.dto.CheckoutRequest;
import com.example.ecomm.dto.OrderDto;
import com.example.ecomm.mapper.DtoMapper;
import com.example.ecomm.model.Order;
import com.example.ecomm.model.OrderItem;
import com.example.ecomm.model.Payment;
import com.example.ecomm.model.Product;
import com.example.ecomm.model.User;
import com.example.ecomm.repo.CartRepo;
import com.example.ecomm.repo.OrderRepo;
import com.example.ecomm.repo.ProductRepo;
import com.example.ecomm.repo.UserRepo;

@Service
public class OrderService {

    private final OrderRepo orderRepo;
    private final UserRepo userRepo;
    private final ProductRepo productRepo;
    private final CartRepo cartRepo;

    // Constructor Injection
    public OrderService(OrderRepo orderRepo, UserRepo userRepo,
                        ProductRepo productRepo, CartRepo cartRepo) {

        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
        this.cartRepo = cartRepo;
    }

    /*
     * CHECKOUT
     * Creates Order + OrderItems + Payment in one transaction.
     */
    @Transactional
    public OrderDto checkout(CheckoutRequest req) {

        if (req == null || req.getUserId() == null) {
            throw bad("userId is required");
        }

        if (req.getItems() == null || req.getItems().isEmpty()) {
            throw bad("Cart is empty");
        }

        // Find user
        User user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        // Payment method validation
        String method = (req.getPaymentMethod() == null ||
                req.getPaymentMethod().isBlank())
                ? "COD"
                : req.getPaymentMethod().trim().toUpperCase();

        if (!"COD".equals(method)) {
            throw bad("Only Cash on Delivery (COD) is supported right now");
        }

        // Store product IDs and quantities
        Map<Long, Integer> wanted = new LinkedHashMap<>();

        for (CheckoutRequest.Item it : req.getItems()) {

            Long productId = it.getProductId();
            Integer quantity = it.getQuantity();

            if (productId == null || quantity == null || quantity < 1) {
                throw bad("Invalid item in cart");
            }

            // Duplicate product ki quantity add karna
            wanted.put(
                    productId,
                    wanted.getOrDefault(productId, 0) + quantity
            );
        }

        // Create new Order
        Order order = new Order();

        order.setUser(user);
        order.setPaymentMethod(method);
        order.setOrderStatus("PLACED");
        order.setShippingAddress(req.getShippingAddress());

        BigDecimal total = BigDecimal.ZERO;

        // Process all products
        for (Map.Entry<Long, Integer> entry : wanted.entrySet()) {

            Product product = productRepo.findById(entry.getKey())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Product not found: " + entry.getKey()));

            int qty = entry.getValue();

            int stock = product.getStockQuantity() == null
                    ? 0
                    : product.getStockQuantity();

            // Check available stock
            if (stock < qty) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Not enough stock for "
                                + product.getProductName()
                                + " (available: " + stock + ")");
            }

            // Reduce stock
            product.setStockQuantity(stock - qty);

            // Create OrderItem
            OrderItem item = new OrderItem();

            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(qty);
            item.setPurchasePrice(product.getPrice());

            order.getOrders().add(item);

            // Calculate total amount
            total = total.add(
                    product.getPrice().multiply(BigDecimal.valueOf(qty))
            );
        }

        order.setTotalAmount(total);

        // Create Payment
        Payment payment = new Payment();

        payment.setOrder(order);
        payment.setPaymentMethod(method);
        payment.setAmount(total);
        payment.setPaymentStatus("PENDING");

        payment.setPaymentReference(
                "PAY-" + UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 12)
                        .toUpperCase()
        );

        order.setPayment(payment);

        // Save Order
        Order saved = orderRepo.save(order);

        // Clear user's cart
        cartRepo.findByUserId(user.getId())
                .ifPresent(cart -> cart.getItems().clear());

        return DtoMapper.toOrderDto(saved);
    }

    // ADD ORDER
    // Raw create (storefront should use checkout instead)
    @Transactional
    public OrderDto addOrder(OrderDto dto) {

        if (dto.getUserId() == null) {
            throw bad("userId is required");
        }

        if (dto.getTotalAmount() == null) {
            throw bad("totalAmount is required");
        }

        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        Order order = new Order();

        order.setUser(user);
        order.setTotalAmount(dto.getTotalAmount());

        order.setPaymentMethod(
                dto.getPaymentMethod() == null
                        ? "COD"
                        : dto.getPaymentMethod()
        );

        if (dto.getOrderStatus() != null) {
            order.setOrderStatus(dto.getOrderStatus());
        }

        order.setShippingAddress(dto.getShippingAddress());

        return DtoMapper.toOrderDto(orderRepo.save(order));
    }

    // GET ALL ORDERS
    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrders() {

        return orderRepo.findAll()
                .stream()
                .map(DtoMapper::toOrderDto)
                .collect(Collectors.toList());
    }

    // GET ORDERS BY USER
    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersByUser(Long userId) {

        return orderRepo.findByUserIdOrderByOrderDateDesc(userId)
                .stream()
                .map(DtoMapper::toOrderDto)
                .collect(Collectors.toList());
    }

    // GET ORDER BY ID
    @Transactional(readOnly = true)
    public Optional<OrderDto> getOrderById(Long id) {

        return orderRepo.findById(id)
                .map(DtoMapper::toOrderDto);
    }

    // UPDATE ORDER
    @Transactional
    public OrderDto updateOrder(Long id, OrderDto dto) {

        Order order = orderRepo.findById(id).orElse(null);

        if (order == null) {
            return null;
        }

        if (dto.getOrderStatus() != null &&
                !dto.getOrderStatus().isBlank()) {

            String newStatus = dto.getOrderStatus()
                    .trim()
                    .toUpperCase();

            String oldStatus = order.getOrderStatus();

            // Restore stock when order is cancelled
            if ("CANCELLED".equals(newStatus) &&
                    !"CANCELLED".equals(oldStatus)) {

                if ("DELIVERED".equals(oldStatus)) {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Delivered orders cannot be cancelled");
                }

                for (OrderItem item : order.getOrders()) {

                    Product product = item.getProduct();

                    int stock = product.getStockQuantity() == null
                            ? 0
                            : product.getStockQuantity();

                    product.setStockQuantity(
                            stock + item.getQuantity()
                    );
                }

                // Update payment status
                if (order.getPayment() != null &&
                        "PENDING".equals(
                                order.getPayment().getPaymentStatus())) {

                    order.getPayment().setPaymentStatus("CANCELLED");
                }
            }

            order.setOrderStatus(newStatus);
        }

        // Update payment method
        if (dto.getPaymentMethod() != null &&
                !dto.getPaymentMethod().isBlank()) {

            order.setPaymentMethod(dto.getPaymentMethod());
        }

        // Update shipping address
        if (dto.getShippingAddress() != null) {
            order.setShippingAddress(dto.getShippingAddress());
        }

        return DtoMapper.toOrderDto(orderRepo.save(order));
    }

    // DELETE ORDER
    @Transactional
    public boolean deleteOrder(Long id) {

        if (orderRepo.existsById(id)) {

            orderRepo.deleteById(id);

            return true;
        }

        return false;
    }

    // BAD REQUEST EXCEPTION
    private static ResponseStatusException bad(String message) {

        return new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                message
        );
    }
}
