import axios from "axios";
import { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { motion } from "framer-motion";

const MyDonations = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user?.uid) return;

      try {
        const res = await axios.get(
          `https://pet-adoption-platform-server-side.vercel.app/donations/user/${user.uid}`
        );
        setDonations(res.data);
      } catch (error) {
        console.error("Failed to fetch donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user?.uid]);

  if (loading)
    return (
      <div className="text-center mt-20 text-lg font-medium animate-pulse">
        Loading your donations...
      </div>
    );

  if (!donations.length)
    return (
      <div className="text-center mt-20 text-gray-600 text-lg">
        You haven’t made any donations yet.
      </div>
    );

  return (
    <div className="container mx-auto p-4 sm:p-6">
      {/* Heading */}
      <motion.h2
        className="text-2xl sm:text-3xl font-bold mb-8 text-center"
        animate={{
          color: ["#1E3A8A", "#059669", "#DC2626", "#D97706", "#7C3AED"],
        }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
      >
        My Donations
      </motion.h2>

      {/* Donations Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {donations.map((donation, index) => (
          <motion.div
            key={donation._id}
            className="bg-white shadow-lg rounded-2xl overflow-hidden border hover:shadow-2xl transition-shadow"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            {/* Image */}
            {donation.petImage && (
              <motion.img
                src={donation.petImage}
                alt={donation.petName}
                className="w-full h-48 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
            )}

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {donation.petName || "Donation Campaign"}
              </h3>
              <p className="text-gray-700 mb-1">
                Amount Donated:{" "}
                <span className="font-bold text-green-600">
                  ${donation.amount}
                </span>
              </p>
              <p className="text-gray-500 text-sm mb-1">
                Date: {new Date(donation.date).toLocaleDateString()}
              </p>
              <p className="text-gray-400 text-xs truncate">
                Donation ID: {donation._id}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyDonations;
