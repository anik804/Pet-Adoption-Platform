import React, { useState } from "react";
import { motion } from "framer-motion";
import useAuth from "../../Hooks/useAuth";
import { Link, useNavigate } from "react-router";
import { getAuth, updateProfile } from "firebase/auth";

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs uppercase tracking-wider text-gray-500">
      {label}
    </span>
    <span className="text-sm md:text-base font-semibold text-gray-800 break-all">
      {value || "—"}
    </span>
  </div>
);

const UserProfile = () => {
  const { user, role, logOut } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    photoURL: user?.photoURL || "",
  });

  // If not logged in
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">You’re not logged in</h2>
          <p className="text-gray-600 mb-6">
            Please log in to view your profile details.
          </p>
          <Link to="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const displayName = user.displayName || "Anonymous User";
  const email = user.email || "Not provided";
  const photoURL = user.photoURL;
  const createdAt = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleString()
    : "—";
  const lastLogin = user.metadata?.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleString()
    : "—";

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: formData.displayName,
          photoURL: formData.photoURL,
        });
        alert("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        className="rounded-2xl overflow-hidden shadow-xl bg-white"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Banner */}
        <div className="h-36 md:h-44 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-600" />

        {/* Profile block */}
        <div className="px-6 sm:px-8 -mt-14 md:-mt-16 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-2xl ring-4 ring-white shadow-lg overflow-hidden bg-gradient-to-br from-pink-100 to-indigo-100 grid place-items-center">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-gray-700">
                  {getInitials(displayName)}
                </span>
              )}
            </div>

            {/* Name + role */}
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="input input-bordered w-full max-w-xs"
                />
              ) : (
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  {displayName}
                </h1>
              )}
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                  {role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"}
                </span>
                {user.emailVerified && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    Email Verified
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 md:gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="btn btn-success btn-sm md:btn-md rounded-full"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn-outline btn-sm md:btn-md rounded-full"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary btn-sm md:btn-md rounded-full"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn btn-error btn-sm md:btn-md rounded-full text-white"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="mt-6 border-t border-gray-100" />

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <InfoRow label="Email" value={email} />
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <InfoRow
                label="Provider"
                value={user.providerData?.[0]?.providerId || "—"}
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <InfoRow label="User ID" value={user.uid} />
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <InfoRow label="Member Since" value={createdAt} />
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <InfoRow label="Last Login" value={lastLogin} />
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <InfoRow
                label="Phone"
                value={user.phoneNumber || "Not provided"}
              />
            </div>
            {isEditing && (
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-xs uppercase tracking-wider text-gray-500">
                  Profile Photo URL
                </label>
                <input
                  type="text"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-1"
                />
              </div>
            )}
          </div>

          {/* CTA row */}
          {!isEditing && (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/dashboard/my-added-pets"
                className="btn btn-soft btn-primary"
              >
                My Added Pets
              </Link>
              <Link
                to="/dashboard/my-donation-campaigns"
                className="btn btn-soft btn-secondary"
              >
                My Campaigns
              </Link>
              <Link
                to="/dashboard/my-donations"
                className="btn btn-soft btn-accent"
              >
                My Donations
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
