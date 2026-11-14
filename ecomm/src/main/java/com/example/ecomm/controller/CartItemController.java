package com.example.ecomm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.ecomm.dto.CartItemDto;
import com.example.ecomm.service.CartItemService;

@RestController
@RequestMapping("/api/cart-items")
public class CartItemController {

    private final CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

    // Add Cart Item (increments quantity if the product is already in the cart)
    @PostMapping
    public ResponseEntity<CartItemDto> addCartItem(@RequestBody CartItemDto cartItem) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cartItemService.addCartItem(cartItem));
    }

    // Get All Cart Items
    @GetMapping
    public ResponseEntity<List<CartItemDto>> getAllCartItems() {
        return ResponseEntity.ok(cartItemService.getAllCartItems());
    }

    // Get items of one cart
    @GetMapping("/cart/{cartId}")
    public ResponseEntity<List<CartItemDto>> getItemsByCart(@PathVariable Long cartId) {
        return ResponseEntity.ok(cartItemService.getItemsByCart(cartId));
    }

    // Get Cart Item By ID
    @GetMapping("/{id}")
    public ResponseEntity<CartItemDto> getCartItemById(@PathVariable Long id) {
        return cartItemService.getCartItemById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update Cart Item
    @PutMapping("/{id}")
    public ResponseEntity<CartItemDto> updateCartItem(@PathVariable Long id, @RequestBody CartItemDto cartItem) {
        CartItemDto updated = cartItemService.updateCartItem(id, cartItem);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    // Delete Cart Item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable Long id) {
        if (cartItemService.deleteCartItem(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
