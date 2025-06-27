package com.zosh.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.Exception.RestaurantException;
import com.zosh.Exception.ShiftException;
import com.zosh.Exception.WorkerException;
import com.zosh.model.Shift;
import com.zosh.request.CreateShiftRequest;
import com.zosh.response.ApiResponse;
import com.zosh.response.ShiftResponse;
import com.zosh.response.WorkerResponse;
import com.zosh.service.ShiftService;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    @Autowired
    private ShiftService shiftService;

    @PostMapping("/create")
    public ResponseEntity<ShiftResponse> createShiftHandler(@RequestBody CreateShiftRequest req)
            throws WorkerException, RestaurantException {

        Shift shift = shiftService.createShift(req);
        ShiftResponse response = shiftToShiftResponse(shift);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{shiftId}")
    public ResponseEntity<ShiftResponse> updateShiftHandler(
            @PathVariable Long shiftId,
            @RequestBody CreateShiftRequest req)
            throws ShiftException, WorkerException, RestaurantException {

        Shift shift = shiftService.updateShift(shiftId, req);
        ShiftResponse response = shiftToShiftResponse(shift);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{shiftId}")
    public ResponseEntity<ShiftResponse> getShiftByIdHandler(@PathVariable Long shiftId)
            throws ShiftException {

        Shift shift = shiftService.findShiftById(shiftId);
        ShiftResponse response = shiftToShiftResponse(shift);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<ShiftResponse>> getShiftsByRestaurantIdHandler(
            @PathVariable Long restaurantId) {

        List<Shift> shifts = shiftService.findShiftsByRestaurantId(restaurantId);
        List<ShiftResponse> responses = shifts.stream()
                .map(this::shiftToShiftResponse)
                .collect(Collectors.toList());
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<ShiftResponse>> getShiftsByWorkerIdHandler(
            @PathVariable Long workerId) {

        List<Shift> shifts = shiftService.findShiftsByWorkerId(workerId);
        List<ShiftResponse> responses = shifts.stream()
                .map(this::shiftToShiftResponse)
                .collect(Collectors.toList());
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/worker/{workerId}/date-range")
    public ResponseEntity<List<ShiftResponse>> getShiftsByWorkerIdAndDateRangeHandler(
            @PathVariable Long workerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {

        List<Shift> shifts = shiftService.findShiftsByWorkerIdAndDateRange(workerId, startTime, endTime);
        List<ShiftResponse> responses = shifts.stream()
                .map(this::shiftToShiftResponse)
                .collect(Collectors.toList());
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/restaurant/{restaurantId}/date-range")
    public ResponseEntity<List<ShiftResponse>> getShiftsByRestaurantIdAndDateRangeHandler(
            @PathVariable Long restaurantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {

        List<Shift> shifts = shiftService.findShiftsByRestaurantIdAndDateRange(restaurantId, startTime, endTime);
        List<ShiftResponse> responses = shifts.stream()
                .map(this::shiftToShiftResponse)
                .collect(Collectors.toList());
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @DeleteMapping("/{shiftId}")
    public ResponseEntity<ApiResponse> deleteShiftHandler(@PathVariable Long shiftId)
            throws ShiftException {

        shiftService.deleteShift(shiftId);
        ApiResponse res = new ApiResponse();
        res.setMessage("Shift deleted successfully");
        res.setStatus(true);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // Shift status endpoints

    @PutMapping("/{shiftId}/check-in/{workerId}")
    public ResponseEntity<ShiftResponse> checkInShiftHandler(
            @PathVariable Long shiftId,
            @PathVariable Long workerId)
            throws ShiftException, WorkerException {

        Shift shift = shiftService.checkInShift(shiftId, workerId);
        ShiftResponse response = shiftToShiftResponse(shift);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{shiftId}/check-out/{workerId}")
    public ResponseEntity<ShiftResponse> checkOutShiftHandler(
            @PathVariable Long shiftId,
            @PathVariable Long workerId)
            throws ShiftException, WorkerException {

        Shift shift = shiftService.checkOutShift(shiftId, workerId);
        ShiftResponse response = shiftToShiftResponse(shift);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{shiftId}/cancel")
    public ResponseEntity<ShiftResponse> cancelShiftHandler(
            @PathVariable Long shiftId)
            throws ShiftException {

        Shift shift = shiftService.cancelShift(shiftId);
        ShiftResponse response = shiftToShiftResponse(shift);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{shiftId}/status")
    public ResponseEntity<ShiftResponse> updateShiftStatusHandler(
            @PathVariable Long shiftId,
            @RequestParam String status)
            throws ShiftException {

        Shift shift = shiftService.updateShiftStatus(shiftId, status);
        ShiftResponse response = shiftToShiftResponse(shift);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Helper method to convert Shift entity to ShiftResponse
    private ShiftResponse shiftToShiftResponse(Shift shift) {
        ShiftResponse response = new ShiftResponse();
        response.setId(shift.getId());
        response.setStartTime(shift.getStartTime());
        response.setEndTime(shift.getEndTime());

        // Convert Worker to WorkerResponse
        WorkerResponse workerResponse = new WorkerResponse();
        workerResponse.setId(shift.getWorker().getId());
        workerResponse.setName(shift.getWorker().getName());
        workerResponse.setEmail(shift.getWorker().getEmail());
        workerResponse.setPhone(shift.getWorker().getPhone());
        workerResponse.setRole(shift.getWorker().getRole());
        workerResponse.setActive(shift.getWorker().isActive());
        workerResponse.setRestaurantId(shift.getRestaurant().getId());
        workerResponse.setRestaurantName(shift.getRestaurant().getName());

        response.setWorker(workerResponse);
        response.setRestaurantId(shift.getRestaurant().getId());
        response.setRestaurantName(shift.getRestaurant().getName());
        response.setNotes(shift.getNotes());
        response.setShiftType(shift.getShiftType());
        response.setPriority(shift.getPriority());
        response.setLocation(shift.getLocation());
        response.setStatus(shift.getStatus());
        response.setCheckedInTime(shift.getCheckedInTime());
        response.setCheckedOutTime(shift.getCheckedOutTime());

        return response;
    }
}