package com.portfoliopro.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private TradingEngineService tradingEngineService;

    @PostMapping
    public ResponseEntity<String> placeOrder(@RequestBody OrderRequest orderRequest) {
        tradingEngineService.submitOrder(orderRequest);
        return ResponseEntity.ok("Order placed successfully");
    }

    // New GET endpoint inside the class brackets
    @GetMapping
    public ResponseEntity<List<Order>> getOrderBook() {
        return ResponseEntity.ok(tradingEngineService.getAllOrders());
    }
}