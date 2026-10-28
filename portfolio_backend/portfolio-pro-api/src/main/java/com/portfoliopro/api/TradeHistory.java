package com.portfoliopro.api;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "trade_history")
public class TradeHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String symbol;
    private boolean isBuy;
    private int quantity;
    private BigDecimal executionPrice;
    private String orderType;
    private LocalDateTime timestamp;

    public TradeHistory() {}

    public TradeHistory(String symbol, boolean isBuy, int quantity, BigDecimal executionPrice, String orderType) {
        this.symbol = symbol;
        this.isBuy = isBuy;
        this.quantity = quantity;
        this.executionPrice = executionPrice;
        this.orderType = orderType;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getSymbol() { return symbol; }
    public boolean getIsBuy() { return isBuy; }
    public int getQuantity() { return quantity; }
    public BigDecimal getExecutionPrice() { return executionPrice; }
    public String getOrderType() { return orderType; }
    public LocalDateTime getTimestamp() { return timestamp; }
}