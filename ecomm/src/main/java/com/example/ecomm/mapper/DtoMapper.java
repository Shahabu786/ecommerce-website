package com.example.ecomm.mapper;

import java.util.ArrayList;
import java.util.List;

import com.example.ecomm.dto.CartDto;
import com.example.ecomm.dto.CartItemDto;
import com.example.ecomm.dto.OrderDto;
import com.example.ecomm.dto.OrderItemDto;
import com.example.ecomm.dto.PaymentDto;
import com.example.ecomm.dto.ProductDto;
import com.example.ecomm.dto.UserDto;
import com.example.ecomm.model.Cart;
import com.example.ecomm.model.CartItem;
import com.example.ecomm.model.Category;
import com.example.ecomm.model.Order;
import com.example.ecomm.model.OrderItem;
import com.example.ecomm.model.Payment;
import com.example.ecomm.model.Product;
import com.example.ecomm.model.User;

/**
 * Entity -> DTO conversion. Call this inside a @Transactional service method,
 * because relations are LAZY and open-in-view is disabled.
 */
public final class DtoMapper {

    private DtoMapper() {
    }

    public static UserDto toUserDto(User u) {
        UserDto d = new UserDto();
        d.setId(u.getId());
        d.setName(u.getName());
        d.setEmail(u.getEmail());
        d.setContact(u.getContact());
        d.setAddress(u.getAddress());
        d.setRole(u.getRole());
        return d; // password is intentionally never copied
    }

    public static ProductDto toProductDto(Product p) {
        ProductDto d = new ProductDto();
        d.setId(p.getId());
        d.setProductName(p.getProductName());
        d.setDescription(p.getDescription());
        d.setPrice(p.getPrice());
        d.setOldPrice(p.getOldPrice());
        d.setBrand(p.getBrand());
        d.setStockQuantity(p.getStockQuantity());
        d.setImagePath(p.getImagePath());
        Category c = p.getCategory();
        if (c != null) {
            d.setCategoryId(c.getId());
            d.setCategoryName(c.getCategoryName());
        }
        return d;
    }

    public static CartItemDto toCartItemDto(CartItem i) {
        CartItemDto d = new CartItemDto();
        d.setId(i.getId());
        d.setQuantity(i.getQuantity());
        if (i.getCart() != null) {
            d.setCartId(i.getCart().getId());
        }
        if (i.getProduct() != null) {
            d.setProductId(i.getProduct().getId());
            d.setProduct(toProductDto(i.getProduct()));
        }
        return d;
    }

    public static CartDto toCartDto(Cart c) {
        CartDto d = new CartDto();
        d.setId(c.getId());
        d.setCreatedAt(c.getCreatedAt());
        if (c.getUser() != null) {
            d.setUserId(c.getUser().getId());
        }
        List<CartItemDto> items = new ArrayList<>();
        List<Long> ids = new ArrayList<>();
        for (CartItem i : c.getItems()) {
            items.add(toCartItemDto(i));
            ids.add(i.getId());
        }
        d.setItems(items);
        d.setItemIds(ids);
        return d;
    }

    public static OrderItemDto toOrderItemDto(OrderItem i) {
        OrderItemDto d = new OrderItemDto();
        d.setId(i.getId());
        d.setQuantity(i.getQuantity());
        d.setPurchasePrice(i.getPurchasePrice());
        if (i.getOrder() != null) {
            d.setOrderId(i.getOrder().getId());
        }
        if (i.getProduct() != null) {
            d.setProductId(i.getProduct().getId());
            d.setProductName(i.getProduct().getProductName());
        }
        return d;
    }

    public static PaymentDto toPaymentDto(Payment p) {
        PaymentDto d = new PaymentDto();
        d.setId(p.getId());
        d.setPaymentReference(p.getPaymentReference());
        d.setPaymentMethod(p.getPaymentMethod());
        d.setAmount(p.getAmount());
        d.setPaymentStatus(p.getPaymentStatus());
        d.setPaymentDate(p.getPaymentDate());
        if (p.getOrder() != null) {
            d.setOrderId(p.getOrder().getId());
        }
        return d;
    }

    public static OrderDto toOrderDto(Order o) {
        OrderDto d = new OrderDto();
        d.setId(o.getId());
        d.setOrderDate(o.getOrderDate());
        d.setTotalAmount(o.getTotalAmount());
        d.setPaymentMethod(o.getPaymentMethod());
        d.setOrderStatus(o.getOrderStatus());
        d.setShippingAddress(o.getShippingAddress());
        if (o.getUser() != null) {
            d.setUserId(o.getUser().getId());
        }
        List<OrderItemDto> items = new ArrayList<>();
        List<Long> ids = new ArrayList<>();
        for (OrderItem i : o.getOrders()) {
            items.add(toOrderItemDto(i));
            ids.add(i.getId());
        }
        d.setItems(items);
        d.setOrderItemIds(ids);
        if (o.getPayment() != null) {
            d.setPaymentId(o.getPayment().getId());
            d.setPaymentStatus(o.getPayment().getPaymentStatus());
        }
        return d;
    }
}
