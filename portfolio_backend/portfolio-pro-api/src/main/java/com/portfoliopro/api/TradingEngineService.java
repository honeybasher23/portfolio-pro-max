package com.portfoliopro.api;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class TradingEngineService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;
    
    // <-- NEW: Inject your Yahoo Finance scraper
    @Autowired
    private MarketDataService marketDataService; 

    public void submitOrder(OrderRequest request) {
        String symbol = request.getSymbol();
        boolean isBuy = request.getIsBuy();
        int remainingQuantity = request.getQuantity();
        String type = request.getType();

        // <-- NEW: THE MARKET ORDER EXPRESS LANE
        if ("MARKET".equalsIgnoreCase(type)) {
            BigDecimal livePrice = marketDataService.getLivePrice(symbol);
            if (livePrice == null) {
                throw new RuntimeException("Cannot execute Market Order: Live price unavailable.");
            }
            
            System.out.println("⚡ MARKET ORDER EXECUTED: " + remainingQuantity + " shares of " + symbol + " at live price ₹" + livePrice);
            updatePortfolio(symbol, isBuy, remainingQuantity, livePrice);
            
            return; // Exit function so it doesn't touch the limit order book!
        }

        // --- EXISTING LIMIT ORDER LOGIC BELOW ---
        BigDecimal price = request.getPrice();
        List<Order> oppositeOrders;
        if (isBuy) {
            oppositeOrders = orderRepository.findBySymbolAndIsBuyOrderByPriceAsc(symbol, false);
        } else {
            oppositeOrders = orderRepository.findBySymbolAndIsBuyOrderByPriceDesc(symbol, true);
        }

        for (Order restingOrder : oppositeOrders) {
            if (remainingQuantity <= 0) break;

            boolean pricesCross = isBuy 
                ? price.compareTo(restingOrder.getPrice()) >= 0  
                : price.compareTo(restingOrder.getPrice()) <= 0; 

            if (pricesCross) {
                int tradeQuantity = Math.min(remainingQuantity, restingOrder.getQuantity());
                BigDecimal executionPrice = restingOrder.getPrice();
                
                System.out.println("✅ LIMIT TRADE EXECUTED: " + tradeQuantity + " shares of " + symbol + " at ₹" + executionPrice);

                updatePortfolio(symbol, isBuy, tradeQuantity, executionPrice);

                remainingQuantity -= tradeQuantity;
                restingOrder.setQuantity(restingOrder.getQuantity() - tradeQuantity);

                if (restingOrder.getQuantity() == 0) {
                    orderRepository.delete(restingOrder);
                } else {
                    orderRepository.save(restingOrder);
                }
            }
        }

        if (remainingQuantity > 0) {
            Order newOrder = new Order(symbol, isBuy, price, remainingQuantity);
            orderRepository.save(newOrder);
            System.out.println("📝 Order added to book: " + remainingQuantity + " shares at ₹" + price);
        }
    }

    private void updatePortfolio(String symbol, boolean isBuy, int quantity, BigDecimal executionPrice) {
        Portfolio holding = portfolioRepository.findBySymbol(symbol)
                .orElse(new Portfolio(symbol, 0, BigDecimal.ZERO));

        if (isBuy) {
            BigDecimal currentTotalValue = holding.getAveragePrice().multiply(BigDecimal.valueOf(holding.getTotalShares()));
            BigDecimal newTradeValue = executionPrice.multiply(BigDecimal.valueOf(quantity));
            
            int newTotalShares = holding.getTotalShares() + quantity;
            BigDecimal newAveragePrice = currentTotalValue.add(newTradeValue)
                    .divide(BigDecimal.valueOf(newTotalShares), 2, RoundingMode.HALF_UP);

            holding.setTotalShares(newTotalShares);
            holding.setAveragePrice(newAveragePrice);
        } else {
            holding.setTotalShares(holding.getTotalShares() - quantity);
        }

        if (holding.getTotalShares() <= 0) {
            portfolioRepository.delete(holding);
        } else {
            portfolioRepository.save(holding);
        }
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}