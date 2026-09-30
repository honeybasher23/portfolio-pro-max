package com.portfoliopro.engine;

import java.util.PriorityQueue;
import java.util.Comparator;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class OrderBook {
    private final String symbol;
    private final PriorityQueue<EngineOrder> bids; // Max-Heap
    private final PriorityQueue<EngineOrder> asks; // Min-Heap

    public OrderBook(String symbol) {
        this.symbol = symbol;

        // Bid Comparator: Highest price first. If prices equal, oldest timestamp first.
        Comparator<EngineOrder> bidComparator = (o1, o2) -> {
            int priceCmp = o2.getPrice().compareTo(o1.getPrice());
            if (priceCmp == 0) {
                return Long.compare(o1.getTimestamp(), o2.getTimestamp());
            }
            return priceCmp;
        };

        // Ask Comparator: Lowest price first. If prices equal, oldest timestamp first.
        Comparator<EngineOrder> askComparator = (o1, o2) -> {
            int priceCmp = o1.getPrice().compareTo(o2.getPrice());
            if (priceCmp == 0) {
                return Long.compare(o1.getTimestamp(), o2.getTimestamp());
            }
            return priceCmp;
        };

        this.bids = new PriorityQueue<>(bidComparator);
        this.asks = new PriorityQueue<>(askComparator);
    }

    // Add a new order to the book and immediately attempt to match it
    public synchronized void processOrder(EngineOrder newOrder) {
        if (newOrder.isBuy()) {
            bids.add(newOrder);
        } else {
            asks.add(newOrder);
        }
        matchOrders();
    }

    // The core execution algorithm
    private void matchOrders() {
        while (!bids.isEmpty() && !asks.isEmpty()) {
            EngineOrder bestBid = bids.peek();
            EngineOrder bestAsk = asks.peek();

            // If the highest buyer won't pay the lowest seller's price, no trade happens
            if (bestBid.getPrice().compareTo(bestAsk.getPrice()) < 0) {
                break; 
            }

            // A match is found! Determine how many shares can be traded
            int tradeQuantity = Math.min(bestBid.getQuantity(), bestAsk.getQuantity());
            BigDecimal tradePrice = bestBid.getTimestamp() < bestAsk.getTimestamp() 
                                    ? bestBid.getPrice() : bestAsk.getPrice();

            System.out.println("TRADE EXECUTED: " + tradeQuantity + " shares of " + symbol + " @ ₹" + tradePrice);

            // Deduct the traded quantities
            bestBid.decreaseQuantity(tradeQuantity);
            bestAsk.decreaseQuantity(tradeQuantity);

            // Remove fully filled orders from the Priority Queues (O(log n))
            if (bestBid.getQuantity() == 0) {
                bids.poll();
            }
            if (bestAsk.getQuantity() == 0) {
                asks.poll();
            }
            
            // In a real system, you would generate a TradeEvent here and publish it 
            // via Kafka or Spring ApplicationEvents to update the Postgres database.
        }
    }
}