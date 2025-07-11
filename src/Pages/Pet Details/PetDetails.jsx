import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PetAdoptionModal from "./Pet Adoption Modal/PetAdoptionModal";
import useAuth from "../../Hooks/useAuth";

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const { user } = useAuth();

  const { data: pet, isLoading } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/Pets/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center py-20">Loading...</p>;
  if (!pet) return <p className="text-center py-20 text-red-500">Pet not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <img
          src={pet.image || pet.petImage}
          alt={pet.name}
          className="w-full rounded-xl shadow-md"
        />
        <div>
          <h2 className="text-4xl font-bold mb-4">{pet.name}</h2>
          <p className="text-lg text-gray-700 mb-2">
            <span className="font-semibold">Category:</span> {pet.category}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <span className="font-semibold">Breed:</span> {pet.breed}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <span className="font-semibold">Color:</span> {pet.color}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <span className="font-semibold">Age:</span> {pet.age}
          </p>
          <p className="text-lg text-gray-700 mb-4">
            <span className="font-semibold">Location:</span> {pet.location}
          </p>
          <p className="text-base text-gray-800 mb-6">{pet.description}</p>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            onClick={() => {
              if (!user) {
                navigate("/login");
              } else {
                setOpenModal(true);
              }
            }}
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
