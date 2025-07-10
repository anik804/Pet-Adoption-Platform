import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import Pets from "../Pages/Pets/Pets";
import PetDetails from "../Pages/Pet Details/PetDetails";

// import DonationCampaignsPage from "../Pages/Donations/DonationCampaignsPage";
// import DonationDetailsPage from "../Pages/Donations/DonationDetailsPage";

import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import DonationCampaignsPage from "../Pages/Donation Campigns/DonationCampaignsPage";
import DonationDetailsPage from "../Pages/Donation Campigns/DonationDetailsPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "Pets",
        Component: Pets,
      },
      {
        path: "Pets/:id",
        Component: PetDetails,
      },
      {
        path: "donation-campaigns",
        Component: DonationCampaignsPage,
      },
      {
        path: "donation-campaigns/:id",
        Component: DonationDetailsPage,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
]);

export default router;
