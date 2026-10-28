package com.portfoliopro.api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TradeHistoryRepository extends JpaRepository<TradeHistory, Long> {
    // Custom method to fetch trades sorted from newest to oldest
    List<TradeHistory> findAllByOrderByTimestampDesc();
}