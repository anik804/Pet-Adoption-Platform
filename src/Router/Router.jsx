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
import MyDonations from "../Pages/Donation Campigns/MyDonations";
import Error from "../Pages/Error Page/Error";
import ContactUs from "../Pages/Contact Us/ContactUs";
import UserProfile from "../Pages/Dashboard/UserProfile";

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
  path: "*",
  Component: Error,
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
        path: "contact-us",
        Component: ContactUs,

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
            path: "profile",
            element: <UserProfile></UserProfile>
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
            element: <MyDonations></MyDonations>
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
