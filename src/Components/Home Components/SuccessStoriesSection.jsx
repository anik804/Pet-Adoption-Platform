import React from "react";
import { motion } from "framer-motion";

import story1 from "../../assets/s1.jpg"; // Replace with your actual image paths
import story2 from "../../assets/s2.jpg";
import story3 from "../../assets/s3.jpg";

const stories = [
  {
    name: "Bella the Beagle",
    story:
      "Bella was rescued from the streets and found a loving home where she now enjoys daily walks and warm cuddles.",
    image: story1,
  },
  {
    name: "Milo the Cat",
    story:
      "Milo was abandoned as a kitten but was adopted by a kind family. He now rules the house and brings joy every day.",
    image: story2,
  },
  {
    name: "Snowy the Rabbit",
    story:
      "Snowy was sick and malnourished. Thanks to donations and care, he recovered and now hops happily in a cozy home.",
    image: story3,
  },
];

const SuccessStories = () => {
  return (
    <motion.section
      className="max-w-7xl mb-4 mx-auto py-16 px-6 shadow-xl mt-10"
      initial={{ opacity: 1 }}
      animate={{
        backgroundColor: [
          "#1f2937", // slate-800
          "#4b5563", // gray-700
          "#334155", // slate-700
          "#1e3a8a", // blue-900
          "#1f2937",
        ],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    >
      {/* Heading */}
      <motion.h2
        className="text-4xl font-extrabold text-center mb-8 text-white"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🐾 Happy Tails: Lives You Changed
      </motion.h2>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
        {stories.map((story, i) => (
          <motion.div
            key={i}
            className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-5 hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.3 }}
          >
            <img
              src={story.image}
              alt={story.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-pink-300 mb-2">{story.name}</h3>
            <p className="text-gray-200">{story.story}</p>
          </motion.div>
        ))}
      </div>

      {/* Button */}
      <motion.div
        className="mt-10 flex justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-md transition-colors duration-300"
          onClick={() => alert("Navigate to Share Your Story form!")}
        >
          Share Your Story
        </button>
      </motion.div>
    </motion.section>
  );
};

export default SuccessStories;
