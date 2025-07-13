import axios from "axios";
import { useState } from "react";

const AdoptModal = ({ pet, user, onClose }) => {
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const adoptionData = {
      petId: pet._id,
      petName: pet.name,
      petImage: pet.image,
      userName: user.displayName,
      userEmail: user.email,
      phone: formData.phone,
      address: formData.address,
      date: new Date(),
    };

    try {
      await axios.post("https://pet-adoption-platform-server-side.vercel.app/adoptions", adoptionData);
      alert("Adoption request submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Adoption failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-xl relative">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Adopt {pet.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info */}
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              value={user.displayName}
              disabled
              className="w-full border px-4 py-2 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border px-4 py-2 rounded bg-gray-100"
            />
          </div>

          {/* Pet Info (not editable, not shown in form fields) */}

          {/* Phone */}
          <div>
            <label className="block font-medium mb-1">Phone Number</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full border px-4 py-2 rounded"
              placeholder="Your contact number"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block font-medium mb-1">Address</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full border px-4 py-2 rounded"
              placeholder="Your address"
            />
          </div>

          {/* Submit & Cancel */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Submit Request
            </button>
            <button
              type="button"
              className="text-red-500 font-semibold hover:underline"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptModal;
