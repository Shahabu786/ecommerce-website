package com.example.ecomm.dto;

public class CartItemDto {

    private Long id;
    private Integer quantity;
    private Long cartId;
    private Long productId;

    public CartItemDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Long getCartId() {
        return cartId;
    }

    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    private ProductDto product;

    public ProductDto getProduct() { return product; }
    public void setProduct(ProductDto product) { this.product = product; }

}
