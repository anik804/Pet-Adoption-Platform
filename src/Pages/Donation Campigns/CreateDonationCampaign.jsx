import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '../../Hooks/useAuth';

const CreateDonationCampaign = () => {
  const { user } = useAuth();

  const [petName, setPetName] = useState(''); // ✅ New state
  const [petImage, setPetImage] = useState(null);
  const [maxDonation, setMaxDonation] = useState('');
  const [lastDate, setLastDate] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const CLOUDINARY_UPLOAD_PRESET = 'Pet-Adoption-User';
  const CLOUDINARY_CLOUD_NAME = 'dyyikpmpo';
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const handleImageChange = (e) => {
    setPetImage(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!petImage) {
      setError('Please select an image to upload.');
      return null;
    }
    const formData = new FormData();
    formData.append('file', petImage);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
      return response.data.secure_url;
    } catch {
      setError('Image upload failed. Please try again.');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const uploadedImageUrl = await uploadImage();
    if (!uploadedImageUrl) {
      setLoading(false);
      return;
    }

    const campaignData = {
      petName, // ✅ Include petName here
      petImage: uploadedImageUrl,
      maxDonation: Number(maxDonation),
      lastDate,
      shortDescription,
      longDescription,
      createdAt: new Date().toISOString(),
      userId: user?.uid,
    };

    try {
      const response = await axios.post('http://localhost:3000/donation-campaigns', campaignData);
      if (response.status === 201) {
        setSuccess('Donation campaign created successfully!');
        // Reset form
        setPetName(''); // ✅ Reset petName
        setPetImage(null);
        setMaxDonation('');
        setLastDate('');
        setShortDescription('');
        setLongDescription('');
      } else {
        setError('Failed to create donation campaign.');
      }
    } catch {
      setError('Failed to create donation campaign.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Create Donation Campaign</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pet Name Input */}
        <div>
          <label className="block mb-1 font-medium">Pet Name</label>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            maxLength={50}
            placeholder="Enter the pet's name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Pet Picture</label>
          <input type="file" accept="image/*" onChange={handleImageChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Maximum Donation Amount</label>
          <input
            type="number"
            min="1"
            value={maxDonation}
            onChange={(e) => setMaxDonation(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Last Date of Donation</label>
          <input
            type="date"
            value={lastDate}
            onChange={(e) => setLastDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Short Description</label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            maxLength={100}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Long Description</label>
          <textarea
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={5}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default CreateDonationCampaign;
