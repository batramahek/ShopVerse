package com.example.ecommerce.cart;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartSummaryDTO {
    private Long cartId;
    private Long userId;
    private int totalItems;
    private BigDecimal totalPrice;
    private LocalDateTime updatedAt;
    
    public static CartSummaryDTO fromCart(Cart cart) {
        CartSummaryDTO dto = new CartSummaryDTO();
        dto.setCartId(cart.getId());
        dto.setUserId(cart.getUser().getId());
        dto.setTotalItems(cart.getTotalItems());
        dto.setTotalPrice(cart.getTotalPrice());
        dto.setUpdatedAt(cart.getUpdatedAt());
        return dto;
    }
}
