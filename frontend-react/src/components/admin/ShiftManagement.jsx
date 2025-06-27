import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Snackbar,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Card,
  CardContent,
  TablePagination,
  Chip,
  Tooltip,
  Divider,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  getShiftsByRestaurant,
  createShift,
  updateShift,
  deleteShift,
  checkInShift,
  checkOutShift,
  cancelShift,
  updateShiftStatus,
} from "../../State/Shift/Action";
import { getWorkersByRestaurant } from "../../State/Worker/Action";

// Shift types
const SHIFT_TYPES = [
  "Regular",
  "Overtime",
  "Training",
  "Special Event",
  "On-Call",
];

const ShiftManagement = () => {
  const dispatch = useDispatch();

  const { workers } = useSelector((state) => state.worker);
  const { restaurantShifts, loading, error } = useSelector(
    (state) => state.shift
  );
  const { usersRestaurant } = useSelector((state) => state.restaurant);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("create"); // 'create' or 'edit'
  const [selectedShift, setSelectedShift] = useState(null);
  const [formData, setFormData] = useState({
    workerId: "",
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 4 * 60 * 60 * 1000), // 4 hours later
    notes: "",
    shiftType: "Regular",
    priority: "Medium",
    location: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // View states
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filter states
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [filterWorker, setFilterWorker] = useState("");
  const [filterShiftType, setFilterShiftType] = useState("");
  const [filterDateRange, setFilterDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  // Status update states
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  // Current date for calculations
  const currentDate = new Date();

  // Fetch shifts and workers data
  useEffect(() => {
    if (usersRestaurant?.id) {
      dispatch(getShiftsByRestaurant(usersRestaurant.id));
      dispatch(getWorkersByRestaurant(usersRestaurant.id));
    }
  }, [dispatch, usersRestaurant]);

  const handleOpenCreateDialog = () => {
    setDialogMode("create");
    setSelectedShift(null);
    setFormData({
      workerId: "",
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 4 * 60 * 60 * 1000), // 4 hours later
      notes: "",
      shiftType: "Regular",
      priority: "Medium",
      location: "",
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (shift) => {
    setDialogMode("edit");
    setSelectedShift(shift);
    setFormData({
      workerId: shift.worker.id,
      startTime: new Date(shift.startTime),
      endTime: new Date(shift.endTime),
      notes: shift.notes || "",
      shiftType: shift.shiftType || "Regular",
      priority: shift.priority || "Medium",
      location: shift.location || "",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateTimeChange = (name) => (newValue) => {
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.startTime >= formData.endTime) {
      setSnackbarSeverity("error");
      setSnackbarMessage("End time must be after start time");
      setOpenSnackbar(true);
      return;
    }

    try {
      if (dialogMode === "create") {
        await dispatch(
          createShift({
            ...formData,
            restaurantId: usersRestaurant.id,
          })
        );
        setSnackbarMessage("Shift created successfully");
      } else {
        await dispatch(
          updateShift(selectedShift.id, {
            ...formData,
            restaurantId: usersRestaurant.id,
          })
        );
        setSnackbarMessage("Shift updated successfully");
      }

      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setOpenDialog(false);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || "An error occurred");
      setOpenSnackbar(true);
    }
  };

  const handleDeleteShift = async (shiftId) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      try {
        await dispatch(deleteShift(shiftId));
        setSnackbarSeverity("success");
        setSnackbarMessage("Shift deleted successfully");
        setOpenSnackbar(true);
      } catch (error) {
        setSnackbarSeverity("error");
        setSnackbarMessage(error.message || "An error occurred");
        setOpenSnackbar(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenFilterDialog = () => {
    setOpenFilterDialog(true);
  };

  const handleCloseFilterDialog = () => {
    setOpenFilterDialog(false);
  };

  const handleResetFilters = () => {
    setFilterWorker("");
    setFilterShiftType("");
    setFilterDateRange({
      startDate: null,
      endDate: null,
    });
    setOpenFilterDialog(false);
  };

  const handleOpenStatusDialog = (shift) => {
    setSelectedShift(shift);
    setSelectedStatus(shift.status || "SCHEDULED");
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setSelectedStatus("");
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleUpdateStatus = async () => {
    try {
      await dispatch(updateShiftStatus(selectedShift.id, selectedStatus));
      setSnackbarSeverity("success");
      setSnackbarMessage("Shift status updated successfully");
      setOpenSnackbar(true);
      dispatch(getShiftsByRestaurant(usersRestaurant.id));
      handleCloseStatusDialog();
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || "Failed to update shift status");
      setOpenSnackbar(true);
    }
  };

  const handleQuickAction = async (shift, action) => {
    try {
      if (action === "checkIn") {
        await dispatch(checkInShift(shift.id, shift.worker.id));
        setSnackbarMessage("Shift checked in successfully");
      } else if (action === "checkOut") {
        await dispatch(checkOutShift(shift.id, shift.worker.id));
        setSnackbarMessage("Shift checked out successfully");
      } else if (action === "cancel") {
        await dispatch(cancelShift(shift.id));
        setSnackbarMessage("Shift canceled successfully");
      }
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      dispatch(getShiftsByRestaurant(usersRestaurant.id));
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || "Failed to perform action");
      setOpenSnackbar(true);
    }
  };

  const handleRefresh = () => {
    dispatch(getShiftsByRestaurant(usersRestaurant.id));
    setSnackbarSeverity("info");
    setSnackbarMessage("Shifts refreshed");
    setOpenSnackbar(true);
  };

  // Format date and time
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  // Format date only
  const formatDate = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString();
  };

  // Format time only
  const formatTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Get worker name by ID
  const getWorkerName = (workerId) => {
    const worker = workers.find((w) => w.id === workerId);
    return worker ? worker.name : "Unknown";
  };

  // Get worker object by ID
  const getWorker = (workerId) => {
    return workers.find((w) => w.id === workerId) || null;
  };

  // Calculate shift duration in hours
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    const durationHours = Math.round((durationMs / (1000 * 60 * 60)) * 10) / 10; // Round to 1 decimal
    return durationHours;
  };

  // Determine shift status based on current time
  const getShiftStatus = (startTime, endTime, status) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Use the backend status if available
    if (status) {
      switch (status) {
        case "CHECKED_IN":
          return {
            label: "Checked In",
            color: "success",
            canCheckIn: false,
            canCheckOut: now >= start && now <= end,
            canCancel: false,
          };
        case "COMPLETED":
          return {
            label: "Completed",
            color: "default",
            canCheckIn: false,
            canCheckOut: false,
            canCancel: false,
          };
        case "CANCELED":
          return {
            label: "Canceled",
            color: "error",
            canCheckIn: false,
            canCheckOut: false,
            canCancel: false,
          };
        case "SCHEDULED":
        default:
          // For SCHEDULED, continue to time-based logic below
          break;
      }
    }

    // Time-based logic for SCHEDULED shifts or when status is not provided
    if (now < start) {
      return {
        label: "Upcoming",
        color: "info",
        canCheckIn: false,
        canCheckOut: false,
        canCancel: true,
      };
    } else if (now > end) {
      return {
        label: "Past",
        color: "default",
        canCheckIn: false,
        canCheckOut: false,
        canCancel: false,
      };
    } else {
      return {
        label: "Active",
        color: "primary",
        canCheckIn: true,
        canCheckOut: false,
        canCancel: false,
      };
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
        return "info";
      default:
        return "default";
    }
  };

  // Filter and categorize shifts
  const filterShifts = (shifts) => {
    // Apply filters
    let filtered = [...shifts];

    if (filterWorker) {
      filtered = filtered.filter(
        (shift) => shift.worker.id.toString() === filterWorker
      );
    }

    if (filterShiftType) {
      filtered = filtered.filter(
        (shift) => shift.shiftType === filterShiftType
      );
    }

    if (filterDateRange.startDate) {
      const startDate = new Date(filterDateRange.startDate);
      startDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(
        (shift) => new Date(shift.startTime) >= startDate
      );
    }

    if (filterDateRange.endDate) {
      const endDate = new Date(filterDateRange.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (shift) => new Date(shift.startTime) <= endDate
      );
    }

    return filtered;
  };

  // Categorize shifts based on tab selection
  const categorizeShifts = (shifts) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    switch (tabValue) {
      case 0: // All
        return shifts;
      case 1: // Today
        return shifts.filter((shift) => {
          const shiftDate = new Date(shift.startTime);
          shiftDate.setHours(0, 0, 0, 0);
          return shiftDate.getTime() === today.getTime();
        });
      case 2: // This Week
        return shifts.filter((shift) => {
          const shiftDate = new Date(shift.startTime);
          return shiftDate >= today && shiftDate < nextWeek;
        });
      case 3: // This Month
        return shifts.filter((shift) => {
          const shiftDate = new Date(shift.startTime);
          return shiftDate >= today && shiftDate < nextMonth;
        });
      default:
        return shifts;
    }
  };

  const filteredShifts = filterShifts(restaurantShifts);
  const categorizedShifts = categorizeShifts(filteredShifts);

  // Get active workers for shift assignment
  const activeWorkers = workers.filter((worker) => worker.active);

  // Calculate statistics
  const totalShifts = restaurantShifts.length;
  const currentShifts = restaurantShifts.filter((shift) => {
    const now = new Date();
    return new Date(shift.startTime) <= now && new Date(shift.endTime) >= now;
  }).length;
  const upcomingShifts = restaurantShifts.filter(
    (shift) => new Date(shift.startTime) > new Date()
  ).length;

  if (!usersRestaurant) {
    return (
      <Container>
        <Typography variant="h5" sx={{ mt: 4 }}>
          Please create a restaurant first to manage shifts.
        </Typography>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container>
        <Box sx={{ mt: 4, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4">Shift Management</Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={handleOpenFilterDialog}
                sx={{ mr: 2 }}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenCreateDialog}
                disabled={activeWorkers.length === 0}
              >
                Add Shift
              </Button>
            </Box>
          </Box>

          {/* Statistics Cards */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Shifts
                  </Typography>
                  <Typography variant="h3">{totalShifts}</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      mt: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <Chip
                      label={`${currentShifts} Active`}
                      color="success"
                      size="small"
                    />
                    <Chip
                      label={`${upcomingShifts} Upcoming`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Worker Distribution
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                  >
                    {workers
                      .filter((w) => w.active)
                      .map((worker) => {
                        const shiftsCount = restaurantShifts.filter(
                          (shift) => shift.worker.id === worker.id
                        ).length;
                        return (
                          <Chip
                            key={worker.id}
                            label={`${worker.name}: ${shiftsCount}`}
                            color={shiftsCount > 0 ? "primary" : "default"}
                            variant={shiftsCount > 0 ? "filled" : "outlined"}
                            size="small"
                          />
                        );
                      })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {activeWorkers.length === 0 && (
            <Paper sx={{ p: 2, mb: 2, bgcolor: "info.light" }}>
              <Typography>
                You need to add active workers before you can create shifts.
              </Typography>
            </Paper>
          )}

          {/* Tabs for filtering by time period */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="shift view tabs"
            >
              <Tab icon={<EventNoteIcon />} label="All Shifts" />
              <Tab icon={<AccessTimeIcon />} label="Today" />
              <Tab icon={<CalendarViewWeekIcon />} label="This Week" />
              <Tab icon={<CalendarMonthIcon />} label="This Month" />
            </Tabs>
          </Box>

          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : categorizedShifts.length > 0 ? (
              <>
                <TableContainer>
                  <Table stickyHeader aria-label="shifts table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Worker</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categorizedShifts
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((shift) => {
                          const statusInfo = getShiftStatus(
                            shift.startTime,
                            shift.endTime,
                            shift.status
                          );
                          const duration = calculateDuration(
                            shift.startTime,
                            shift.endTime
                          );
                          return (
                            <TableRow hover key={shift.id}>
                              <TableCell>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  {shift.worker.name}
                                  {shift.worker.role && (
                                    <Chip
                                      label={shift.worker.role}
                                      size="small"
                                      sx={{ ml: 1 }}
                                    />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                {formatDate(shift.startTime)}
                              </TableCell>
                              <TableCell>
                                {formatTime(shift.startTime)} -{" "}
                                {formatTime(shift.endTime)}
                              </TableCell>
                              <TableCell>{duration}h</TableCell>
                              <TableCell>
                                {shift.shiftType || "Regular"}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={shift.priority || "Medium"}
                                  color={getPriorityColor(
                                    shift.priority || "Medium"
                                  )}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>{shift.location || "-"}</TableCell>
                              <TableCell>
                                <Chip
                                  label={statusInfo.label}
                                  color={statusInfo.color}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Tooltip title="Edit Shift">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenEditDialog(shift)}
                                    sx={{ mr: 1 }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Shift">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteShift(shift.id)}
                                    sx={{ mr: 1 }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Update Status">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() =>
                                      handleOpenStatusDialog(shift)
                                    }
                                    sx={{ mr: 1 }}
                                  >
                                    <RefreshIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                {statusInfo.label === "Active" &&
                                  statusInfo.canCheckIn && (
                                    <Tooltip title="Check In">
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        onClick={() =>
                                          handleQuickAction(shift, "checkIn")
                                        }
                                        sx={{
                                          mr: 1,
                                          fontSize: "0.7rem",
                                          padding: "2px 6px",
                                        }}
                                      >
                                        Check In
                                      </Button>
                                    </Tooltip>
                                  )}
                                {statusInfo.label === "Checked In" &&
                                  statusInfo.canCheckOut && (
                                    <Tooltip title="Check Out">
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        color="success"
                                        onClick={() =>
                                          handleQuickAction(shift, "checkOut")
                                        }
                                        sx={{
                                          mr: 1,
                                          fontSize: "0.7rem",
                                          padding: "2px 6px",
                                        }}
                                      >
                                        Check Out
                                      </Button>
                                    </Tooltip>
                                  )}
                                {statusInfo.canCancel && (
                                  <Tooltip title="Cancel Shift">
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="error"
                                      onClick={() =>
                                        handleQuickAction(shift, "cancel")
                                      }
                                      sx={{
                                        fontSize: "0.7rem",
                                        padding: "2px 6px",
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </Tooltip>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={categorizedShifts.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            ) : (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography>
                  No shifts found for the selected criteria.
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Create/Edit Shift Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {dialogMode === "create" ? "Add New Shift" : "Edit Shift"}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="worker-select-label">Worker</InputLabel>
                    <Select
                      labelId="worker-select-label"
                      id="workerId"
                      name="workerId"
                      value={formData.workerId}
                      onChange={handleChange}
                      label="Worker"
                      required
                    >
                      {activeWorkers.map((worker) => (
                        <MenuItem key={worker.id} value={worker.id}>
                          {worker.name} {worker.role ? `- ${worker.role}` : ""}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="Start Time"
                    value={formData.startTime}
                    onChange={handleDateTimeChange("startTime")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        fullWidth
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="End Time"
                    value={formData.endTime}
                    onChange={handleDateTimeChange("endTime")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        fullWidth
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="shift-type-label">Shift Type</InputLabel>
                    <Select
                      labelId="shift-type-label"
                      id="shiftType"
                      name="shiftType"
                      value={formData.shiftType}
                      onChange={handleChange}
                      label="Shift Type"
                    >
                      {SHIFT_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="priority-label">Priority</InputLabel>
                    <Select
                      labelId="priority-label"
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      label="Priority"
                    >
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    fullWidth
                    id="location"
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    fullWidth
                    id="notes"
                    label="Notes"
                    name="notes"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: "background.paper",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Shift Summary
                    </Typography>
                    <Typography variant="body2">
                      Worker:{" "}
                      {formData.workerId
                        ? getWorkerName(formData.workerId)
                        : "None selected"}
                    </Typography>
                    <Typography variant="body2">
                      Duration:{" "}
                      {formData.startTime && formData.endTime
                        ? `${calculateDuration(
                            formData.startTime,
                            formData.endTime
                          )} hours`
                        : "Not set"}
                    </Typography>
                    <Typography variant="body2">
                      Date:{" "}
                      {formData.startTime
                        ? formatDate(formData.startTime)
                        : "Not set"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {dialogMode === "create" ? "Create" : "Update"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Filter Dialog */}
        <Dialog open={openFilterDialog} onClose={handleCloseFilterDialog}>
          <DialogTitle>Filter Shifts</DialogTitle>
          <DialogContent>
            <Box sx={{ minWidth: 300, mt: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="filter-worker-label">Worker</InputLabel>
                <Select
                  labelId="filter-worker-label"
                  value={filterWorker}
                  label="Worker"
                  onChange={(e) => setFilterWorker(e.target.value)}
                >
                  <MenuItem value="">All Workers</MenuItem>
                  {workers.map((worker) => (
                    <MenuItem key={worker.id} value={worker.id.toString()}>
                      {worker.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="filter-shift-type-label">Shift Type</InputLabel>
                <Select
                  labelId="filter-shift-type-label"
                  value={filterShiftType}
                  label="Shift Type"
                  onChange={(e) => setFilterShiftType(e.target.value)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {SHIFT_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Date Range
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <DateTimePicker
                      label="From"
                      value={filterDateRange.startDate}
                      onChange={(date) =>
                        setFilterDateRange({
                          ...filterDateRange,
                          startDate: date,
                        })
                      }
                      renderInput={(params) => (
                        <TextField {...params} fullWidth size="small" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DateTimePicker
                      label="To"
                      value={filterDateRange.endDate}
                      onChange={(date) =>
                        setFilterDateRange({
                          ...filterDateRange,
                          endDate: date,
                        })
                      }
                      renderInput={(params) => (
                        <TextField {...params} fullWidth size="small" />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleResetFilters}>Reset</Button>
            <Button onClick={handleCloseFilterDialog} variant="contained">
              Apply
            </Button>
          </DialogActions>
        </Dialog>

        {/* Status Update Dialog */}
        <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog}>
          <DialogTitle>Update Shift Status</DialogTitle>
          <DialogContent>
            {selectedShift && (
              <Box sx={{ mt: 1, minWidth: 300 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Worker: {getWorkerName(selectedShift.worker?.id)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDateTime(selectedShift.startTime)} -{" "}
                  {formatDateTime(selectedShift.endTime)}
                </Typography>
                {selectedShift.location && (
                  <Typography variant="body2" gutterBottom>
                    Location: {selectedShift.location}
                  </Typography>
                )}
                {selectedShift.shiftType && (
                  <Typography variant="body2" gutterBottom>
                    Type: {selectedShift.shiftType}
                  </Typography>
                )}
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    label="Status"
                  >
                    <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                    <MenuItem value="CHECKED_IN">Checked In</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                    <MenuItem value="CANCELED">Canceled</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseStatusDialog}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateStatus}
            >
              Update Status
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default ShiftManagement;
