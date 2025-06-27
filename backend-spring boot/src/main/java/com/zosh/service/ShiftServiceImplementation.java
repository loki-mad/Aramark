package com.zosh.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zosh.Exception.RestaurantException;
import com.zosh.Exception.ShiftException;
import com.zosh.Exception.WorkerException;
import com.zosh.model.Restaurant;
import com.zosh.model.Shift;
import com.zosh.model.Worker;
import com.zosh.repository.RestaurantRepository;
import com.zosh.repository.ShiftRepository;
import com.zosh.repository.WorkerRepository;
import com.zosh.request.CreateShiftRequest;

@Service
public class ShiftServiceImplementation implements ShiftService {

    @Autowired
    private ShiftRepository shiftRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Override
    public Shift createShift(CreateShiftRequest req) throws WorkerException, RestaurantException {
        Optional<Worker> workerOpt = workerRepository.findById(req.getWorkerId());
        if (!workerOpt.isPresent()) {
            throw new WorkerException("Worker not found with id: " + req.getWorkerId());
        }

        Optional<Restaurant> restaurantOpt = restaurantRepository.findById(req.getRestaurantId());
        if (!restaurantOpt.isPresent()) {
            throw new RestaurantException("Restaurant not found with id: " + req.getRestaurantId());
        }

        Worker worker = workerOpt.get();
        Restaurant restaurant = restaurantOpt.get();

        // Verify that the worker belongs to this restaurant
        if (!worker.getRestaurant().getId().equals(restaurant.getId())) {
            throw new WorkerException("Worker does not belong to the specified restaurant");
        }

        Shift shift = new Shift();
        shift.setStartTime(req.getStartTime());
        shift.setEndTime(req.getEndTime());
        shift.setWorker(worker);
        shift.setRestaurant(restaurant);
        shift.setNotes(req.getNotes());
        shift.setShiftType(req.getShiftType());
        shift.setPriority(req.getPriority());
        shift.setLocation(req.getLocation());

        // Set default status if not provided
        shift.setStatus(req.getStatus() != null ? req.getStatus() : "SCHEDULED");
        shift.setCheckedInTime(req.getCheckedInTime());
        shift.setCheckedOutTime(req.getCheckedOutTime());

        return shiftRepository.save(shift);
    }

    @Override
    public Shift updateShift(Long shiftId, CreateShiftRequest req)
            throws ShiftException, WorkerException, RestaurantException {

        Shift shift = findShiftById(shiftId);

        if (req.getWorkerId() != null) {
            Optional<Worker> workerOpt = workerRepository.findById(req.getWorkerId());
            if (!workerOpt.isPresent()) {
                throw new WorkerException("Worker not found with id: " + req.getWorkerId());
            }
            shift.setWorker(workerOpt.get());
        }

        if (req.getRestaurantId() != null) {
            Optional<Restaurant> restaurantOpt = restaurantRepository.findById(req.getRestaurantId());
            if (!restaurantOpt.isPresent()) {
                throw new RestaurantException("Restaurant not found with id: " + req.getRestaurantId());
            }
            shift.setRestaurant(restaurantOpt.get());
        }

        if (req.getStartTime() != null) {
            shift.setStartTime(req.getStartTime());
        }

        if (req.getEndTime() != null) {
            shift.setEndTime(req.getEndTime());
        }

        if (req.getNotes() != null) {
            shift.setNotes(req.getNotes());
        }

        if (req.getShiftType() != null) {
            shift.setShiftType(req.getShiftType());
        }

        if (req.getPriority() != null) {
            shift.setPriority(req.getPriority());
        }

        if (req.getLocation() != null) {
            shift.setLocation(req.getLocation());
        }

        if (req.getStatus() != null) {
            shift.setStatus(req.getStatus());
        }

        if (req.getCheckedInTime() != null) {
            shift.setCheckedInTime(req.getCheckedInTime());
        }

        if (req.getCheckedOutTime() != null) {
            shift.setCheckedOutTime(req.getCheckedOutTime());
        }

        return shiftRepository.save(shift);
    }

