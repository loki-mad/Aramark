package com.zosh.service;

import java.util.List;

import com.zosh.Exception.RestaurantException;
import com.zosh.Exception.WorkerException;
import com.zosh.model.Worker;
import com.zosh.request.CreateWorkerRequest;
import com.zosh.request.WorkerLoginRequest;
import com.zosh.response.WorkerAuthResponse;

public interface WorkerService {

    public Worker createWorker(CreateWorkerRequest req) throws RestaurantException;

    public Worker updateWorker(Long workerId, CreateWorkerRequest req) throws WorkerException, RestaurantException;

    public Worker findWorkerById(Long workerId) throws WorkerException;

    public List<Worker> findWorkersByRestaurantId(Long restaurantId);

    public void deleteWorker(Long workerId) throws WorkerException;

    public WorkerAuthResponse workerLogin(WorkerLoginRequest req) throws WorkerException;

    public Worker toggleWorkerActiveStatus(Long workerId) throws WorkerException;
}