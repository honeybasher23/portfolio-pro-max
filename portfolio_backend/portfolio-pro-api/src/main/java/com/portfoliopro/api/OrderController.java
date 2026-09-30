package com.portfoliopro.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173") // Allow Vite frontend
public class OrderController {

    private final TradingEngineService tradingEngineService;

    // Spring automatically injects the service via constructor
    public OrderController(TradingEngineService tradingEngineService) {
        this.tradingEngineService = tradingEngineService;
    }

    @PostMapping
    public ResponseEntity<String> placeOrder(@RequestBody OrderRequest orderRequest) {
        try {
            tradingEngineService.submitOrder(orderRequest);
            return ResponseEntity.ok("Order submitted successfully for " + orderRequest.getSymbol());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Order failed: " + e.getMessage());
        }
    }
}