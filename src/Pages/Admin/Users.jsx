import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import useAuth from "../../Hooks/useAuth";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://pet-adoption-platform-server-side.vercel.app/users"
      );
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleMakeAdmin = async (userId) => {
    try {
      const response = await fetch(
        `https://pet-adoption-platform-server-side.vercel.app/users/${userId}/admin`,
        {
          method: "PATCH",
        }
      );
      if (response.ok) {
        alert("User promoted to admin successfully");
        fetchUsers();
      } else {
        alert("Failed to promote user to admin");
      }
    } catch (error) {
      console.error("Error promoting user:", error);
      alert("Error promoting user to admin");
    }
  };

  // Skeleton Loader
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-center animate-pulse">
      <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600 mb-4"></div>
      <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
      <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/dashboard/profile")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Animated Heading */}
      <motion.h2
        className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.span
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent inline-block bg-[length:200%_200%]"
        >
          Users Management
        </motion.span>
      </motion.h2>

      {/* Users Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : users.map((u) => (
              <div
                key={u._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition"
              >
                <img
                  src={u.photoURL || "https://via.placeholder.com/100"}
                  alt={u.displayName || "User"}
                  className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700 mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {u.displayName || "Unnamed User"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 break-all mb-2">
                  {u.email}
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                    u.role === "admin"
                      ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {u.role || "user"}
                </span>

                {u.role !== "admin" ? (
                  <button
                    onClick={() => handleMakeAdmin(u._id)}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition"
                  >
                    Make Admin
                  </button>
                ) : (
                  <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                    ✅ Admin
                  </span>
                )}
              </div>
            ))}
      </div>
    </div>
  );
};

export default Users;
