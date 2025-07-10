import React from "react";
import { FaCat, FaDog, FaFish, FaDove, FaFeatherAlt } from "react-icons/fa";
import { LuRabbit } from "react-icons/lu";

const categories = [
  { name: "cat", label: "Cats", icon: <FaCat /> },
  { name: "dog", label: "Dogs", icon: <FaDog /> },
  { name: "rabbit", label: "Rabbits", icon: <LuRabbit /> },
  { name: "fish", label: "Fish", icon: <FaFish /> },
  { name: "pigeon", label: "Pigeons", icon: <FaDove /> },
  { name: "bird", label: "Birds", icon: <FaFeatherAlt /> },
];

const PetCategories = ({ onCategoryClick }) => {
  return (
    <div className="py-8 max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-center mb-6">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onCategoryClick(cat.name)}
            className="flex flex-col items-center justify-center border rounded-lg p-4 shadow hover:shadow-md transition hover:bg-pink-100"
          >
            <div className="text-2xl mb-2">{cat.icon}</div>
            <span className="text-sm font-medium">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PetCategories;

