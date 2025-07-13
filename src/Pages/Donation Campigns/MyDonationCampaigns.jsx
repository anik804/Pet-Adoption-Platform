import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../../Hooks/useAuth";

const MyDonationCampaigns = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://pet-adoption-platform-server-side.vercel.app/donation-campaigns/user/${user.uid}`);
        setCampaigns(res.data);
    } catch {
      setError("Failed to load your donation campaigns.");
    } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [user]);

  const togglePause = async (campaign) => {
    try {
      await axios.patch(`https://pet-adoption-platform-server-side.vercel.app/donation-campaigns/${campaign._id}/pause`, {
        paused: !campaign.paused,
      });
      setCampaigns((prev) =>
        prev.map((c) =>
          c._id === campaign._id ? { ...c, paused: !c.paused } : c
        )
      );
    } catch {
      alert("Failed to update campaign status.");
    }
  };

  const openDonatorsModal = (campaign) => {
    setSelectedCampaign(campaign);
    setModalOpen(true);
  };

  const closeDonatorsModal = () => {
    setSelectedCampaign(null);
    setModalOpen(false);
  };

  if (loading) return <div>Loading your donation campaigns...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Donation Campaigns</h2>
      {campaigns.length === 0 ? (
        <p>You have not created any donation campaigns yet.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Pet Name</th>
              <th className="border px-4 py-2 text-left">Max Donation Amount</th>
              <th className="border px-4 py-2 text-left">Donation Progress</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => {
              const progress = Math.min(
                (campaign.donatedAmount / campaign.maxDonation) * 100,
                100
              );
              return (
                <tr key={campaign._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{campaign.petName || "N/A"}</td>
                  <td className="border px-4 py-2">${campaign.maxDonation}</td>
                  <td className="border px-4 py-2 w-64">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{progress.toFixed(1)}%</span>
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => togglePause(campaign)}
                      className={`px-3 py-1 rounded text-white ${
                        campaign.paused ? "bg-yellow-500" : "bg-red-600"
                      }`}
                    >
                      {campaign.paused ? "Unpause" : "Pause"}
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/edit-donation/${campaign._id}`)}
                      className="px-3 py-1 rounded bg-blue-600 text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDonatorsModal(campaign)}
                      className="px-3 py-1 rounded bg-gray-600 text-white"
                    >
                      View Donators
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {modalOpen && selectedCampaign && (
        <ViewDonatorsModal
          isOpen={modalOpen}
          onClose={closeDonatorsModal}
          campaign={selectedCampaign}
        />
      )}
    </div>
  );
};

export default MyDonationCampaigns;
