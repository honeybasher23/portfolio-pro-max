package com.portfoliopro.api;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;

@Service
public class MarketDataService {
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public BigDecimal getLivePrice(String symbol) {
        try {
            String formattedSymbol = symbol.endsWith(".NS") ? symbol : symbol + ".NS";
            String url = "https://query1.finance.yahoo.com/v8/finance/chart/" + formattedSymbol + "?interval=1m&range=1d";
            
            // 1. Create headers to mimic a real web browser (Google Chrome)
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            headers.set("Accept", "application/json");
            
            // 2. Wrap the headers in an HttpEntity
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            // 3. Use exchange() instead of getForObject() to pass the custom headers
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            
            // 4. Parse the JSON response body
            JsonNode root = objectMapper.readTree(response.getBody());
            double price = root.path("chart").path("result").get(0).path("meta").path("regularMarketPrice").asDouble();
            
            return BigDecimal.valueOf(price);
        } catch (Exception e) {
            System.err.println("Failed to fetch live price for " + symbol + ": " + e.getMessage());
            return null; 
        }
    }
}