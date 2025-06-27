package com.zosh.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.Exception.RestaurantException;
import com.zosh.Exception.WorkerException;
import com.zosh.model.Worker;
import com.zosh.request.CreateWorkerRequest;
import com.zosh.request.WorkerLoginRequest;
import com.zosh.response.ApiResponse;
import com.zosh.response.WorkerAuthResponse;
import com.zosh.response.WorkerResponse;
import com.zosh.service.WorkerService;

@RestController
@RequestMapping("/api/workers")
public class WorkerController {

    @Autowired
    private WorkerService workerService;

    @PostMapping("/create")
    public ResponseEntity<WorkerResponse> createWorkerHandler(@RequestBody CreateWorkerRequest req)
            throws RestaurantException {

        Worker worker = workerService.createWorker(req);
        WorkerResponse response = workerToWorkerResponse(worker);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{workerId}")
    public ResponseEntity<WorkerResponse> updateWorkerHandler(
            @PathVariable Long workerId,
            @RequestBody CreateWorkerRequest req)
            throws WorkerException, RestaurantException {

        Worker worker = workerService.updateWorker(workerId, req);
        WorkerResponse response = workerToWorkerResponse(worker);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{workerId}")
    public ResponseEntity<WorkerResponse> getWorkerByIdHandler(@PathVariable Long workerId)
            throws WorkerException {

        Worker worker = workerService.findWorkerById(workerId);
        WorkerResponse response = workerToWorkerResponse(worker);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<WorkerResponse>> getWorkersByRestaurantIdHandler(
            @PathVariable Long restaurantId) {

        List<Worker> workers = workerService.findWorkersByRestaurantId(restaurantId);
        List<WorkerResponse> responses = workers.stream()
                .map(this::workerToWorkerResponse)
                .collect(Collectors.toList());
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @DeleteMapping("/{workerId}")
    public ResponseEntity<ApiResponse> deleteWorkerHandler(@PathVariable Long workerId)
            throws WorkerException {

        workerService.deleteWorker(workerId);
        ApiResponse res = new ApiResponse();
        res.setMessage("Worker deleted successfully");
        res.setStatus(true);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<WorkerAuthResponse> workerLoginHandler(
            @RequestBody WorkerLoginRequest req)
            throws WorkerException {

        WorkerAuthResponse res = workerService.workerLogin(req);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PutMapping("/toggle-status/{workerId}")
    public ResponseEntity<WorkerResponse> toggleWorkerStatusHandler(@PathVariable Long workerId)
            throws WorkerException {

        Worker worker = workerService.toggleWorkerActiveStatus(workerId);
        WorkerResponse response = workerToWorkerResponse(worker);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Helper method to convert Worker entity to WorkerResponse
    private WorkerResponse workerToWorkerResponse(Worker worker) {
        WorkerResponse response = new WorkerResponse();
        response.setId(worker.getId());
        response.setName(worker.getName());
        response.setEmail(worker.getEmail());
        response.setPhone(worker.getPhone());
        response.setRole(worker.getRole());
        response.setRestaurantId(worker.getRestaurant().getId());
        response.setRestaurantName(worker.getRestaurant().getName());
        response.setActive(worker.isActive());
        return response;
    }
}