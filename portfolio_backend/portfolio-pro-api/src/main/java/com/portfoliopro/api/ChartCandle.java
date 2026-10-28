package com.portfoliopro.api;

import java.math.BigDecimal;

// A Java 17 Record is a fast way to create a class with getters automatically built-in
public record ChartCandle(String time, BigDecimal open, BigDecimal high, BigDecimal low, BigDecimal close) {}