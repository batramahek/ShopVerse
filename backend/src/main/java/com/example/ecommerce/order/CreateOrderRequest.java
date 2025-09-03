package com.example.ecommerce.order;

import lombok.Data;

@Data
public class CreateOrderRequest {
    private Long userId;
    private String shippingAddress;
    private String shippingCity;
    private String shippingState;
    private String shippingZipCode;
    private String shippingCountry;
    private String paymentMethod;
    private String notes;
}
