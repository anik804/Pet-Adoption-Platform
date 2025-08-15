import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PetListing from "./PetListing";

const Pets = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading (you can replace this with actual API fetching)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {Array(6)
            .fill()
            .map((_, index) => (
              <div key={index} className="p-4 border rounded-lg shadow-sm">
                <Skeleton height={200} />
                <Skeleton height={20} style={{ marginTop: 10 }} />
                <Skeleton height={15} count={2} />
                <Skeleton height={30} width={100} style={{ marginTop: 10 }} />
              </div>
            ))}
        </div>
      ) : (
        <PetListing />
      )}
    </div>
  );
};

export default Pets;
