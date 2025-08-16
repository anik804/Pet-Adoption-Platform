import React, { useState } from "react";
import { NavLink, Outlet } from "react-router";
import useAuth from "../../Hooks/useAuth";
import AddPetForm from "../Add Pet/AddPetForm";
import {
  PawPrint,
  PlusCircle,
  FolderPlus,
  HeartHandshake,
  PiggyBank,
  HandCoins,
  Users,
  CircleUserRoundIcon,
  LayoutDashboard,
} from "lucide-react";

export const AddPet = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Add a Pet</h2>
      <AddPetForm />
    </div>
  );
};

const UserDashboard = () => {
  const { role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white/90 backdrop-blur-xl shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-200">
          <h1 className="flex items-center gap-2 text-xl font-bold text-indigo-600">
            <LayoutDashboard className="w-6 h-6" />
            Dashboard
          </h1>
          <button
            className="md:hidden text-gray-500 hover:text-gray-800 transition"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Navigation (reduced height for footer space) */}
        <nav className="mt-6 px-3 space-y-2 overflow-y-auto h-[calc(100vh-160px)]">
          <NavLink
            to="profile"
            className={navLinkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <CircleUserRoundIcon className="w-5 h-5" />
            Profile
          </NavLink>
          <NavLink to="add-pet" className={navLinkClass}>
            <PlusCircle className="w-5 h-5" /> Add a Pet
          </NavLink>
          <NavLink to="my-added-pets" className={navLinkClass}>
            <FolderPlus className="w-5 h-5" /> My Added Pets
          </NavLink>
          <NavLink to="adoption-request" className={navLinkClass}>
            <HeartHandshake className="w-5 h-5" /> Adoption Requests
          </NavLink>
          <NavLink to="create-donation-campaign" className={navLinkClass}>
            <PiggyBank className="w-5 h-5" /> Create Donation
          </NavLink>
          <NavLink to="my-donation-campaigns" className={navLinkClass}>
            <PawPrint className="w-5 h-5" /> My Campaigns
          </NavLink>
          <NavLink to="my-donations" className={navLinkClass}>
            <HandCoins className="w-5 h-5" /> My Donations
          </NavLink>

          {role === "admin" && (
            <div className="pt-4 border-t border-gray-200">
              <h2 className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Admin Panel
              </h2>
              <NavLink to="/admin/users" className={navLinkClass}>
                <Users className="w-5 h-5" /> Manage Users
              </NavLink>
              <NavLink to="/admin/all-pets" className={navLinkClass}>
                <PawPrint className="w-5 h-5" /> All Pets
              </NavLink>
              <NavLink to="/admin/all-donations" className={navLinkClass}>
                <HandCoins className="w-5 h-5" /> All Donations
              </NavLink>
            </div>
          )}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white/70 backdrop-blur-md shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <button
            className="md:hidden text-gray-700 hover:text-gray-900 transition"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold text-gray-700">
            Welcome Back 👋
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-white shadow-inner rounded-t-2xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
