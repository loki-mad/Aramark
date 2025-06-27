package com.zosh.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.zosh.model.Shift;

public interface ShiftRepository extends JpaRepository<Shift, Long> {

    List<Shift> findByRestaurantId(Long restaurantId);

    List<Shift> findByWorkerId(Long workerId);

    @Query("SELECT s FROM Shift s WHERE s.worker.id = :workerId AND s.startTime >= :startTime AND s.endTime <= :endTime")
    List<Shift> findByWorkerIdAndDateRange(
            @Param("workerId") Long workerId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    @Query("SELECT s FROM Shift s WHERE s.restaurant.id = :restaurantId AND s.startTime >= :startTime AND s.endTime <= :endTime")
    List<Shift> findByRestaurantIdAndDateRange(
            @Param("restaurantId") Long restaurantId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
}