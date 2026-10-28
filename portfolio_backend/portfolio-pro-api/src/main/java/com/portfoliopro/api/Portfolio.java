package com.portfoliopro.api;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "portfolio")
public class Portfolio {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String symbol;
    private int totalShares;
    private BigDecimal averagePrice;

    public Portfolio() {}

    public Portfolio(String symbol, int totalShares, BigDecimal averagePrice) {
        this.symbol = symbol;
        this.totalShares = totalShares;
        this.averagePrice = averagePrice;
    }

    // Getters
    public Long getId() { return id; }
    public String getSymbol() { return symbol; }
    public int getTotalShares() { return totalShares; }
    public BigDecimal getAveragePrice() { return averagePrice; }

    // Setters
    public void setTotalShares(int totalShares) { this.totalShares = totalShares; }
    public void setAveragePrice(BigDecimal averagePrice) { this.averagePrice = averagePrice; }
} 