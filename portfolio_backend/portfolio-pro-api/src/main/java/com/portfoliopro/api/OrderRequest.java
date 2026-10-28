package com.portfoliopro.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public class OrderRequest {
    private String symbol;
    
    @JsonProperty("isBuy")
    private boolean isBuy;
    
    private BigDecimal price;
    private int quantity;
    
    // NEW: Default to LIMIT if not provided
    private String type = "LIMIT"; 

    public String getSymbol() { return symbol; }
    public boolean getIsBuy() { return isBuy; }
    public BigDecimal getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public String getType() { return type; } 
}