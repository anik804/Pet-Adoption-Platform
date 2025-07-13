import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router";

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border px-4 py-2 rounded-md w-full sm:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border px-4 py-2 rounded-md w-full sm:w-1/4"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data?.pages.map((page) =>
          page.pets.map((pet) => (
            <div
              key={pet._id}
              className="border rounded-lg p-4 shadow hover:shadow-md"
            >
              <img
                src={pet.image || pet.petImage}
                alt={pet.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold">{pet.name}</h3>
              <p className="text-sm text-gray-600">Age: {pet.age}</p>
              <p className="text-sm text-gray-600">Location: {pet.location}</p>
              <button
                className="mt-3 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
                onClick={() => navigate(`/pets/${pet._id}`)}
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>

      {/* Loader / Observer */}
      <div ref={ref} className="mt-8 text-center">
        {isFetchingNextPage && <p>Loading more pets...</p>}
        {!hasNextPage && <p className="text-gray-500">No more pets to load.</p>}
      </div>
    </div>
  );
};

export default PetListing;
