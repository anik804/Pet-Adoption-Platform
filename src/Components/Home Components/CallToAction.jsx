import React from "react";
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <motion.section
      className="py-16 px-6 w-11/12 md:w-3/4 mt-10 max-w-7xl mx-auto rounded-xl shadow-lg"
      initial={{ opacity: 2 }}
      animate={{
        opacity: 1,
        backgroundColor: [
          "#1e293b", // slate-800
          "#312e81", // indigo-900
          "#1e40af", // blue-900
          "#3b0764", // violet-900
          "#1e293b", // slate-800
        ],
      }}
      transition={{
        duration: 14,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    >
      {/* Animated Heading */}
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

      {/* Paragraph */}
      <motion.p
        className="text-lg text-gray-300 text-center max-w-2xl mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Every pet deserves a loving home. By adopting, you’re not just saving a life — you’re gaining a loyal companion who will change your world. Join us in making a difference today!
      </motion.p>

      {/* Button */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <button
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-md transition-colors duration-300"
        >
          Adopt Now
        </button>
      </motion.div>

      {/* Inspirational Animal Cards */}
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
        {[
          {
            title: "🐱 Cats",
            text: "Soft paws and quiet love — adopt a cat and bring peace to your home.",
          },
          {
            title: "🐶 Dogs",
            text: "Loyal, loving, and full of joy — a dog is not just a pet, it's family.",
          },
          {
            title: "🐰 Rabbits",
            text: "Gentle and curious, rabbits make sweet companions for calm hearts.",
          },
          {
            title: "🐦 Birds",
            text: "Their songs brighten mornings — rescue a bird and feel the melody of life.",
          },
          {
            title: "🕊️ Pigeons",
            text: "Often overlooked, pigeons are smart, loyal, and full of gentle charm.",
          },
          {
            title: "🐟 Fish",
            text: "Graceful and calming, fish bring serenity to your home and heart. Rescue a tank full of peace.",
          },
        ].map((animal, i) => (
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
