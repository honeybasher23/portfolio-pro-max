package com.portfoliopro.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/market")
@CrossOrigin(origins = "http://localhost:5173")
public class MarketDataController {

    @Autowired
    private MarketDataService marketDataService;

    @GetMapping("/price/{symbol}")
    public ResponseEntity<BigDecimal> getLivePrice(@PathVariable String symbol) {
        BigDecimal price = marketDataService.getLivePrice(symbol);
        
        if (price != null) {
            return ResponseEntity.ok(price);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}