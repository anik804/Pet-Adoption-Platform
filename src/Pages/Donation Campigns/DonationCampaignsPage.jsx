import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const fetchCampaigns = async ({ pageParam = 1 }) => {
  const res = await axios.get(
    `https://pet-adoption-platform-server-side.vercel.app/donation-campaigns?page=${pageParam}&limit=6`
  );
  return res.data;
};

const DonationCampaignsPage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["donation-campaigns"],
    queryFn: fetchCampaigns,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) return allPages.length + 1;
      return undefined;
    },
  });

  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage) fetchNextPage();
    },
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Donation Campaigns</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {status === "loading"
          ? // Skeleton placeholders for initial loading
            Array(6)
              .fill()
              .map((_, idx) => (
                <div
                  key={idx}
                  className="border rounded-xl shadow-md bg-white p-4 flex flex-col justify-between"
                >
                  <Skeleton height={192} /> {/* Image skeleton */}
                  <div className="mt-4 space-y-2">
                    <Skeleton height={20} width="80%" />
                    <Skeleton height={16} width="60%" />
                    <Skeleton height={16} width="50%" />
                    <Skeleton height={36} width="100%" />
                  </div>
                </div>
              ))
          : data?.pages?.map((page) =>
              page.campaigns?.map((campaign) => (
                <div
                  key={campaign._id}
                  className="border rounded-xl shadow-md bg-white p-4 flex flex-col justify-between"
                >
                  <img
                    src={campaign.petImage}
                    alt={campaign.petName}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="mt-4">
                    <h2 className="text-xl font-semibold">{campaign.petName}</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Max Donation:{" "}
                      <span className="font-medium text-black">${campaign.maxDonation}</span>
                    </p>
                    <p className="text-gray-600 text-sm">
                      Donated:{" "}
                      <span className="font-medium text-green-700">${campaign.donatedAmount}</span>
                    </p>
                    <Link to={`/donation-campaigns/${campaign._id}`}>
                      <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            )}
      </div>

      <div ref={ref} className="text-center py-6">
        {isFetchingNextPage && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array(3)
              .fill()
              .map((_, idx) => (
                <div
                  key={idx}
                  className="border rounded-xl shadow-md bg-white p-4 flex flex-col justify-between"
                >
                  <Skeleton height={192} />
                  <div className="mt-4 space-y-2">
                    <Skeleton height={20} width="80%" />
                    <Skeleton height={16} width="60%" />
                    <Skeleton height={16} width="50%" />
                    <Skeleton height={36} width="100%" />
                  </div>
                </div>
              ))}
          </div>
        )}
        {!hasNextPage && status !== "loading" && (
          <p className="text-gray-500">No more campaigns to load.</p>
        )}
      </div>
    </div>
  );
};

export default DonationCampaignsPage;
