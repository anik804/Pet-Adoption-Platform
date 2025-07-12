import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router"; // ✅ Import useNavigate

const CallToAction = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleAdoptClick = () => {
    navigate("/pets"); // ✅ Navigate to "/pets"
  };

  return (
    <motion.section
      className="py-16 px-6 w-11/12 md:w-3/4 mt-10 max-w-7xl mx-auto rounded-xl shadow-lg"
      initial={{ opacity: 2 }}
      animate={{
        opacity: 1,
        backgroundColor: [
          "#1e293b", "#312e81", "#1e40af", "#3b0764", "#1e293b",
        ],
      }}
      transition={{
        duration: 14,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    >
      <motion.h2
        className="text-4xl font-extrabold text-center mb-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{
          opacity: 1,
          y: 0,
          color: [
            "#AE63F9FF", "#e879f9", "#f472b6", "#38bdf8", "#c084fc"
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      >
        🐶 Give a Pet a Second Chance at Life
      </motion.h2>

      <motion.p
        className="text-lg text-gray-300 text-center max-w-2xl mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Every pet deserves a loving home. By adopting, you’re not just saving a life — you’re gaining a loyal companion who will change your world. Join us in making a difference today!
      </motion.p>

      {/* ✅ Button with Navigation */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <button
          onClick={handleAdoptClick} // ✅ Add click handler
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-md transition-colors duration-300"
        >
          Adopt Now
        </button>
      </motion.div>

      <motion.div
        className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center text-white font-medium"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
              delayChildren: 1,
            },
          },
        }}
      >
        {[ /* your animal cards here, unchanged */ ].map((animal, i) => (
          <motion.div
            key={i}
            className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i }}
          >
            <h3 className="text-2xl font-semibold mb-2 text-pink-300">
              {animal.title}
            </h3>
            <p className="text-gray-200 text-base">{animal.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default CallToAction;
