package com.portfoliopro.api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    
    // Custom method to find a holding by its ticker symbol
    Optional<Portfolio> findBySymbol(String symbol);
}