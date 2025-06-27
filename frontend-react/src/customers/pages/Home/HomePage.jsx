import React, { useEffect } from "react";
import "./HomePage.css";
import Navbar from "../../components/Navbar/Navbar";
import MultipleItemsCarousel from "../../components/MultiItemCarousel/MultiItemCarousel";
import { restaurents } from "../../../Data/restaurents";
import RestaurantCard from "../../components/RestarentCard/RestaurantCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllRestaurantsAction } from "../../../State/Customers/Restaurant/restaurant.action";
import { Button, Typography, Box, Paper } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import { useNavigate } from "react-router-dom";
// import { getAllRestaurantsAction } from "../../../State/Restaurant/Action";
// import RestarantCard from "../../components/RestarentCard/Restaurant";

const HomePage = () => {
  const { auth, restaurant } = useSelector((store) => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user) {
      dispatch(getAllRestaurantsAction(localStorage.getItem("jwt")));
    }
  }, [auth.user]);

  const navigateToWorkerLogin = () => {
    navigate("/worker/login");
  };

  return (
    <div className="">
      <section className="-z-50 banner relative flex flex-col justify-center items-center">
        <div className="w-[50vw] z-10 text-center">
          <p className="text-2xl lg:text-7xl font-bold z-10 py-5">Aramark</p>
          <p className="z-10 text-gray-300 text-xl lg:text-4xl">
            Taste the Convenience: Food, Fast and Delivered.
          </p>
        </div>

        <div className="cover absolute top-0 left-0 right-0"></div>
        <div className="fadout"></div>
      </section>

      {/* Worker Login Section */}
      <Box
        sx={{
          py: 6,
          display: "flex",
          justifyContent: "center",
          bgcolor: "#f8f8f8",
        }}
      >
        <Paper
          elevation={3}
          sx={{ maxWidth: 800, width: "100%", p: 4, textAlign: "center" }}
        >
          <WorkIcon sx={{ fontSize: 40, color: "#e91e63", mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Restaurant Staff?
          </Typography>
          <Typography variant="body1" paragraph>
            Access your shifts and schedule by logging in to the worker portal.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<WorkIcon />}
            onClick={navigateToWorkerLogin}
            sx={{ mt: 2 }}
          >
            Worker Login
          </Button>
        </Paper>
      </Box>

      <section className="p-10 lg:py-10 lg:px-20">
        <div className="">
          <p className="text-2xl font-semibold text-gray-400 py-3 pb-10">
            Top Meals
          </p>
          <MultipleItemsCarousel />
        </div>
      </section>

      <section className="px-5 lg:px-20">
        <div className="">
          <h1 className="text-2xl font-semibold text-gray-400 py-3 ">
            Order From Our Handpicked Favorites
          </h1>
          <div className="flex flex-wrap items-center justify-around ">
            {restaurant.restaurants.map((item, i) => (
              <RestaurantCard key={i} data={item} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
