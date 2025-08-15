import axios from "axios";
import { useState } from "react";
import AboutUs from "../../Components/Home Components/AboutUs";
import Banner from "../../Components/Home Components/Banner";
import CallToAction from "../../Components/Home Components/CallToAction";
import CategoryModal from "../../Components/Home Components/CategoryModal";
import HowYouCanHelp from "../../Components/Home Components/HowYouCanHelp";
import PetCategories from "../../Components/Home Components/PetCategories";
import SuccessStories from "../../Components/Home Components/SuccessStoriesSection";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryPets, setCategoryPets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
    setLoading(true);

    try {
      const res = await axios.get(
        `https://pet-adoption-platform-server-side.vercel.app/pets?category=${category}`
      );
      setCategoryPets(res.data.pets);
    } catch (err) {
      console.error("Failed to fetch pets by category", err);
      setCategoryPets([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Banner />
      <PetCategories onCategoryClick={handleCategoryClick} />
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        pets={
          loading
            ? Array(3).fill(null).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg shadow">
                  <Skeleton height={180} />
                  <Skeleton height={20} style={{ marginTop: 10 }} />
                  <Skeleton width="80%" />
                </div>
              ))
            : categoryPets
        }
      />
      <CallToAction />
      <AboutUs />
      <HowYouCanHelp />
      <SuccessStories />
    </div>
  );
};

export default Home;
