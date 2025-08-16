import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuth from "../../Hooks/useAuth";
import PetAdoptionModal from "./Pet Adoption Modal/PetAdoptionModal";

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const { user } = useAuth();

  const { data: pet, isLoading } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => {
      const res = await axios.get(
        `https://pet-adoption-platform-server-side.vercel.app/Pets/${id}`
      );
      return res.data;
    },
  });

  if (isLoading)
    return (
      <p className="text-center py-20 text-gray-500 dark:text-gray-400">
        Loading...
      </p>
    );
  if (!pet)
    return (
      <p className="text-center py-20 text-red-500 dark:text-red-400">
        Pet not found
      </p>
    );

  const isOwner = user?.uid === pet.userId;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Pet Image */}
        <div className="relative">
          <img
            src={pet.image || pet.petImage}
            alt={pet.name}
            className="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
          />
          <span className="absolute top-4 left-4 bg-pink-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
            {pet.category}
          </span>
        </div>

        {/* Pet Details */}
        <div className="p-6 md:p-8 flex flex-col">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {pet.name}
          </h2>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 text-sm sm:text-base">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Breed:</span> {pet.breed}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Color:</span> {pet.color}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Age:</span> {pet.age}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Location:</span> {pet.location}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-gray-800 dark:text-gray-200 text-base">
              <span className="font-semibold">Short Description:</span>{" "}
              {pet.shortDescription}
            </p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
              More About Me:
            </h3>
            <div dangerouslySetInnerHTML={{ __html: pet.longDescription }} />
          </div>

          {/* Adopt Button */}
          <div className="mt-auto">
            <button
              className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold shadow-md transition ${
                isOwner
                  ? "bg-gray-400 cursor-not-allowed text-gray-100"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              onClick={() => {
                if (!user) {
                  navigate("/login");
                } else if (!isOwner) {
                  setOpenModal(true);
                }
              }}
              disabled={isOwner}
              title={isOwner ? "You cannot adopt your own pet" : ""}
            >
              {isOwner ? "Owner (Cannot Adopt)" : "Adopt Me"}
            </button>
          </div>
        </div>
      </div>

      {/* Adoption Modal */}
      {openModal && (
        <PetAdoptionModal
          pet={pet}
          user={user}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default PetDetails;
