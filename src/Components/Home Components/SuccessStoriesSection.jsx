import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/Auth Context/AuthContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SuccessStories = () => {
  const { user } = useContext(AuthContext);
  const [stories, setStories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    story: "",
    image: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchingStories, setFetchingStories] = useState(true);

  // Fetch stories from backend
  useEffect(() => {
    fetch("https://pet-adoption-platform-server-side.vercel.app/success-stories")
      .then((res) => res.json())
      .then((data) => setStories(data))
      .catch(() => setStories([]))
      .finally(() => setFetchingStories(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.story) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://pet-adoption-platform-server-side.vercel.app/success-stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          name: formData.name,
          story: formData.story,
          image: formData.image || null
        })
      });
      if (!response.ok) throw new Error("Failed to submit story");
      const result = await response.json();
      setStories((prev) => [
        {
          _id: result.storyId,
          userId: user.uid,
          name: formData.name,
          story: formData.story,
          image: formData.image || null,
          date: new Date().toISOString()
        },
        ...prev
      ]);
      setShowForm(false);
      setFormData({ name: user.displayName || "", story: "", image: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className="max-w-7xl mb-4 mx-auto py-16 px-6 shadow-xl mt-10"
      initial={{ opacity: 1 }}
      animate={{
        backgroundColor: [
          "#1f2937", "#4b5563", "#334155", "#1e3a8a", "#1f2937",
        ],
      }}
      transition={{ duration: 18, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
    >
      <motion.h2
        className="text-4xl font-extrabold text-center mb-8 text-white"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🐾 Happy Tails: Lives You Changed
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
        {fetchingStories
          ? Array(6)
              .fill()
              .map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Skeleton height={180} className="mb-4" />
                  <Skeleton height={20} width="60%" className="mb-2" />
                  <Skeleton count={3} height={15} />
                </motion.div>
              ))
          : stories.map((story, i) => (
              <motion.div
                key={story._id || i}
                className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-5 hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.3 }}
              >
                {story.image && (
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold text-pink-300 mb-2">{story.name}</h3>
                <p className="text-gray-200">{story.story}</p>
              </motion.div>
            ))}
      </div>

      {/* Share Story Button */}
      <motion.div
        className="mt-10 flex justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {user ? (
          <>
            <button
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-md transition-colors duration-300"
              onClick={() => setShowForm(true)}
            >
              Share Your Story
            </button>
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
                  <h3 className="text-white text-2xl mb-4">Share Your Story</h3>
                  <form onSubmit={handleSubmit}>
                    <label className="block mb-2 text-white font-semibold">
                      Name
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded mt-1 text-black"
                        required
                      />
                    </label>
                    <label className="block mb-2 text-white font-semibold">
                      Story
                      <textarea
                        name="story"
                        value={formData.story}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded mt-1 text-black"
                        rows="4"
                        required
                      />
                    </label>
                    <label className="block mb-4 text-white font-semibold">
                      Image URL (optional)
                      <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded mt-1 text-black"
                      />
                    </label>
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                        onClick={() => {
                          setShowForm(false);
                          setError(null);
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded"
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        ) : (
          <button
            className="bg-gray-500 cursor-not-allowed text-white font-semibold py-3 px-8 rounded-md transition-colors duration-300"
            disabled
            title="Please log in to share your story"
          >
            Share Your Story
          </button>
        )}
      </motion.div>
    </motion.section>
  );
};

export default SuccessStories;
