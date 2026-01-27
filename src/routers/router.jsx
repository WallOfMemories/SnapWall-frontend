import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import Login from "../logs/Login.jsx";
import Signup from "../logs/Signup.jsx";
import ForgotPassword from "../logs/Forgot.jsx";
import Success from "../logs/Success.jsx";
import ProfileDetails from "../logs/ProfileDetails.jsx";
import OtpVerify from "../logs/OtpVerify.jsx";  
import Promotions from "../pages/Promotions.jsx";
import Profile from "../pages/Profile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "otp-verify",
        element: <OtpVerify />,
      },
      {
        path: "forgot",
        element: <ForgotPassword />,
      },
      {
        path: "profile-details",
        element: <ProfileDetails />,
      },
      {
        path: "success",
        element: <Success />,
      },
      {
        path: "promotions",
        element: <Promotions />
      },
      {
        path: "profile",
        element: <Profile />
      }
    ],
  },
]);

export default router;
