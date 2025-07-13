import axios from "axios";
import { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";

const MyDonations = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user?.uid) return;

      try {
        const res = await axios.get(`https://pet-adoption-platform-server-side.vercel.app/donations/user/${user.uid}`);
        setDonations(res.data);
      } catch (error) {
        console.error("Failed to fetch donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user?.uid]);

  if (loading) return <div className="text-center mt-10">Loading your donations...</div>;

  if (!donations.length) return <div className="text-center mt-10">No donations made yet.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Donations</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {donations.map((donation) => (
          <div
            key={donation._id}
            className="bg-white shadow-lg rounded-xl overflow-hidden border"
          >
            {donation.petImage && (
              <img
                src={donation.petImage}
                alt={donation.petName}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">
                {donation.petName || "Donation Campaign"}
              </h3>
              <p className="text-gray-700">Amount: <strong>${donation.amount}</strong></p>
              <p className="text-gray-500 text-sm">Date: {new Date(donation.date).toLocaleDateString()}</p>
              <p className="text-gray-400 text-xs">Donation ID: {donation._id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDonations;
