import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router";
import useAuth from "../../Hooks/useAuth";
import DonateModal from "./DonateModal";
import RecommendedCampaigns from "./RecommendedCampaigns";
import { motion } from "framer-motion";

const stripePromise = loadStripe("pk_test_51RjPBvDBdSNx5Xmurq2HL8ywDEtcrKxHFSmozfi0ZHE6zoJEDVuCZrC2M2fsHNu4mVb8CMNwGcU3eu8KBCS3UkPX00XCIdl9h4");

const DonationDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: campaign, isLoading, error } = useQuery({
    queryKey: ["donationDetails", id],
    queryFn: async () => {
      const res = await axios.get(
        `https://pet-adoption-platform-server-side.vercel.app/donation-campaigns/${id}`
      );
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center animate-pulse">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error loading details.</p>;

  // handle donate button click
  const handleDonateClick = () => {
    if (!user) {
      alert("Please login to donate.");
      return;
    }
    setIsModalOpen(true);
  };

  // progress bar
  const progress = Math.min((campaign.donatedAmount / campaign.maxDonation) * 100, 100);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row gap-8 bg-white rounded-2xl shadow-lg p-4 sm:p-6"
      >
        {/* Pet Image */}
        <motion.img
          src={campaign.petImage}
          alt={campaign.petName}
          className="w-full md:w-1/2 rounded-xl object-cover max-h-[450px] shadow-md"
          whileHover={{ scale: 1.03 }}
        />

        {/* Details */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <motion.h2
            className="text-2xl sm:text-3xl font-extrabold mb-4"
            animate={{
              color: ["#1E3A8A", "#059669", "#DC2626", "#D97706", "#7C3AED"],
            }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
          >
            {campaign.petName}
          </motion.h2>

          <p className="text-gray-700 leading-relaxed">{campaign.description}</p>

          {/* Donation Info */}
          <div className="mt-6 space-y-2">
            <p className="font-semibold text-gray-900">
              Max Donation Goal: <span className="text-blue-600">${campaign.maxDonation}</span>
            </p>
            <p className="font-semibold text-green-700">
              Raised: ${campaign.donatedAmount}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                className="bg-green-500 h-4"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="text-sm text-gray-600">{progress.toFixed(1)}% funded</span>
          </div>

          {/* Donate Button */}
          <div className="mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDonateClick}
              disabled={!user}
              className={`px-6 py-2 rounded-lg text-white font-medium shadow-md transition ${
                user
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Donate Now
            </motion.button>
            {!user && (
              <p className="mt-2 text-red-600 text-sm">You must be logged in to donate.</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modal for Donation */}
      <Elements stripe={stripePromise}>
        <DonateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          campaignId={id}
        />
      </Elements>

      {/* Recommended Donations */}
      <div className="mt-12">
        <motion.h3
          className="text-xl sm:text-2xl font-bold mb-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          Recommended Donation Campaigns
        </motion.h3>
        <RecommendedCampaigns currentId={id} />
      </div>
    </div>
  );
};

export default DonationDetailsPage;
