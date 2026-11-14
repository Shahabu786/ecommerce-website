package com.example.ecomm.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.ecomm.dto.CartDto;
import com.example.ecomm.mapper.DtoMapper;
import com.example.ecomm.model.Cart;
import com.example.ecomm.model.User;
import com.example.ecomm.repo.CartRepo;
import com.example.ecomm.repo.UserRepo;

@Service
public class CartService {

    private final CartRepo cartRepo;
    private final UserRepo userRepo;

    public CartService(CartRepo cartRepo, UserRepo userRepo) {
        this.cartRepo = cartRepo;
        this.userRepo = userRepo;
    }

    // Add Cart (one cart per user: returns the existing one if present)
    @Transactional
    public CartDto addCart(CartDto dto) {
        User user = requireUser(dto.getUserId());
        Cart cart = cartRepo.findByUserId(user.getId()).orElseGet(() -> newCart(user));
        return DtoMapper.toCartDto(cart);
    }

    // Get (or lazily create) the cart of a user, including its items
    @Transactional
    public CartDto getOrCreateCartByUser(Long userId) {
        User user = requireUser(userId);
        Cart cart = cartRepo.findByUserId(user.getId()).orElseGet(() -> newCart(user));
        return DtoMapper.toCartDto(cart);
    }

    @Transactional(readOnly = true)
    public List<CartDto> getAllCarts() {
        return cartRepo.findAll().stream().map(DtoMapper::toCartDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<CartDto> getCartById(Long id) {
        return cartRepo.findById(id).map(DtoMapper::toCartDto);
    }

    // Update Cart (only re-assigning the owner is supported)
    @Transactional
    public CartDto updateCart(Long id, CartDto dto) {
        Cart cart = cartRepo.findById(id).orElse(null);
        if (cart == null) {
            return null;
        }
        if (dto.getUserId() != null && !dto.getUserId().equals(cart.getUser().getId())) {
            User user = requireUser(dto.getUserId());
            if (cartRepo.findByUserId(user.getId()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "That user already has a cart.");
            }
            cart.setUser(user);
        }
        return DtoMapper.toCartDto(cartRepo.save(cart));
    }

    // Remove every item from a cart
    @Transactional
    public CartDto clearCart(Long id) {
        Cart cart = cartRepo.findById(id).orElse(null);
        if (cart == null) {
            return null;
        }
        cart.getItems().clear();
        return DtoMapper.toCartDto(cart);
    }

    // Delete Cart
    @Transactional
    public boolean deleteCart(Long id) {
        if (cartRepo.existsById(id)) {
            cartRepo.deleteById(id);
            return true;
        }
        return false;
    }

    private Cart newCart(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepo.save(cart);
    }

    private User requireUser(Long userId) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }
        return userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + userId));
    }
}
