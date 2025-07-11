import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router';
import useAuth from '../../Hooks/useAuth';
import AddPetForm from '../Add Pet/AddPetForm';

export const AddPet = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Add a Pet</h2>
      <AddPetForm></AddPetForm>
    </div>
  );
};

const UserDashboard = () => {
  const { role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'block px-6 py-3 bg-gray-300 font-semibold'
      : 'block px-6 py-3 hover:bg-gray-200';

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:inset-auto transition-transform duration-300 ease-in-out
        `}
      >
        <div className="p-6 text-xl font-bold border-b border-gray-200 flex justify-between items-center md:block">
          Dashboard
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            &#x2715;
          </button>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <NavLink to="add-pet" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                Add A Pet
              </NavLink>
            </li>
            <li>
              <NavLink to="my-added-pets" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                My Added Pets
              </NavLink>
            </li>
            <li>
              <NavLink to="adoption-request" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                Adoption Request
              </NavLink>
            </li>
            <li>
              <NavLink to="create-donation-campaign" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                Create Donation Campaign
              </NavLink>
            </li>
            <li>
              <NavLink to="my-donation-campaigns" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                My Donation Campaigns
              </NavLink>
            </li>
            <li>
              <NavLink to="my-donations" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                My Donations
              </NavLink>
            </li>
            {role === 'admin' && (
              <>
                <h1 className="text-center border-2 mx-2 my-2 py-2 font-bold rounded-2xl">Admin Panel</h1>
                <li>
                  <NavLink to="/admin/users" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                    Manage Users
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/all-pets" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                    All Pets
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/all-donations" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                    All Donations
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top navbar */}
        <header className="bg-white shadow p-4 flex items-center justify-between md:justify-between">
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            &#9776;
          </button>
          <h1 className="text-xl font-bold ml-2 md:ml-0">Dashboard</h1>
          {/* Placeholder for user info or actions */}
          <div>User Info</div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
