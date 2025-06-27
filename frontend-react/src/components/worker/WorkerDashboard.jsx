import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  Chip,
  Grid,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Avatar,
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Tooltip,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { format, isSameDay, differenceInMinutes } from "date-fns";
import {
  getWorkerShifts,
  checkInShift,
  checkOutShift,
  cancelShift,
  updateShiftStatus,
} from "../../State/Shift/Action";
import { workerLogout } from "../../State/Worker/Action";
import LogoutIcon from "@mui/icons-material/Logout";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import HistoryIcon from "@mui/icons-material/History";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import WorkIcon from "@mui/icons-material/Work";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import PlaceIcon from "@mui/icons-material/Place";
import NotesIcon from "@mui/icons-material/Notes";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";

const WorkerDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { workerAuth } = useSelector((state) => state.worker);
  const { workerShifts, loading, error } = useSelector((state) => state.shift);

  const [tabValue, setTabValue] = useState(0);
  const [currentShifts, setCurrentShifts] = useState([]);
  const [upcomingShifts, setUpcomingShifts] = useState([]);
  const [pastShifts, setPastShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [statusAction, setStatusAction] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!workerAuth) {
      navigate("/worker/login");
      return;
    }

    // Fetch worker shifts
    dispatch(getWorkerShifts(workerAuth.workerId));
  }, [dispatch, workerAuth, navigate]);

  useEffect(() => {
    if (workerShifts && workerShifts.length > 0) {
      const now = new Date();

      // Categorize shifts
      const current = workerShifts.filter(
        (shift) =>
          shift.status !== "CANCELED" &&
          new Date(shift.startTime) <= now &&
          new Date(shift.endTime) >= now
      );

      const upcoming = workerShifts.filter(
        (shift) =>
          shift.status !== "CANCELED" && new Date(shift.startTime) > now
      );

      const past = workerShifts.filter(
        (shift) =>
          shift.status === "CANCELED" ||
          shift.status === "COMPLETED" ||
          new Date(shift.endTime) < now
      );

      // Sort shifts by date
      current.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      upcoming.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      past.sort((a, b) => new Date(b.startTime) - new Date(a.startTime)); // Most recent first

      setCurrentShifts(current);
      setUpcomingShifts(upcoming);
      setPastShifts(past);
    }
  }, [workerShifts]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    dispatch(workerLogout());
    navigate("/worker/login");
  };

  const handleOpenShiftDialog = (shift, action) => {
    setSelectedShift(shift);
    setStatusAction(action);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleShiftAction = async () => {
    try {
      if (statusAction === "check-in") {
        await dispatch(checkInShift(selectedShift.id, workerAuth.workerId));
        setSnackbar({
          open: true,
          message: "Successfully checked in to shift",
          severity: "success",
        });
      } else if (statusAction === "check-out") {
        await dispatch(checkOutShift(selectedShift.id, workerAuth.workerId));
        setSnackbar({
          open: true,
          message: "Successfully checked out from shift",
          severity: "success",
        });
      } else if (statusAction === "cancel") {
        await dispatch(cancelShift(selectedShift.id));
        setSnackbar({
          open: true,
          message: "Shift has been canceled",
          severity: "info",
        });
      }

      // Refresh shifts
      dispatch(getWorkerShifts(workerAuth.workerId));
      handleCloseDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "An error occurred",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleOpenStatusDialog = (shift) => {
    setSelectedShift(shift);
    setSelectedStatus(shift.status);
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
      setSnackbar({
        open: true,
        message: "Shift status updated successfully",
        severity: "success",
      });
      dispatch(getWorkerShifts(workerAuth.workerId));
      handleCloseStatusDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update shift status",
        severity: "error",
      });
    }
  };

  // Format date and time
  const formatDate = (dateStr) => {
    return format(new Date(dateStr), "EEE, MMM dd, yyyy");
  };

  const formatTime = (dateStr) => {
    return format(new Date(dateStr), "h:mm a");
  };

  // Calculate shift duration in hours
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMins = differenceInMinutes(end, start);
    const hours = Math.floor(durationMins / 60);
    const mins = durationMins % 60;

    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    if (!priority) return "default";

    switch (priority.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "default";
    }
  };

  // Get status color and actions
  const getShiftStatusInfo = (shift) => {
    const now = new Date();
    const start = new Date(shift.startTime);
    const end = new Date(shift.endTime);

    // Check explicit status values first
    if (shift.status === "CANCELED") {
      return {
        label: "Canceled",
        color: "error",
        canCheckIn: false,
        canCheckOut: false,
        canCancel: false,
      };
    }

    if (shift.status === "CHECKED_IN") {
      return {
        label: "Checked In",
        color: "success",
        canCheckIn: false,
        canCheckOut: now >= start && now <= end,
        canCancel: false,
      };
    }

    if (shift.status === "COMPLETED") {
      return {
        label: "Completed",
        color: "default",
        canCheckIn: false,
        canCheckOut: false,
        canCancel: false,
      };
    }

    // For SCHEDULED status
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
        label: "Missed",
        color: "warning",
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

  if (!workerAuth) {
    return null; // This will be handled by the useEffect redirect
  }

  // Get shift list based on current tab
  const getShiftList = () => {
    switch (tabValue) {
      case 0: // Current
        return currentShifts;
      case 1: // Upcoming
        return upcomingShifts;
      case 2: // Past
        return pastShifts;
      default:
        return [];
    }
  };

  // Get empty message based on current tab
  const getEmptyMessage = () => {
    switch (tabValue) {
      case 0:
        return "No active shifts right now";
      case 1:
        return "No upcoming shifts scheduled";
      case 2:
        return "No past shifts found";
      default:
        return "No shifts found";
    }
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <WorkIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Worker Dashboard
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.secondary.main,
                mr: 1,
                display: { xs: "none", sm: "flex" },
              }}
            >
              {workerAuth.name?.charAt(0) || "W"}
            </Avatar>
            <Box
              sx={{
                textAlign: "right",
                mr: 2,
                display: { xs: "none", sm: "block" },
              }}
            >
              <Typography variant="body2">{workerAuth.name}</Typography>
              <Typography variant="caption">
                {workerAuth.role || "Worker"}
              </Typography>
            </Box>
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={handleLogout} edge="end">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Worker Info Card */}
        <Card sx={{ mb: 4, p: 2, boxShadow: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: theme.palette.primary.main,
                mr: 2,
              }}
            >
              {workerAuth.name?.charAt(0) || "W"}
            </Avatar>
            <Box>
              <Typography variant="h5">{workerAuth.name}</Typography>
              <Box sx={{ display: "flex", mt: 1, flexWrap: "wrap", gap: 1 }}>
                <Chip
                  label={workerAuth.role || "Staff"}
                  color="primary"
                  size="small"
                  icon={<WorkIcon />}
                />
                <Chip
                  label={workerAuth.restaurantName}
                  variant="outlined"
                  size="small"
                  icon={<PlaceIcon />}
                />
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Badge
                    color="success"
                    badgeContent={currentShifts.length}
                    max={99}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: 14,
                        height: 24,
                        minWidth: 24,
                      },
                    }}
                  >
                    <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                  </Badge>
                  <Typography variant="h6" color="text.primary">
                    Current Shifts
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                {currentShifts.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {currentShifts.length > 0 &&
                        formatDate(currentShifts[0].startTime)}
                    </Typography>
                    <Typography variant="body1">
                      {currentShifts.length > 0 &&
                        `${formatTime(
                          currentShifts[0].startTime
                        )} - ${formatTime(currentShifts[0].endTime)}`}
                    </Typography>
                    {currentShifts.length > 0 && currentShifts[0].location && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <PlaceIcon
                          fontSize="small"
                          sx={{ verticalAlign: "middle", mr: 0.5 }}
                        />
                        {currentShifts[0].location}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    No active shifts right now
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Badge
                    color="primary"
                    badgeContent={upcomingShifts.length}
                    max={99}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: 14,
                        height: 24,
                        minWidth: 24,
                      },
                    }}
                  >
                    <EventIcon color="action" sx={{ mr: 1 }} />
                  </Badge>
                  <Typography variant="h6" color="text.primary">
                    Upcoming Shifts
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                {upcomingShifts.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Next shift: {formatDate(upcomingShifts[0].startTime)}
                    </Typography>
                    <Typography variant="body1">
                      {formatTime(upcomingShifts[0].startTime)} -{" "}
                      {formatTime(upcomingShifts[0].endTime)}
                    </Typography>
                    {upcomingShifts[0].location && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <PlaceIcon
                          fontSize="small"
                          sx={{ verticalAlign: "middle", mr: 0.5 }}
                        />
                        {upcomingShifts[0].location}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    No upcoming shifts scheduled
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Badge
                    color="default"
                    badgeContent={pastShifts.length}
                    max={99}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: 14,
                        height: 24,
                        minWidth: 24,
                      },
                    }}
                  >
                    <HistoryIcon color="action" sx={{ mr: 1 }} />
                  </Badge>
                  <Typography variant="h6" color="text.primary">
                    Past Shifts
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {pastShifts.length > 0
                      ? `You have completed ${
                          pastShifts.filter(
                            (shift) => shift.status === "COMPLETED"
                          ).length
                        } shifts`
                      : "No past shifts found"}
                  </Typography>
                  {pastShifts.length > 0 && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Last shift: {formatDate(pastShifts[0].endTime)}
                    </Typography>
                  )}
                  {pastShifts.filter((shift) => shift.status === "CANCELED")
                    .length > 0 && (
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, color: theme.palette.error.main }}
                    >
                      Canceled:{" "}
                      {
                        pastShifts.filter(
                          (shift) => shift.status === "CANCELED"
                        ).length
                      }{" "}
                      shifts
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Paper sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            aria-label="shift tabs"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab
              icon={<AccessTimeIcon />}
              label="Current"
              id="tab-0"
              aria-controls="tabpanel-0"
              iconPosition={isMobile ? "top" : "start"}
            />
            <Tab
              icon={<EventIcon />}
              label="Upcoming"
              id="tab-1"
              aria-controls="tabpanel-1"
              iconPosition={isMobile ? "top" : "start"}
            />
            <Tab
              icon={<HistoryIcon />}
              label="Past"
              id="tab-2"
              aria-controls="tabpanel-2"
              iconPosition={isMobile ? "top" : "start"}
            />
          </Tabs>

          <Box
            role="tabpanel"
            id={`tabpanel-${tabValue}`}
            aria-labelledby={`tab-${tabValue}`}
          >
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : getShiftList().length > 0 ? (
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        Duration
                      </TableCell>
                      <TableCell
                        sx={{ display: { xs: "none", sm: "table-cell" } }}
                      >
                        Type
                      </TableCell>
                      <TableCell
                        sx={{ display: { xs: "none", lg: "table-cell" } }}
                      >
                        Priority
                      </TableCell>
                      <TableCell
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        Location
                      </TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getShiftList().map((shift) => {
                      const statusInfo = getShiftStatusInfo(shift);
                      return (
                        <TableRow key={shift.id} hover>
                          <TableCell>{formatDate(shift.startTime)}</TableCell>
                          <TableCell>
                            {formatTime(shift.startTime)} -{" "}
                            {formatTime(shift.endTime)}
                          </TableCell>
                          <TableCell
                            sx={{ display: { xs: "none", md: "table-cell" } }}
                          >
                            {calculateDuration(shift.startTime, shift.endTime)}
                          </TableCell>
                          <TableCell
                            sx={{ display: { xs: "none", sm: "table-cell" } }}
                          >
                            <Chip
                              label={shift.shiftType || "Regular"}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell
                            sx={{ display: { xs: "none", lg: "table-cell" } }}
                          >
                            <Chip
                              label={shift.priority || "Medium"}
                              color={getPriorityColor(shift.priority)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell
                            sx={{ display: { xs: "none", md: "table-cell" } }}
                          >
                            {shift.location || "-"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={statusInfo.label}
                              color={statusInfo.color}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            {statusInfo.canCheckIn && (
                              <Tooltip title="Check In">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() =>
                                    handleOpenShiftDialog(shift, "check-in")
                                  }
                                >
                                  <HowToRegIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {statusInfo.canCheckOut && (
                              <Tooltip title="Check Out">
                                <IconButton
                                  color="success"
                                  size="small"
                                  onClick={() =>
                                    handleOpenShiftDialog(shift, "check-out")
                                  }
                                >
                                  <ExitToAppIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {statusInfo.canCancel && (
                              <Tooltip title="Cancel Shift">
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() =>
                                    handleOpenShiftDialog(shift, "cancel")
                                  }
                                >
                                  <CancelIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {workerAuth.role === "MANAGER" && (
                              <Tooltip title="Update Status">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => handleOpenStatusDialog(shift)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6" color="text.secondary">
                  {getEmptyMessage()}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Shift Action Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {statusAction === "check-in"
            ? "Check In to Shift"
            : statusAction === "check-out"
            ? "Check Out from Shift"
            : "Cancel Shift"}
        </DialogTitle>
        <DialogContent>
          {selectedShift && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                {formatDate(selectedShift.startTime)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatTime(selectedShift.startTime)} -{" "}
                {formatTime(selectedShift.endTime)}
              </Typography>
              {selectedShift.location && (
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <PlaceIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {selectedShift.location}
                  </Typography>
                </Box>
              )}
              {selectedShift.notes && (
                <Box sx={{ display: "flex", alignItems: "flex-start", mt: 1 }}>
                  <NotesIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
                  <Typography variant="body2">{selectedShift.notes}</Typography>
                </Box>
              )}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {statusAction === "check-in"
                    ? "Are you ready to check in to this shift?"
                    : statusAction === "check-out"
                    ? "Are you ready to check out from this shift?"
                    : "Are you sure you want to cancel this shift? This action cannot be undone."}
                </Typography>
                {statusAction === "cancel" && (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ mt: 1, fontWeight: "bold" }}
                  >
                    Canceling a shift may affect your work record and schedule.
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {statusAction === "cancel" ? "Keep Shift" : "Cancel"}
          </Button>
          <Button
            onClick={handleShiftAction}
            variant="contained"
            color={
              statusAction === "check-in"
                ? "primary"
                : statusAction === "check-out"
                ? "success"
                : "error"
            }
            startIcon={
              statusAction === "check-in" ? (
                <HowToRegIcon />
              ) : statusAction === "check-out" ? (
                <ExitToAppIcon />
              ) : (
                <CancelIcon />
              )
            }
          >
            {statusAction === "check-in"
              ? "Check In"
              : statusAction === "check-out"
              ? "Check Out"
              : "Cancel Shift"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog}>
        <DialogTitle>Update Shift Status</DialogTitle>
        <DialogContent>
          {selectedShift && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                {formatDate(selectedShift.startTime)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatTime(selectedShift.startTime)} -{" "}
                {formatTime(selectedShift.endTime)}
              </Typography>
              {selectedShift.location && (
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <PlaceIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {selectedShift.location}
                  </Typography>
                </Box>
              )}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  value={selectedStatus}
                  label="Status"
                  onChange={handleStatusChange}
                >
                  <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                  <MenuItem value="CHECKED_IN">Checked In</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="CANCELED">Canceled</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Changing the shift status may affect worker schedules and
                records.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WorkerDashboard;
