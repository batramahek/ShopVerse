package com.example.ecommerce.order;

import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    private OrderStatus status;
}
