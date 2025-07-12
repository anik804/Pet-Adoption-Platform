import React from "react";
import { Dialog } from "@headlessui/react";

const CategoryModal = ({ isOpen, onClose, category, pets }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white max-w-3xl w-full rounded-lg p-6 overflow-y-auto max-h-[90vh]">
          <Dialog.Title className="text-xl font-bold mb-4 capitalize">
            {category} for Adoption
          </Dialog.Title>
          <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-red-500">
            ✕
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pets.length === 0 ? (
              <p>No pets found in this category.</p>
            ) : (
              pets.map((pet) => (
                <div key={pet._id} className="border p-3 rounded shadow">
                  <img src={pet.image || pet.petImage} alt={pet.name} className="w-full h-40 object-cover rounded" />
                  <h3 className="text-lg font-semibold mt-2">{pet.name}</h3>
                  <p className="text-sm text-gray-600">Age: {pet.age}</p>
                  <p className="text-sm text-gray-600">Location: {pet.location}</p>
                </div>
              ))
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CategoryModal;
