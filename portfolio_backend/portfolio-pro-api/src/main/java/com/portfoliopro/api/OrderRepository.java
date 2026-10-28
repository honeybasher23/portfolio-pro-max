package com.portfoliopro.api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Find Sells (Asks) ordered by lowest price first
    List<Order> findBySymbolAndIsBuyOrderByPriceAsc(String symbol, boolean isBuy);
    
    // Find Buys (Bids) ordered by highest price first
    List<Order> findBySymbolAndIsBuyOrderByPriceDesc(String symbol, boolean isBuy);
}