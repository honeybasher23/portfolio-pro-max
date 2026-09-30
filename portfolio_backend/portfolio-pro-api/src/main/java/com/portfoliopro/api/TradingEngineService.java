package com.portfoliopro.api;

import com.portfoliopro.engine.EngineOrder;
import com.portfoliopro.engine.OrderBook;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TradingEngineService {
    
    // Maps a stock symbol (e.g., "RELIANCE.NS") to its specific OrderBook
    private final ConcurrentHashMap<String, OrderBook> orderBooks = new ConcurrentHashMap<>();

    public void submitOrder(OrderRequest request) {
        // Get the order book for this symbol, or create it if it doesn't exist yet
        OrderBook book = orderBooks.computeIfAbsent(request.getSymbol(), symbol -> new OrderBook(symbol));

        // Generate server-side metadata
        String generatedOrderId = UUID.randomUUID().toString();
        long currentTimestamp = System.currentTimeMillis();

        // Map the HTTP DTO to our internal Engine object
        EngineOrder newOrder = new EngineOrder(
                generatedOrderId,
                request.getIsBuy(),
                request.getPrice(),
                request.getQuantity(),
                currentTimestamp
        );

        // Pass it into the matching engine
        book.processOrder(newOrder);
    }
}