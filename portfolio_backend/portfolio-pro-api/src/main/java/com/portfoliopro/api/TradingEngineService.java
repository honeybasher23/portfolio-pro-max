package com.portfoliopro.api;

import com.portfoliopro.engine.EngineOrder;
import com.portfoliopro.engine.OrderBook;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TradingEngineService {

    @Autowired
    private OrderRepository orderRepository;

    public void submitOrder(OrderRequest request) {
        // Convert the incoming React DTO into a Database Entity
        Order newOrder = new Order(
            request.getSymbol(),
            request.getIsBuy(),
            request.getPrice(),
            request.getQuantity()
        );
        
        // Save to Supabase PostgreSQL
        orderRepository.save(newOrder);
        
        System.out.println("Order saved to database: " + request.getSymbol());
    }
}