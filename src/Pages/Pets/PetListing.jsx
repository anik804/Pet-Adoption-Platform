import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

const fetchPets = async ({ pageParam = 1, queryKey }) => {
  const [_key, { search, category }] = queryKey;
  const res = await axios.get(
    `https://pet-adoption-platform-server-side.vercel.app/pets?page=${pageParam}&limit=9&search=${search}&category=${category}`
  );
  return res.data;
};

const PetListing = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["pets", { search, category }],
    queryFn: fetchPets,
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.total;
      const loaded = allPages.flatMap((p) => p.pets).length;
      return loaded < total ? allPages.length + 1 : undefined;
    },
  });

  const { ref } = useInView({
    threshold: 1,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 120 },
    }),
    hover: { scale: 1.05, boxShadow: "0px 15px 25px rgba(0,0,0,0.2)" },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border px-4 py-2 rounded-lg w-full sm:w-1/3 shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border px-4 py-2 rounded-lg w-full sm:w-1/4 shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none transition"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="cat">Cats</option>
          <option value="dog">Dogs</option>
          <option value="fish">Fish</option>
          <option value="rabbit">Rabbits</option>
          <option value="pigeon">Pigeons</option>
          <option value="bird">Birds</option>
        </select>
      </div>

      {/* Pet Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {data?.pages.map((page) =>
          page.pets.map((pet, i) => (
            <motion.div
              key={pet._id}
              custom={i}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={cardVariants}
              className="bg-gradient-to-b from-pink-50 to-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer"
            >
              <div className="relative">
                <img
                  src={pet.image || pet.petImage}
                  alt={pet.name}
                  className="w-full h-56 object-cover rounded-t-xl"
                />
                <span className="absolute top-2 right-2 bg-pink-600 text-white text-xs px-2 py-1 rounded-full shadow">
                  {pet.category || "Pet"}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{pet.name}</h3>
                <p className="text-sm text-gray-500 mb-2">Age: {pet.age}</p>
                <p className="text-sm text-gray-500 mb-4">Location: {pet.location}</p>
                <button
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg transition duration-300"
                  onClick={() => navigate(`/pets/${pet._id}`)}
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Loader / Observer */}
      <div ref={ref} className="mt-8 text-center">
        {isFetchingNextPage && <p className="text-gray-500">Loading more pets...</p>}
        {!hasNextPage && <p className="text-gray-400">No more pets to load.</p>}
      </div>
    </div>
  );
};

export default PetListing;
