import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import DonateModal from "./DonateModal";
import RecommendedCampaigns from "./RecommendedCampaigns";
import useAuth from "../../Hooks/useAuth"; // Import your auth hook

const stripePromise = loadStripe("pk_test_51RjPBvDBdSNx5Xmurq2HL8ywDEtcrKxHFSmozfi0ZHE6zoJEDVuCZrC2M2fsHNu4mVb8CMNwGcU3eu8KBCS3UkPX00XCIdl9h4");

const DonationDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth(); // Get logged-in user info
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: campaign, isLoading, error } = useQuery({
    queryKey: ["donationDetails", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/donation-campaigns/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error loading details.</p>;

  // Function to handle donate button click
  const handleDonateClick = () => {
    if (!user) {
      alert("Please login to donate.");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={campaign.petImage}
          alt={campaign.petName}
          className="w-full md:w-1/2 rounded-lg object-cover max-h-[500px]"
        />
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold">{campaign.petName}</h2>
          <p className="mt-2 text-gray-700">{campaign.description}</p>
          <p className="mt-4 font-semibold">Max Donation: ${campaign.maxDonationAmount}</p>
          <p className="mb-6 font-semibold text-green-600">Donated: ${campaign.donatedAmount}</p>

          <button
            onClick={handleDonateClick}
            disabled={!user}
            className={`px-6 py-2 rounded-md text-white ${
              user ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Donate Now
          </button>
          {!user && (
            <p className="mt-2 text-red-600 text-sm">
              You must be logged in to donate.
            </p>
          )}
        </div>
      </div>

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
        <h3 className="text-2xl font-bold mb-6">Recommended Donation Campaigns</h3>
        <RecommendedCampaigns currentId={id} />
      </div>
    </div>
  );
};

export default DonationDetailsPage;
