package com.portfoliopro.api;

import java.math.BigDecimal;

public class OrderRequest {
    private String symbol;
    private boolean isBuy;
    private BigDecimal price;
    private int quantity;

    // Getters and Setters
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }
    public boolean getIsBuy() { return isBuy; }
    public void setIsBuy(boolean isBuy) { this.isBuy = isBuy; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}