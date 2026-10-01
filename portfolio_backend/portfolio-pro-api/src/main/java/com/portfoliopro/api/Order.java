package com.portfoliopro.api;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String symbol;
    private boolean isBuy;
    private BigDecimal price;
    private int quantity;
    private LocalDateTime timestamp = LocalDateTime.now();

    // Default Constructor required by JPA
    public Order() {}

    public Order(String symbol, boolean isBuy, BigDecimal price, int quantity) {
        this.symbol = symbol;
        this.isBuy = isBuy;
        this.price = price;
        this.quantity = quantity;
    }

    // Getters
    public Long getId() { return id; }
    public String getSymbol() { return symbol; }
    public boolean getIsBuy() { return isBuy; }
    public BigDecimal getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public LocalDateTime getTimestamp() { return timestamp; }
}