    @Override
    public Shift findShiftById(Long shiftId) throws ShiftException {
        Optional<Shift> shiftOpt = shiftRepository.findById(shiftId);
        if (!shiftOpt.isPresent()) {
            throw new ShiftException("Shift not found with id: " + shiftId);
        }
        return shiftOpt.get();
    }

    @Override
    public List<Shift> findShiftsByRestaurantId(Long restaurantId) {
        return shiftRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public List<Shift> findShiftsByWorkerId(Long workerId) {
        return shiftRepository.findByWorkerId(workerId);
    }

    @Override
    public List<Shift> findShiftsByWorkerIdAndDateRange(Long workerId, LocalDateTime startTime, LocalDateTime endTime) {
        return shiftRepository.findByWorkerIdAndDateRange(workerId, startTime, endTime);
    }

    @Override
    public List<Shift> findShiftsByRestaurantIdAndDateRange(Long restaurantId, LocalDateTime startTime,
            LocalDateTime endTime) {
        return shiftRepository.findByRestaurantIdAndDateRange(restaurantId, startTime, endTime);
    }

    @Override
    public void deleteShift(Long shiftId) throws ShiftException {
        Shift shift = findShiftById(shiftId);
        shiftRepository.delete(shift);
    }

    @Override
    public Shift checkInShift(Long shiftId, Long workerId) throws ShiftException, WorkerException {
        Shift shift = findShiftById(shiftId);

        // Verify worker is assigned to this shift
        if (!shift.getWorker().getId().equals(workerId)) {
            throw new WorkerException("Worker is not assigned to this shift");
        }

        // Check if the shift is in a valid state for check-in
        if (!"SCHEDULED".equals(shift.getStatus())) {
            throw new ShiftException("Cannot check in: shift is not in SCHEDULED status");
        }

        // Update shift status
        shift.setStatus("CHECKED_IN");
        shift.setCheckedInTime(LocalDateTime.now());

        return shiftRepository.save(shift);
    }

    @Override
    public Shift checkOutShift(Long shiftId, Long workerId) throws ShiftException, WorkerException {
        Shift shift = findShiftById(shiftId);

        // Verify worker is assigned to this shift
        if (!shift.getWorker().getId().equals(workerId)) {
            throw new WorkerException("Worker is not assigned to this shift");
        }

        // Check if the shift is in a valid state for check-out
        if (!"CHECKED_IN".equals(shift.getStatus())) {
            throw new ShiftException("Cannot check out: shift is not in CHECKED_IN status");
        }

        // Update shift status
        shift.setStatus("COMPLETED");
        shift.setCheckedOutTime(LocalDateTime.now());

        return shiftRepository.save(shift);
    }

    @Override
    public Shift cancelShift(Long shiftId) throws ShiftException {
        Shift shift = findShiftById(shiftId);

        // Check if the shift is in a valid state for cancellation
        if ("COMPLETED".equals(shift.getStatus())) {
            throw new ShiftException("Cannot cancel: shift is already completed");
        }

        // Update shift status
        shift.setStatus("CANCELED");

        return shiftRepository.save(shift);
    }

    @Override
    public Shift updateShiftStatus(Long shiftId, String status) throws ShiftException {
        Shift shift = findShiftById(shiftId);

        // Validate status
        if (!isValidStatus(status)) {
            throw new ShiftException("Invalid shift status: " + status);
        }

        // Update shift status
        shift.setStatus(status);

        // Set timestamp if checking in or out
        if ("CHECKED_IN".equals(status)) {
            shift.setCheckedInTime(LocalDateTime.now());
        } else if ("COMPLETED".equals(status)) {
            shift.setCheckedOutTime(LocalDateTime.now());
        }

        return shiftRepository.save(shift);
    }

    // Helper method to validate status
    private boolean isValidStatus(String status) {
        return "SCHEDULED".equals(status) ||
                "CHECKED_IN".equals(status) ||
                "COMPLETED".equals(status) ||
                "CANCELED".equals(status);
    }
}