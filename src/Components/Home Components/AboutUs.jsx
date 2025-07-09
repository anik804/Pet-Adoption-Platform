import React from "react";
import { motion } from "framer-motion";
import aboutImage from "../../assets/about_us.jpg"; // your image path

const AboutUs = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Main heading for the whole section */}
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-gray-900"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🐾 About Us
      </motion.h1>

      {/* Flex container for image and text */}
      <div className="flex flex-col md:flex-row w-3/4 mx-auto items-center justify-between gap-10">
        {/* Left Image */}
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={aboutImage}
            alt="About Us"
            className="w-full rounded-2xl shadow-lg"
          />
        </motion.div>

        {/* Right Text Section with Dark Background */}
        <motion.div
          className="w-full md:w-1/2 bg-slate-800 text-gray-100 p-8 rounded-2xl shadow-lg"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-pink-300">
            Our Mission & Commitment
          </h2>

          <p className="text-lg leading-relaxed">
            At <span className="font-semibold text-white">PetHaven</span>, we believe every animal deserves a loving home and a second chance at life.
            Our mission is to connect kind-hearted people with pets who are looking for families. Whether you're looking to <span className="text-white font-medium">adopt a companion</span>, <span className="text-white font-medium">put a pet up for adoption</span>, or <span className="text-white font-medium">donate to help animals in need</span> — you're part of something meaningful.
          </p>

          <p className="mt-4 text-lg leading-relaxed">
            Donations on our platform go directly to pets that are sick, injured, or suffering. With your support, we can provide food, shelter, and medical care for these animals and ensure they receive the love and attention they deserve.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
