package com.example.ecomm.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.ecomm.dto.CartItemDto;
import com.example.ecomm.mapper.DtoMapper;
import com.example.ecomm.model.Cart;
import com.example.ecomm.model.CartItem;
import com.example.ecomm.model.Product;
import com.example.ecomm.repo.CartItemRepo;
import com.example.ecomm.repo.CartRepo;
import com.example.ecomm.repo.ProductRepo;

@Service
public class CartItemService {

    private final CartItemRepo cartItemRepo;
    private final CartRepo cartRepo;
    private final ProductRepo productRepo;

    public CartItemService(CartItemRepo cartItemRepo, CartRepo cartRepo, ProductRepo productRepo) {
        this.cartItemRepo = cartItemRepo;
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
    }

    // Add Cart Item: if the product is already in the cart the quantity is increased
    @Transactional
    public CartItemDto addCartItem(CartItemDto dto) {
        if (dto.getCartId() == null || dto.getProductId() == null) {
            throw bad("cartId and productId are required");
        }
        int qty = dto.getQuantity() == null ? 1 : dto.getQuantity();
        if (qty < 1) {
            throw bad("Quantity must be at least 1");
        }
        Cart cart = cartRepo.findById(dto.getCartId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));
        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        CartItem item = cartItemRepo.findByCartIdAndProductId(cart.getId(), product.getId()).orElse(null);
        int newQty = (item == null ? 0 : item.getQuantity()) + qty;
        checkStock(product, newQty);
        if (item == null) {
            item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
        }
        item.setQuantity(newQty);
        return DtoMapper.toCartItemDto(cartItemRepo.save(item));
    }

    @Transactional(readOnly = true)
    public List<CartItemDto> getAllCartItems() {
        return cartItemRepo.findAll().stream().map(DtoMapper::toCartItemDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CartItemDto> getItemsByCart(Long cartId) {
        return cartItemRepo.findByCartId(cartId).stream().map(DtoMapper::toCartItemDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<CartItemDto> getCartItemById(Long id) {
        return cartItemRepo.findById(id).map(DtoMapper::toCartItemDto);
    }

    // Update Cart Item: sets the quantity (and optionally the product)
    @Transactional
    public CartItemDto updateCartItem(Long id, CartItemDto dto) {
        CartItem item = cartItemRepo.findById(id).orElse(null);
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
                throw bad("Quantity must be at least 1 (delete the item to remove it)");
            }
            item.setQuantity(dto.getQuantity());
        }
        checkStock(item.getProduct(), item.getQuantity());
        return DtoMapper.toCartItemDto(cartItemRepo.save(item));
    }

    // Delete Cart Item
    @Transactional
    public boolean deleteCartItem(Long id) {
        if (cartItemRepo.existsById(id)) {
            cartItemRepo.deleteById(id);
            return true;
        }
        return false;
    }

    private void checkStock(Product product, int wanted) {
        int stock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
        if (wanted > stock) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Only " + stock + " unit(s) of " + product.getProductName() + " available.");
        }
    }

    private static ResponseStatusException bad(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
