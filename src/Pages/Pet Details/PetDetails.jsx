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
      const res = await axios.get(`https://pet-adoption-platform-server-side.vercel.app/Pets/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center py-20">Loading...</p>;
  if (!pet) return <p className="text-center py-20 text-red-500 dark:text-red-400">Pet not found</p>;

  const isOwner = user?.uid === pet.userId;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <img
          src={pet.image || pet.petImage}
          alt={pet.name}
          className="w-full rounded-xl shadow-md"
        />
        <div>
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{pet.name}</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-semibold">Category:</span> {pet.category}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-semibold">Breed:</span> {pet.breed}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-semibold">Color:</span> {pet.color}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-semibold">Age:</span> {pet.age}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            <span className="font-semibold">Location:</span> {pet.location}
          </p>
          <p className="text-base text-gray-800 dark:text-gray-200 mb-4">
            <span className="font-semibold">Short Description:</span> {pet.shortDescription}
          </p>
          <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
            <h3 className="font-semibold text-lg mb-1">More About Me:</h3>
            <div dangerouslySetInnerHTML={{ __html: pet.longDescription }} />
          </div>
          <button
            className={`px-6 py-2 rounded ${
              isOwner
                ? "bg-gray-400 cursor-not-allowed"
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
            Adopt
          </button>
        </div>
      </div>

      {openModal && (
        <PetAdoptionModal pet={pet} user={user} onClose={() => setOpenModal(false)} />
      )}
    </div>
  );
};

export default PetDetails;
