import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../logs/Login";
import Signup from "../logs/Signup";
import ForgotPassword from "../logs/Forgot";
import Success from "../logs/Success";
import ProfileDetails from "../logs/ProfileDetails";
import OtpVerify from "../logs/OTPVerify";
import Promotions from "../pages/Promotions";
import Profile from "../pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        index: true,
        element: <Home/>,
      },
      {
        path: "login",
        element: <Login/>,
      },
      {
        path: "signup",
        element: <Signup/>,
      },
      {
        path: "otp-verify",
        element: <OtpVerify/>,
      },
      {
        path: "forgot",
        element: <ForgotPassword/>,
      },
      {
        path: "profile-details",
        element: <ProfileDetails/>,
      },
      {
        path: "success",
        element: <Success/>,
      },
      {
        path: "promotions",
        element: <Promotions/>
      },
      {
        path: "profile",
        element: <Profile/>
      }
    ],
  },
]);

export default router;
