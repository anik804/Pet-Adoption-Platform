import React from "react";
import Lottie from "lottie-react";
import sadPetAnimation from "../../assets/sad-pet.json"; // <-- your Lottie JSON file here
import { Link } from "react-router";

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <div className="w-80 sm:w-96">
        <Lottie animationData={sadPetAnimation} loop={true} />
      </div>
      <h1 className="text-4xl font-bold mt-6 text-gray-700">Oops! Page not found.</h1>
      <p className="mt-2 text-gray-600 max-w-md text-center">
        Looks like this pet wandered off somewhere else. Let's bring you back home.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default Error;
