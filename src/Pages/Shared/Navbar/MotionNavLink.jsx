import { NavLink } from "react-router"; // ✅ use react-router-dom
import { motion } from "framer-motion";

const MotionNavLink = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? "font-bold underline" : "font-bold"
      }
    >
      {({ isActive }) => (
        <motion.span
          whileHover={{
            scale: 1.1,
            textShadow: "0px 0px 6px rgba(186, 230, 253, 0.9)",
          }}
          animate={{
            color: isActive
              ? ["#4B0082", "#6A0DAD", "#800000", "#004d4d", "#4B0082"] // purple shades
              : ["#7f1d1d", "#991b1b", "#7f1d1d"], // red shades for inactive
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {children}
        </motion.span>
      )}
    </NavLink>
  );
};

export default MotionNavLink;
