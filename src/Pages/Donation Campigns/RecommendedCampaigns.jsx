import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const RecommendedCampaigns = ({ currentId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["recommendedCampaigns"],
    queryFn: async () => {
      const res = await axios.get("https://pet-adoption-platform-server-side.vercel.app/donation-campaigns?limit=10");
      return res.data.campaigns.filter((c) => c._id !== currentId).slice(0, 3);
    },
  });

  if (isLoading) return <p>Loading recommendations...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {data.map((campaign) => (
        <div key={campaign._id} className="border p-4 rounded shadow-md">
          <img
            src={campaign.petImage}
            alt={campaign.petName}
            className="w-full h-40 object-cover rounded mb-2"
          />
          <h4 className="text-lg font-semibold">{campaign.petName}</h4>
          <p className="text-sm">Donated: ${campaign.donatedAmount}</p>
        </div>
      ))}
    </div>
  );
};

export default RecommendedCampaigns;
