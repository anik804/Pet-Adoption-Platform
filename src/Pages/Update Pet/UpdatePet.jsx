import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import AddPetForm from "../Add Pet/AddPetForm";

function UpdatePet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/pets/${id}`);
        const pet = res.data;
        setInitialValues({
          petImage: pet.petImage || pet.petImage || "",
          petName: pet.name || "",
          petAge: pet.age || "",
          petCategory: pet.category ? { value: pet.category, label: pet.category.charAt(0).toUpperCase() + pet.category.slice(1) } : null,
          petLocation: pet.location || "",
          shortDescription: pet.shortDescription || "",
          longDescription: pet.longDescription || "",
        });
      } catch (error) {
        setErrorMsg("Failed to fetch pet data");
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  const handleUpdate = async (values) => {
    try {
      await axios.patch(`http://localhost:3000/pets/${id}`, {
        petImage: values.petImage,
        petName: values.petName,
        petAge: Number(values.petAge),
        petCategory: values.petCategory.value,
        petLocation: values.petLocation,
        shortDescription: values.shortDescription,
        longDescription: values.longDescription,
      });
      alert("Pet updated successfully!");
      navigate("/dashboard/my-added-pets");
    } catch {
      setErrorMsg("Update failed");
    }
  };

  if (loading) return <p>Loading pet data...</p>;
  if (errorMsg) return <p className="text-red-600">{errorMsg}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Update Pet</h2>
      <AddPetForm initialValues={initialValues} onSubmit={handleUpdate} />
    </div>
  );
}

export default UpdatePet;
