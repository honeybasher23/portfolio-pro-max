package com.portfoliopro.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/trades")
@CrossOrigin(origins = "http://localhost:5173")
public class TradeHistoryController {

    @Autowired
    private TradeHistoryRepository tradeHistoryRepository;

    @GetMapping
    public List<TradeHistory> getTradeHistory() {
        return tradeHistoryRepository.findAllByOrderByTimestampDesc();
    }
}