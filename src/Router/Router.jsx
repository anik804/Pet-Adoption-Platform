import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import Pets from "../Pages/Pets/Pets";
import PetDetails from "../Pages/Pet Details/PetDetails";

import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import DonationCampaignsPage from "../Pages/Donation Campigns/DonationCampaignsPage";
import DonationDetailsPage from "../Pages/Donation Campigns/DonationDetailsPage";
import React from "react";
import UserDashboard, { AddPet } from "../Pages/Dashboard/UserDashboard";
import AddedPets from "../Pages/Added Pets/AddedPets";
import UpdatePet from "../Pages/Update Pet/UpdatePet";
import CreateDonationCampaign from "../Pages/Donation Campigns/CreateDonationCampaign";
import MyDonationCampaigns from "../Pages/Donation Campigns/MyDonationCampaigns";
import AdminRoute from "../Routes/AdminRoute";
import Users from "../Pages/Admin/Users";
import AllPets from "../Pages/Admin/AllPets";
import AllDonations from "../Pages/Admin/AllDonations";
import AdoptionRequestsDashboard from "../Pages/Adoption Request/AdoptionRequestsDashboard";

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
        path: "pets",
        Component: Pets,
      },
      {
        path: "pets/:id",
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
      {
        path: "dashboard",
        Component: UserDashboard,
        children: [
          {
            path: "add-pet",
            element: <AddPet />,
          },
          {
            path: "my-added-pets",
            element: (
              <React.Suspense fallback={<div>Loading...</div>}>
                <AddedPets />
              </React.Suspense>
            ),
          },
          {
            path: "update-pet/:id",
            element: <UpdatePet />,
          },
          // {
          //   path: "adoption-request",
          //   element: <div>Adoption Request Page</div>,
          // },
          { path: "adoption-request", element: <AdoptionRequestsDashboard /> },
          {
            path: "create-donation-campaign",
            element: <CreateDonationCampaign />,
          },
          {
            path: "my-donation-campaigns",
            element: <MyDonationCampaigns />,
          },
          {
            path: "my-donations",
            element: <div>My Donations Page</div>,
          },
        ],
      },
      {
        path: "admin/*",
        element: (
          <AdminRoute>
            <Users />
          </AdminRoute>
        ),
      },
      {
        path: "admin/all-pets",
        element: (
          <AdminRoute>
            <AllPets />
          </AdminRoute>
        ),
      },
      {
        path: "admin/all-donations",
        element: (
          <AdminRoute>
            <AllDonations />
          </AdminRoute>
        ),
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
