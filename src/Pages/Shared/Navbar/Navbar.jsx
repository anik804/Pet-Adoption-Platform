import React from "react";
import { Link, useNavigate } from "react-router"; // ✅ Fix import
import logo from "../../../assets/logo.png";
import MotionNavLink from "./MotionNavLink";
import ThemeToggleButton from "../../../Context/Theme Context/ThemeToggleButton";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Logout Successful",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  const navItems = (
    <>
      <li>
        <MotionNavLink to="/">Home</MotionNavLink>
      </li>
      <li>
        <MotionNavLink to="/pets">Pets</MotionNavLink>
      </li>
      <li>
        <MotionNavLink to="/donation-campaigns">Donation Campaigns</MotionNavLink>
      </li>
    </>
  );

  return (
    <div className="navbar bg-amber-400 shadow-sm px-4">
      {/* Navbar Start: Logo + Mobile Dropdown */}
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <button tabIndex={0} className="btn btn-ghost" aria-label="Menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {navItems}
          </ul>
        </div>

        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2 ml-2">
          <motion.img
            src={logo}
            alt="PetHaven Logo"
            className="h-14 w-14"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div>
            <motion.h1
              className="font-bold text-2xl"
              animate={{ color: ["#1e293b", "#059669", "#be185d", "#1e293b"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              PetHaven
            </motion.h1>
            <p className="text-sm text-gray-800 -mt-1">Adopt. Love. Repeat.</p>
          </div>
        </Link>
      </div>

      {/* Navbar Center: Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2">{navItems}</ul>
      </div>

      {/* Navbar End: Theme, Auth Buttons */}
      <div className="navbar-end space-x-2">
        <ThemeToggleButton />
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src={user.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                />
              </div>
            </div>
            <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a onClick={() => navigate("/dashboard/add-pet")}>Dashboard</a>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <Link to="/register" className="btn btn-sm btn-warning">Register</Link>
            <Link to="/login" className="btn btn-sm btn-success">Login</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
