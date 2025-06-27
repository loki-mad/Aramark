package com.zosh.service;

import java.time.LocalDateTime;
import java.util.List;

import com.zosh.Exception.RestaurantException;
import com.zosh.Exception.ShiftException;
import com.zosh.Exception.WorkerException;
import com.zosh.model.Shift;
import com.zosh.request.CreateShiftRequest;

public interface ShiftService {

        public Shift createShift(CreateShiftRequest req) throws WorkerException, RestaurantException;

        public Shift updateShift(Long shiftId, CreateShiftRequest req)
                        throws ShiftException, WorkerException, RestaurantException;

        public Shift findShiftById(Long shiftId) throws ShiftException;

        public List<Shift> findShiftsByRestaurantId(Long restaurantId);

        public List<Shift> findShiftsByWorkerId(Long workerId);

        public List<Shift> findShiftsByWorkerIdAndDateRange(Long workerId, LocalDateTime startTime,
                        LocalDateTime endTime);

        public List<Shift> findShiftsByRestaurantIdAndDateRange(Long restaurantId, LocalDateTime startTime,
                        LocalDateTime endTime);

        public void deleteShift(Long shiftId) throws ShiftException;

        // New methods for shift status management
        public Shift checkInShift(Long shiftId, Long workerId) throws ShiftException, WorkerException;

        public Shift checkOutShift(Long shiftId, Long workerId) throws ShiftException, WorkerException;

        public Shift cancelShift(Long shiftId) throws ShiftException;

        public Shift updateShiftStatus(Long shiftId, String status) throws ShiftException;
}