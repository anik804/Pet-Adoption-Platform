import React from "react";
import logo from "../../../assets/logo.png";
import { motion } from "framer-motion";

const LogoSection = () => {
  return (
    <div className="border-2 border-gray-300 p-5 rounded-lg flex items-center gap-2">
      <motion.img
        src={logo}
        alt="PetHaven Logo"
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
      <div className="leading-5">
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
        <p className="text-gray-800 text-sm">Adopt. Love. Repeat.</p>
      </div>
    </div>
  );
};

export default LogoSection;
