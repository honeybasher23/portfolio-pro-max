package com.portfoliopro.api;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.math.BigDecimal;

@Service
public class TradingEngineService {

    @Autowired
    private OrderRepository orderRepository;

    public void submitOrder(OrderRequest request) {
        String symbol = request.getSymbol();
        boolean isBuy = request.getIsBuy();
        BigDecimal price = request.getPrice();
        int remainingQuantity = request.getQuantity();

        // 1. Fetch the opposite side of the order book
        List<Order> oppositeOrders;
        if (isBuy) {
            // If buying, fetch sells (isBuy = false) sorted cheapest first
            oppositeOrders = orderRepository.findBySymbolAndIsBuyOrderByPriceAsc(symbol, false);
        } else {
            // If selling, fetch buys (isBuy = true) sorted highest first
            oppositeOrders = orderRepository.findBySymbolAndIsBuyOrderByPriceDesc(symbol, true);
        }

        // 2. The Execution Loop
        for (Order restingOrder : oppositeOrders) {
            if (remainingQuantity <= 0) break; // Order is fully filled

            // Check if prices cross
            boolean pricesCross = isBuy 
                ? price.compareTo(restingOrder.getPrice()) >= 0  // Buy price >= Sell price
                : price.compareTo(restingOrder.getPrice()) <= 0; // Sell price <= Buy price

            if (pricesCross) {
                // Calculate how many shares can actually trade
                int tradeQuantity = Math.min(remainingQuantity, restingOrder.getQuantity());
                
                System.out.println("✅ TRADE EXECUTED: " + tradeQuantity + " shares of " + symbol + " at ₹" + restingOrder.getPrice());

                // Deduct the traded shares
                remainingQuantity -= tradeQuantity;
                restingOrder.setQuantity(restingOrder.getQuantity() - tradeQuantity);

                // If the resting order is empty, delete it. Otherwise, save the partial fill.
                if (restingOrder.getQuantity() == 0) {
                    orderRepository.delete(restingOrder);
                } else {
                    orderRepository.save(restingOrder);
                }
            }
        }

        // 3. Save any leftover unfilled quantity back to the book
        if (remainingQuantity > 0) {
            Order newOrder = new Order(symbol, isBuy, price, remainingQuantity);
            orderRepository.save(newOrder);
            System.out.println("📝 Order added to book: " + remainingQuantity + " shares at ₹" + price);
        }
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}