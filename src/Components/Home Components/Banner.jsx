import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { motion } from "framer-motion";

import pic1 from "../../assets/b1.jpg";
import pic2 from "../../assets/b2.jpg";
import pic3 from "../../assets/b3.jpg";
import pic4 from "../../assets/b4.jpg";
import pic5 from "../../assets/b5.jpg";

const bannerTextVariant = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
};

const Banner = () => {
  const images = [pic1, pic2, pic3, pic4, pic5];

  return (
    <div className="relative">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={4000}
      >
        {images.map((img, idx) => (
          <div key={idx} className="relative">
            <img src={img} className="h-[800px] w-full object-cover" />
            {/* Overlay content */}
            <div className="absolute inset-0 flex items-center justify-start px-6 md:px-16">
              <div className="max-w-xl text-left">
                <motion.h1
                  className="text-3xl md:text-6xl font-bold text-white"
                  variants={bannerTextVariant}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 1 }}
                >
                  <motion.span
                    animate={{
                      color: [
                        "#4B0082",
                        "#6A0DAD",
                        "#800000",
                        "#004d4d",
                        "#4B0082",
                      ],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    Your Future Fur-ever Friend Is Just a Click Away!
                  </motion.span>
                </motion.h1>

                <motion.p
                  className="mt-4 text-lg md:text-xl text-white"
                  variants={bannerTextVariant}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  From playful puppies to cuddly kittens, we’ve got the perfect
                  companion waiting to meet you. Start your adoption journey and
                  make a new memory today!
                </motion.p>

                <motion.div
                  className="mt-6"
                  variants={bannerTextVariant}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 1, duration: 1 }}
                >
                  <button className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-full shadow-md hover:bg-gray-100 transition duration-300">
                    Explore Now
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
