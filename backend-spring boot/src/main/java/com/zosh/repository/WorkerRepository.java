package com.zosh.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zosh.model.Worker;

public interface WorkerRepository extends JpaRepository<Worker, Long> {

    List<Worker> findByRestaurantId(Long restaurantId);

    Worker findByEmail(String email);

    Worker findByEmailAndPassword(String email, String password);
}