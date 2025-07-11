import React from 'react';
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

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'block px-6 py-3 bg-gray-300 font-semibold'
      : 'block px-6 py-3 hover:bg-gray-200';

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 text-xl font-bold border-b border-gray-200">
          Dashboard
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <NavLink to="add-pet" className={navLinkClass}>
                Add A Pet
              </NavLink>
            </li>
            <li>
              <NavLink to="my-added-pets" className={navLinkClass}>
                My Added Pets
              </NavLink>
            </li>
            <li>
              <NavLink to="adoption-request" className={navLinkClass}>
                Adoption Request
              </NavLink>
            </li>
            <li>
              <NavLink to="create-donation-campaign" className={navLinkClass}>
                Create Donation Campaign
              </NavLink>
            </li>
            <li>
              <NavLink to="my-donation-campaigns" className={navLinkClass}>
                My Donation Campaigns
              </NavLink>
            </li>
            <li>
              <NavLink to="my-donations" className={navLinkClass}>
                My Donations
              </NavLink>
            </li>
            {role === 'admin' && (
              <>
              <h1 className="text-center border-2 mx-2 my-2 py-2 font-bold rounded-2xl">Admin Panel</h1>
                <li>
                  <NavLink to="/admin/users" className={navLinkClass}>
                    Manage Users
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/all-pets" className={navLinkClass}>
                    All Pets
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/all-donations" className={navLinkClass}>
                    All Donations
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <header className="bg-white shadow p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Dashboard</h1>
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
