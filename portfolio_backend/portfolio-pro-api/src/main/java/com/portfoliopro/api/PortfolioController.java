package com.portfoliopro.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "http://localhost:5173")
public class PortfolioController {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @GetMapping
    public List<Portfolio> getPortfolio() {
        return portfolioRepository.findAll();
    }
}