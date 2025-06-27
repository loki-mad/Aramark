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
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Divider,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PersonIcon from "@mui/icons-material/Person";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  getWorkersByRestaurant,
  createWorker,
  updateWorker,
  deleteWorker,
  toggleWorkerStatus,
} from "../../State/Worker/Action";

const ROLES = ["Waiter", "Chef", "Manager", "Cashier", "Host", "Delivery"];

const WorkerManagement = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { workers, loading, error } = useSelector((state) => state.worker);
  const { usersRestaurant } = useSelector((state) => state.restaurant);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("create"); // 'create' or 'edit'
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "Waiter",
    status: "ACTIVE",
  });
  const [showPassword, setShowPassword] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Added pagination support
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filter states
  const [filterActive, setFilterActive] = useState(null); // null = all, true = active, false = inactive
  const [filterRole, setFilterRole] = useState("");
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  useEffect(() => {
    if (usersRestaurant?.id) {
      dispatch(getWorkersByRestaurant(usersRestaurant.id));
    }
  }, [dispatch, usersRestaurant]);

  const handleOpenCreateDialog = () => {
    setDialogMode("create");
    setSelectedWorker(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "Waiter",
      status: "ACTIVE",
    });
    setShowPassword(true);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (worker) => {
    setDialogMode("edit");
    setSelectedWorker(worker);
    setFormData({
      name: worker.name,
      email: worker.email,
      password: "",
      phone: worker.phone,
      role: worker.role || "Waiter",
      status: worker.active ? "ACTIVE" : "INACTIVE",
    });
    setShowPassword(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const workerData = {
        ...formData,
        active: formData.status === "ACTIVE",
        restaurantId: usersRestaurant.id,
      };

      if (dialogMode === "create") {
        await dispatch(createWorker(workerData));
        setSnackbarMessage("Worker created successfully");
      } else {
        // For edit mode, only include password if it was changed
        if (!workerData.password) {
          delete workerData.password;
        }

        await dispatch(updateWorker(selectedWorker.id, workerData));
        setSnackbarMessage("Worker updated successfully");
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

  const handleDeleteWorker = async (workerId) => {
    if (window.confirm("Are you sure you want to delete this worker?")) {
      try {
        await dispatch(deleteWorker(workerId));
        setSnackbarSeverity("success");
        setSnackbarMessage("Worker deleted successfully");
        setOpenSnackbar(true);
      } catch (error) {
        setSnackbarSeverity("error");
        setSnackbarMessage(error.message || "An error occurred");
        setOpenSnackbar(true);
      }
    }
  };

  const handleToggleStatus = async (workerId) => {
    try {
      await dispatch(toggleWorkerStatus(workerId));
      setSnackbarSeverity("success");
      setSnackbarMessage("Worker status updated successfully");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || "An error occurred");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
    setFilterActive(null);
    setFilterRole("");
    setOpenFilterDialog(false);
  };

  // Filter workers based on current filter settings
  const filteredWorkers = workers.filter((worker) => {
    // Filter by active status
    if (filterActive !== null && worker.active !== filterActive) {
      return false;
    }

    // Filter by role
    if (filterRole && worker.role !== filterRole) {
      return false;
    }

    return true;
  });

  // Stats counters
  const activeWorkers = workers.filter((w) => w.active).length;
  const inactiveWorkers = workers.length - activeWorkers;
  const workersByRole = ROLES.map((role) => ({
    role,
    count: workers.filter((w) => w.role === role).length || 0,
  }));

  if (!usersRestaurant) {
    return (
      <Container>
        <Typography variant="h5" sx={{ mt: 4 }}>
          Please create a restaurant first to manage workers.
        </Typography>
      </Container>
    );
  }

  return (
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
          <Typography variant="h4">Worker Management</Typography>
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
            >
              Add Worker
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Workers
                </Typography>
                <Typography variant="h3">{workers.length}</Typography>
                <Box
                  sx={{
                    display: "flex",
                    mt: 2,
                    justifyContent: "space-between",
                  }}
                >
                  <Chip
                    label={`${activeWorkers} Active`}
                    color="success"
                    size="small"
                  />
                  <Chip
                    label={`${inactiveWorkers} Inactive`}
                    color="default"
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
                  Workers by Role
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {workersByRole.map((item) => (
                    <Chip
                      key={item.role}
                      label={`${item.role}: ${item.count}`}
                      color={item.count > 0 ? "primary" : "default"}
                      variant={item.count > 0 ? "filled" : "outlined"}
                      size="small"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : filteredWorkers.length > 0 ? (
            <>
              <TableContainer>
                <Table stickyHeader aria-label="workers table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredWorkers
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((worker) => (
                        <TableRow hover key={worker.id}>
                          <TableCell>{worker.name}</TableCell>
                          <TableCell>{worker.email}</TableCell>
                          <TableCell>{worker.phone}</TableCell>
                          <TableCell>{worker.role || "Waiter"}</TableCell>
                          <TableCell>
                            <Chip
                              label={worker.active ? "Active" : "Inactive"}
                              color={worker.active ? "success" : "default"}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenEditDialog(worker)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color={worker.active ? "default" : "success"}
                              onClick={() => handleToggleStatus(worker.id)}
                            >
                              {worker.active ? (
                                <PersonOffIcon />
                              ) : (
                                <PersonIcon />
                              )}
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteWorker(worker.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredWorkers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography>No workers found. Add your first worker!</Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Create/Edit Worker Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === "create" ? "Add New Worker" : "Edit Worker"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role"
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={handleChange}
                  >
                    {ROLES.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="status-select-label">Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    id="status"
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleChange}
                  >
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {(dialogMode === "create" || showPassword) && (
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required={dialogMode === "create"}
                    fullWidth
                    name="password"
                    label={
                      dialogMode === "create"
                        ? "Password"
                        : "New Password (leave blank to keep current)"
                    }
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Grid>
              )}
              {dialogMode === "edit" && (
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                        name="showPasswordField"
                      />
                    }
                    label="Change Password"
                  />
                </Grid>
              )}
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
        <DialogTitle>Filter Workers</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="filter-status-label">Status</InputLabel>
              <Select
                labelId="filter-status-label"
                value={
                  filterActive === null
                    ? ""
                    : filterActive
                    ? "active"
                    : "inactive"
                }
                label="Status"
                onChange={(e) => {
                  if (e.target.value === "") setFilterActive(null);
                  else setFilterActive(e.target.value === "active");
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="filter-role-label">Role</InputLabel>
              <Select
                labelId="filter-role-label"
                value={filterRole}
                label="Role"
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {ROLES.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetFilters}>Reset</Button>
          <Button onClick={handleCloseFilterDialog} variant="contained">
            Apply
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
  );
};

export default WorkerManagement;
