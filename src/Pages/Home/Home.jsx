import axios from "axios";
import { useState } from "react";
import AboutUs from "../../Components/Home Components/AboutUs";
import Banner from "../../Components/Home Components/Banner";
import CallToAction from "../../Components/Home Components/CallToAction";
import CategoryModal from "../../Components/Home Components/CategoryModal";
import HowYouCanHelp from "../../Components/Home Components/HowYouCanHelp";
import PetCategories from "../../Components/Home Components/PetCategories";
import SuccessStories from "../../Components/Home Components/SuccessStoriesSection";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryPets, setCategoryPets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);

    try {
      const res = await axios.get(
        `https://pet-adoption-platform-server-side.vercel.app/pets?category=${category}`
      );
      setCategoryPets(res.data.pets);
    } catch (err) {
      console.error("Failed to fetch pets by category", err);
      setCategoryPets([]);
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
        pets={categoryPets}
      />
      <CallToAction />
      <AboutUs />
      <HowYouCanHelp />
      <SuccessStories />
    </div>
  );
};

export default Home;
