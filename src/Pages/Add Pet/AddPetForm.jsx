import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import * as Yup from "yup";
import useAuth from "../../Hooks/useAuth";

// TipTap Editor
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function AddPetForm({ initialValues, onSubmit }) {
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { user } = useAuth();

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialValues?.longDescription || "",
    onUpdate: ({ editor }) => {
      formik.setFieldValue("longDescription", editor.getHTML());
    },
  });

  const formik = useFormik({
    initialValues: initialValues || {
      petImage: "",
      petName: "",
      petAge: "",
      petCategory: null,
      petLocation: "",
      shortDescription: "",
      longDescription: "",
      petColor: "",
      petBreed: "",
    },
    validationSchema: Yup.object({
      petName: Yup.string().required("Required"),
      petAge: Yup.number().min(0).required("Required"),
      petCategory: Yup.object().required("Required"),
      petLocation: Yup.string().required("Required"),
      shortDescription: Yup.string().required("Required"),
      longDescription: Yup.string().required("Required"),
      petImage: Yup.string().required("Required"),
      petColor: Yup.string().required("Required"),
      petBreed: Yup.string().required("Required"),
    }),
    onSubmit: onSubmit
      ? onSubmit
      : async (values) => {
          if (!user?.uid) {
            setErrorMsg("You must be logged in to add a pet.");
            return;
          }

          try {
            await axios.post("https://pet-adoption-platform-server-side.vercel.app/pets", {
              petImage: values.petImage,
              petName: values.petName,
              petAge: Number(values.petAge),
              petCategory: values.petCategory.value,
              petLocation: values.petLocation,
              shortDescription: values.shortDescription,
              longDescription: values.longDescription,
              petColor: values.petColor,
              petBreed: values.petBreed,
              userId: user.uid,
              adopted: false,
              createdAt: new Date(),
            });

            Swal.fire({
              icon: "success",
              title: "Pet Added!",
              text: "Your pet has been listed for adoption.",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "OK",
            });

            formik.resetForm();
            editor.commands.clearContent();
          } catch (err) {
            setErrorMsg(err.response?.data?.error || "Submission failed");
          }
        },
  });

  const onImageChange = async (e) => {
    const file = e.currentTarget.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Pet-Adoption-User");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dyyikpmpo/image/upload",
        data
      );
      formik.setFieldValue("petImage", res.data.secure_url);
    } catch (err) {
      console.error("Image upload failed", err);
      setErrorMsg("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const categories = [
    { value: "dog", label: "Dog" },
    { value: "cat", label: "Cat" },
    { value: "bird", label: "Bird" },
    { value: "rabbit", label: "Rabbit" },
    { value: "fish", label: "Fish" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-6 md:p-10">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          🐾 Add a New Pet for Adoption
        </h2>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Pet Image */}
          <div>
            <label className="block font-semibold mb-1">Pet Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-gradient-to-r file:from-pink-500 file:to-purple-600 file:text-white
                hover:file:opacity-90 transition"
            />
            {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            {formik.values.petImage && (
              <img
                src={formik.values.petImage}
                alt="preview"
                className="mt-3 w-28 h-28 rounded-lg object-cover border shadow-md"
              />
            )}
            {formik.touched.petImage && formik.errors.petImage && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.petImage}</p>
            )}
          </div>

          {/* Pet Name */}
          <div>
            <label className="block font-semibold mb-1">Pet Name</label>
            <input
              type="text"
              name="petName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.petName}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none transition"
              placeholder="Enter pet's name"
            />
            {formik.touched.petName && formik.errors.petName && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.petName}</p>
            )}
          </div>

          {/* Pet Age */}
          <div>
            <label className="block font-semibold mb-1">Pet Age</label>
            <input
              type="number"
              name="petAge"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.petAge}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none transition"
              placeholder="Enter age in years"
            />
            {formik.touched.petAge && formik.errors.petAge && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.petAge}</p>
            )}
          </div>

          {/* Pet Category */}
          <div>
            <label className="block font-semibold mb-1">Category</label>
            <Select
              options={categories}
              value={formik.values.petCategory}
              onChange={(val) => formik.setFieldValue("petCategory", val)}
              onBlur={() => formik.setFieldTouched("petCategory", true)}
              className="text-sm"
            />
            {formik.touched.petCategory && formik.errors.petCategory && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.petCategory}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block font-semibold mb-1">Location</label>
            <input
              type="text"
              name="petLocation"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.petLocation}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none transition"
              placeholder="Enter location"
            />
            {formik.touched.petLocation && formik.errors.petLocation && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.petLocation}</p>
            )}
          </div>

          {/* Color */}
          <div>
            <label className="block font-semibold mb-1">Color</label>
            <input
              type="text"
              name="petColor"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.petColor}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none transition"
              placeholder="e.g. Brown, White, Golden"
            />
            {formik.touched.petColor && formik.errors.petColor && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.petColor}</p>
            )}
          </div>

          {/* Breed */}
          <div>
            <label className="block font-semibold mb-1">Breed</label>
            <input
              type="text"
              name="petBreed"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.petBreed}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none transition"
              placeholder="Enter breed"
            />
            {formik.touched.petBreed && formik.errors.petBreed && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.petBreed}</p>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block font-semibold mb-1">Short Description</label>
            <input
              type="text"
              name="shortDescription"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.shortDescription}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none transition"
              placeholder="Enter a short summary"
            />
            {formik.touched.shortDescription && formik.errors.shortDescription && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.shortDescription}</p>
            )}
          </div>

          {/* Long Description */}
          <div>
            <label className="block font-semibold mb-1">Long Description</label>
            <div className="border rounded-lg px-3 py-2 min-h-[150px] focus-within:ring-2 focus-within:ring-pink-400">
              <EditorContent editor={editor} />
            </div>
            {formik.touched.longDescription && formik.errors.longDescription && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.longDescription}</p>
            )}
          </div>

          {/* Error */}
          {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full md:w-auto bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg shadow-lg hover:opacity-90 transition-all duration-300 font-semibold"
            >
              {formik.isSubmitting ? "Submitting..." : "➕ Add Pet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPetForm;
