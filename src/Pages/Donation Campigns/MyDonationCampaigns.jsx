import axios from "axios";
import { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { motion } from "framer-motion";

const MyDonationCampaigns = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.uid) return;
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://pet-adoption-platform-server-side.vercel.app/donation-campaigns/user/${user.uid}`
        );
        setCampaigns(res.data);
      } catch {
        setError("Failed to load your donation campaigns.");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [user]);

  if (loading) return <div>Loading your donation campaigns...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-4 sm:p-6">
      <motion.h2
        className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.span
          animate={{
            color: ["#1E3A8A", "#059669", "#DC2626", "#D97706", "#7C3AED"],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        >
          My Donation Campaigns
        </motion.span>
      </motion.h2>

      {campaigns.length === 0 ? (
        <p>You have not created any donation campaigns yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-2 sm:px-4 py-2">Pet Name</th>
                <th className="border px-2 sm:px-4 py-2">
                  Max Donation Amount
                </th>
                <th className="border px-2 sm:px-4 py-2">Donation Progress</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => {
                const progress = Math.min(
                  (campaign.donatedAmount / campaign.maxDonation) * 100,
                  100
                );
                return (
                  <tr
                    key={campaign._id}
                    className="hover:bg-gray-50 text-xs sm:text-sm"
                  >
                    <td className="border px-2 sm:px-4 py-2">
                      {campaign.petName || "N/A"}
                    </td>
                    <td className="border px-2 sm:px-4 py-2">
                      ${campaign.maxDonation}
                    </td>
                    <td className="border px-2 sm:px-4 py-2 w-40 sm:w-64">
                      <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                        <div
                          className="bg-green-500 h-3 sm:h-4 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] sm:text-sm">
                        {progress.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyDonationCampaigns;
