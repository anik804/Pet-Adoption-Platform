import React from "react";
import { motion } from "framer-motion";

const helpOptions = [
  {
    title: "Volunteer",
    description: "Give your time and love to help care for pets.",
    icon: (
      <svg
        className="w-10 h-10 text-green-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 12l9 4.5-9 4.5-9-4.5 9-4.5z" />
        <path d="M12 12V3" />
      </svg>
    ),
  },
  {
    title: "Donate",
    description: "Support pets with medical care, food, and shelter.",
    icon: (
      <svg
        className="w-10 h-10 text-green-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
  {
    title: "Foster",
    description: "Provide a temporary loving home for pets in need.",
    icon: (
      <svg
        className="w-10 h-10 text-green-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M20 12H4" />
        <path d="M12 4v16" />
      </svg>
    ),
  },
  {
    title: "Share",
    description: "Spread the word to help more pets find homes.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 8a3 3 0 11-2.83-2H9a3 3 0 110-2h3.17a3 3 0 112.83 2zM8 16v2a2 2 0 002 2h4a2 2 0 002-2v-2"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M16 12h.01"
        />
      </svg>
    ),
  },
];

const HowYouCanHelp = () => {
  return (
    <motion.section
      className="max-w-7xl w-3/4 mx-auto px-6 py-16 rounded-xl shadow-md mb-4"
      initial={{ opacity: 4 }}
      animate={{
        opacity: 1,
        backgroundColor: [
          "#0f172a", // slate-900
          "#1e293b", // slate-800
          "#111827", // gray-900
          "#1e293b",
          "#0f172a",
        ],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    >
      <motion.h2
        className="text-4xl font-extrabold text-center mb-10 text-green-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🤝 How You Can Help
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center text-white font-medium">
        {helpOptions.map(({ title, description, icon }, i) => (
          <motion.div
            key={title}
            className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.3 }}
          >
            <div className="flex justify-center mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-300">{description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default HowYouCanHelp;
