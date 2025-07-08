import React from "react";
import logo from "../../../assets/logo.png";
import { motion } from "framer-motion";
import MotionNavLink from "./MotionNavLink";
import { Link } from "react-router";


const Navbar = () => {
// const navItems = (
//   <>
//     <li className="font-bold">
//       <motion.div whileHover={{ scale: 1.1, color: "#399AC7FF" }} transition={{ type: "spring", stiffness: 300 }}>
//         <NavLink to="/">Home</NavLink>
//       </motion.div>
//     </li>
//     <li className="font-bold">
//       <motion.div whileHover={{ scale: 1.1, color: "#399AC7FF" }} transition={{ type: "spring", stiffness: 300 }}>
//         <NavLink to="/pets">Pet Listing</NavLink>
//       </motion.div>
//     </li>
//     <li className="font-bold">
//       <motion.div whileHover={{ scale: 1.1, color: "#399AC7FF" }} transition={{ type: "spring", stiffness: 300 }}>
//         <NavLink to="/donations">Donation Campaigns</NavLink>
//       </motion.div>
//     </li>
//   </>
// );
const navItems = (
  <>
    <li className="text-xl">
      <MotionNavLink to="/">Home</MotionNavLink>
    </li>
    <li className="text-xl">
      <MotionNavLink to="/pets">Pets</MotionNavLink>
    </li>
    <li className="text-xl">
      <MotionNavLink to="/donations">Donation Campaigns</MotionNavLink>
    </li>
  </>
);


  return (
    <div className="navbar bg-amber-400 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {navItems}
          </ul>
        </div>
        <div className="flex justify-center items-center gap-2">
          {/* <img src={logo} className="h-15 w-15" /> */}
          <motion.img
            src={logo}
            className="h-14 w-16"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div>
            <motion.h1
              className="font-bold text-2xl"
              animate={{ color: ["#1e293b", "#059669", "#be185d", "#1e293b"] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              PetHaven
            </motion.h1>
            <p className="text-gray-800">Adopt. Love. Repeat.</p>
          </div>
        </div>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>
      <div className="navbar-end">
        <Link to="register" className="btn btn-soft btn-warning">Register</Link>
        <Link to="login" className="btn btn-soft btn-success ml-4">Login</Link>
      </div>
    </div>
  );
};

export default Navbar;
