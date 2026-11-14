package com.example.ecomm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.ecomm.dto.CartDto;
import com.example.ecomm.service.CartService;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Add Cart
    @PostMapping
    public ResponseEntity<CartDto> addCart(@RequestBody CartDto cart) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cartService.addCart(cart));
    }

    // Get All Carts
    @GetMapping
    public ResponseEntity<List<CartDto>> getAllCarts() {
        return ResponseEntity.ok(cartService.getAllCarts());
    }

    // Get the cart (with items) of one user; created on first use
    @GetMapping("/user/{userId}")
    public ResponseEntity<CartDto> getCartByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getOrCreateCartByUser(userId));
    }

    // Get Cart By ID
    @GetMapping("/{id}")
    public ResponseEntity<CartDto> getCartById(@PathVariable Long id) {
        return cartService.getCartById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update Cart
    @PutMapping("/{id}")
    public ResponseEntity<CartDto> updateCart(@PathVariable Long id, @RequestBody CartDto cart) {
        CartDto updated = cartService.updateCart(id, cart);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    // Remove all items from a cart
    @DeleteMapping("/{id}/items")
    public ResponseEntity<CartDto> clearCart(@PathVariable Long id) {
        CartDto cleared = cartService.clearCart(id);
        if (cleared == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cleared);
    }

    // Delete Cart
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable Long id) {
        if (cartService.deleteCart(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
