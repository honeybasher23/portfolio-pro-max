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
import java.util.ArrayList;
import java.util.List;
import java.util.Collections;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
public class MarketDataService {
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public BigDecimal getLivePrice(String symbol) {
        try {
            String formattedSymbol = symbol.endsWith(".NS") ? symbol : symbol + ".NS";
            String url = "https://query1.finance.yahoo.com/v8/finance/chart/" + formattedSymbol + "?interval=1m&range=1d";
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            headers.set("Accept", "application/json");
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            
            JsonNode root = objectMapper.readTree(response.getBody());
            double price = root.path("chart").path("result").get(0).path("meta").path("regularMarketPrice").asDouble();
            
            return BigDecimal.valueOf(price);
        } catch (Exception e) {
            // Fails silently if the user is still typing an incomplete symbol (e.g., "ZOM")
            return null; 
        }
    }

    public List<ChartCandle> getChartData(String symbol) {
        try {
            String formattedSymbol = symbol.endsWith(".NS") ? symbol : symbol + ".NS";
            String url = "https://query1.finance.yahoo.com/v8/finance/chart/" + formattedSymbol + "?interval=1d&range=1mo";
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            
            JsonNode result = objectMapper.readTree(response.getBody()).path("chart").path("result").get(0);
            JsonNode timestamps = result.path("timestamp");
            JsonNode quote = result.path("indicators").path("quote").get(0);
            
            JsonNode openArr = quote.path("open");
            JsonNode highArr = quote.path("high");
            JsonNode lowArr = quote.path("low");
            JsonNode closeArr = quote.path("close");
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd").withZone(ZoneId.of("Asia/Kolkata"));
            List<ChartCandle> candles = new ArrayList<>();
            
            for (int i = 0; i < timestamps.size(); i++) {
                if (!closeArr.get(i).isNull()) {
                    String dateStr = formatter.format(Instant.ofEpochSecond(timestamps.get(i).asLong()));
                    candles.add(new ChartCandle(
                        dateStr,
                        BigDecimal.valueOf(openArr.get(i).asDouble()),
                        BigDecimal.valueOf(highArr.get(i).asDouble()),
                        BigDecimal.valueOf(lowArr.get(i).asDouble()),
                        BigDecimal.valueOf(closeArr.get(i).asDouble())
                    ));
                }
            }
            return candles;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}