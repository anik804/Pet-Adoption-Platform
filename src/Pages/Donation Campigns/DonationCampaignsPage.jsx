import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";

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
      {/* Animated Heading */}
      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-12 text-center"
        animate={{
          color: ["#FF0080", "#7928CA", "#FF0080"],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🌟 Support a Furry Friend Today! 🌟
      </motion.h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {status === "loading"
          ? Array(6)
              .fill()
              .map((_, idx) => (
                <div
                  key={idx}
                  className="border rounded-2xl shadow-lg bg-white p-4 flex flex-col justify-between"
                >
                  <Skeleton height={192} className="rounded-t-2xl" />
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
                <motion.div
                  key={campaign._id}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-gradient-to-br from-pink-50 via-white to-pink-100 border border-gray-200 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={campaign.petImage}
                      alt={campaign.petName}
                      className="w-full h-48 sm:h-56 md:h-60 lg:h-64 object-cover rounded-t-2xl"
                    />
                    <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs sm:text-sm px-2 py-1 rounded-full shadow">
                      {campaign.petName}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                    <div className="space-y-2">
                      <h2 className="text-lg sm:text-xl md:text-xl font-bold text-gray-800">
                        {campaign.petName}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Max Donation:{" "}
                        <span className="font-medium text-black">
                          ${campaign.maxDonation}
                        </span>
                      </p>
                      <p className="text-gray-600 text-sm">
                        Donated:{" "}
                        <span className="font-medium text-green-700">
                          ${campaign.donatedAmount}
                        </span>
                      </p>
                    </div>
                    <Link to={`/donation-campaigns/${campaign._id}`}>
                      <button className="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base">
                        View Details
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
      </div>

      {/* Observer / Loader */}
      <div ref={ref} className="text-center py-6">
        {isFetchingNextPage && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(3)
              .fill()
              .map((_, idx) => (
                <div
                  key={idx}
                  className="border rounded-2xl shadow-lg bg-white p-4 flex flex-col justify-between"
                >
                  <Skeleton height={192} className="rounded-t-2xl" />
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
