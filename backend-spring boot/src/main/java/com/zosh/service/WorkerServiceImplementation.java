package com.zosh.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.zosh.Exception.RestaurantException;
import com.zosh.Exception.WorkerException;
import com.zosh.model.Restaurant;
import com.zosh.model.Worker;
import com.zosh.repository.RestaurantRepository;
import com.zosh.repository.WorkerRepository;
import com.zosh.request.CreateWorkerRequest;
import com.zosh.request.WorkerLoginRequest;
import com.zosh.response.WorkerAuthResponse;

@Service
public class WorkerServiceImplementation implements WorkerService {

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Worker createWorker(CreateWorkerRequest req) throws RestaurantException {
        Optional<Restaurant> restaurantOpt = restaurantRepository.findById(req.getRestaurantId());
        if (!restaurantOpt.isPresent()) {
            throw new RestaurantException("Restaurant not found with id: " + req.getRestaurantId());
        }

        Restaurant restaurant = restaurantOpt.get();

        Worker worker = new Worker();
        worker.setName(req.getName());
        worker.setEmail(req.getEmail());
        worker.setPassword(passwordEncoder.encode(req.getPassword()));
        worker.setPhone(req.getPhone());
        worker.setRole(req.getRole());
        worker.setRestaurant(restaurant);
        worker.setActive(req.isActive());

        return workerRepository.save(worker);
    }

    @Override
    public Worker updateWorker(Long workerId, CreateWorkerRequest req) throws WorkerException, RestaurantException {
        Worker worker = findWorkerById(workerId);

        if (req.getRestaurantId() != null) {
            Optional<Restaurant> restaurantOpt = restaurantRepository.findById(req.getRestaurantId());
            if (!restaurantOpt.isPresent()) {
                throw new RestaurantException("Restaurant not found with id: " + req.getRestaurantId());
            }
            worker.setRestaurant(restaurantOpt.get());
        }

        if (req.getName() != null) {
            worker.setName(req.getName());
        }

        if (req.getEmail() != null) {
            worker.setEmail(req.getEmail());
        }

        if (req.getPassword() != null) {
            worker.setPassword(passwordEncoder.encode(req.getPassword()));
        }

        if (req.getPhone() != null) {
            worker.setPhone(req.getPhone());
        }

        if (req.getRole() != null) {
            worker.setRole(req.getRole());
        }

        worker.setActive(req.isActive());

        return workerRepository.save(worker);
    }

    @Override
    public Worker findWorkerById(Long workerId) throws WorkerException {
        Optional<Worker> workerOpt = workerRepository.findById(workerId);
        if (!workerOpt.isPresent()) {
            throw new WorkerException("Worker not found with id: " + workerId);
        }
        return workerOpt.get();
    }

    @Override
    public List<Worker> findWorkersByRestaurantId(Long restaurantId) {
        return workerRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public void deleteWorker(Long workerId) throws WorkerException {
        Worker worker = findWorkerById(workerId);
        workerRepository.delete(worker);
    }

    @Override
    public WorkerAuthResponse workerLogin(WorkerLoginRequest req) throws WorkerException {
        Worker worker = workerRepository.findByEmail(req.getEmail());

        if (worker == null) {
            throw new WorkerException("Worker not found with email: " + req.getEmail());
        }

        if (!passwordEncoder.matches(req.getPassword(), worker.getPassword())) {
            throw new WorkerException("Invalid password");
        }

        if (!worker.isActive()) {
            throw new WorkerException("Worker account is not active");
        }

        WorkerAuthResponse response = new WorkerAuthResponse();
        response.setMessage("Login successful");
        response.setWorkerId(worker.getId());
        response.setName(worker.getName());
        response.setRole(worker.getRole());
        response.setRestaurantId(worker.getRestaurant().getId());
        response.setRestaurantName(worker.getRestaurant().getName());

        return response;
    }

    @Override
    public Worker toggleWorkerActiveStatus(Long workerId) throws WorkerException {
        Worker worker = findWorkerById(workerId);
        worker.setActive(!worker.isActive());
        return workerRepository.save(worker);
    }
}