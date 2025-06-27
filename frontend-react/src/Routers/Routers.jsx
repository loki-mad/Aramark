import React from "react";
import { Route, Routes } from "react-router-dom";
import CustomerRoutes from "./CustomerRoutes";
import Admin from "../Admin/Admin";
import AdminDashboard from "../Admin/Dashboard/AdminDashboard";
import SuperAdmin from "../SuperAdmin/SuperAdmin";
import { useSelector } from "react-redux";
import NotFound from "../customers/pages/NotFound/NotFound";
import IngredientsList from "../Data/Demo";
import CreateRestaurantForm from "../Admin/AddRestaurants/CreateRestaurantForm";
import AdminRouters from "./AdminRouters";
import WorkerLogin from "../components/worker/WorkerLogin";
import WorkerDashboard from "../components/worker/WorkerDashboard";

const Routers = () => {
  const { auth } = useSelector((store) => store);

  return (
    <>
      <Routes>
        <Route path="/worker/login" element={<WorkerLogin />} />
        <Route path="/worker/dashboard" element={<WorkerDashboard />} />
        <Route path="/admin/restaurant/*" element={<AdminRouters />} />
        <Route path="/*" element={<CustomerRoutes />} />
      </Routes>
    </>
  );
};

export default Routers;
