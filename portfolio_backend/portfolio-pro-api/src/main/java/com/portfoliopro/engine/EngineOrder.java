package com.portfoliopro.engine;

import java.math.BigDecimal;

public class EngineOrder {
    private final String orderId;
    private final boolean isBuy;
    private final BigDecimal price;
    private int quantity;
    private final long timestamp; // Used for Price-Time priority

    public EngineOrder(String orderId, boolean isBuy, BigDecimal price, int quantity, long timestamp) {
        this.orderId = orderId;
        this.isBuy = isBuy;
        this.price = price;
        this.quantity = quantity;
        this.timestamp = timestamp;
    }

    // Standard Getters
    public String getOrderId() { return orderId; }
    public boolean isBuy() { return isBuy; }
    public BigDecimal getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public long getTimestamp() { return timestamp; }

    // Mutator for partial fills
    public void decreaseQuantity(int amount) {
        this.quantity -= amount;
    }
}