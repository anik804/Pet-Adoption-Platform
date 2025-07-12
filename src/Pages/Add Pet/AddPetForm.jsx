import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import Select from "react-select";
import * as Yup from "yup";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

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
            await axios.post("http://localhost:3000/pets", {
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

            // ✅ SweetAlert on success
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
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg md:p-8"
    >
      <h2 className="text-xl md:text-2xl font-bold text-center">Add New Pet</h2>

      {/* Pet Image */}
      <div>
        <label className="font-medium block mb-1">Pet Image</label>
        <input type="file" accept="image/*" onChange={onImageChange} />
        {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
        {formik.values.petImage && (
          <img
            src={formik.values.petImage}
            alt="preview"
            className="mt-3 w-28 h-28 rounded-md object-cover border"
          />
        )}
        {formik.touched.petImage && formik.errors.petImage && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.petImage}</div>
        )}
      </div>

      {/* Pet Name */}
      <div>
        <label className="font-medium block mb-1">Pet Name</label>
        <input
          type="text"
          name="petName"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.petName}
          className="w-full border rounded px-3 py-2"
        />
        {formik.touched.petName && formik.errors.petName && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.petName}</div>
        )}
      </div>

      {/* Pet Age */}
      <div>
        <label className="font-medium block mb-1">Pet Age</label>
        <input
          type="number"
          name="petAge"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.petAge}
          className="w-full border rounded px-3 py-2"
        />
        {formik.touched.petAge && formik.errors.petAge && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.petAge}</div>
        )}
      </div>

      {/* Pet Category */}
      <div>
        <label className="font-medium block mb-1">Pet Category</label>
        <Select
          options={categories}
          value={formik.values.petCategory}
          onChange={(val) => formik.setFieldValue("petCategory", val)}
          onBlur={() => formik.setFieldTouched("petCategory", true)}
        />
        {formik.touched.petCategory && formik.errors.petCategory && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.petCategory}</div>
        )}
      </div>

      {/* Pet Location */}
      <div>
        <label className="font-medium block mb-1">Location</label>
        <input
          type="text"
          name="petLocation"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.petLocation}
          className="w-full border rounded px-3 py-2"
        />
        {formik.touched.petLocation && formik.errors.petLocation && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.petLocation}</div>
        )}
      </div>

      {/* Pet Color */}
      <div>
        <label className="font-medium block mb-1">Color</label>
        <input
          type="text"
          name="petColor"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.petColor}
          className="w-full border rounded px-3 py-2"
        />
        {formik.touched.petColor && formik.errors.petColor && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.petColor}</div>
        )}
      </div>

      {/* Pet Breed */}
      <div>
        <label className="font-medium block mb-1">Breed</label>
        <input
          type="text"
          name="petBreed"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.petBreed}
          className="w-full border rounded px-3 py-2"
        />
        {formik.touched.petBreed && formik.errors.petBreed && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.petBreed}</div>
        )}
      </div>

      {/* Short Description */}
      <div>
        <label className="font-medium block mb-1">Short Description</label>
        <input
          type="text"
          name="shortDescription"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.shortDescription}
          className="w-full border rounded px-3 py-2"
        />
        {formik.touched.shortDescription && formik.errors.shortDescription && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.shortDescription}</div>
        )}
      </div>

      {/* Long Description */}
      <div>
        <label className="font-medium block mb-1">Long Description</label>
        <div className="border rounded px-2 py-2">
          <EditorContent editor={editor} />
        </div>
        {formik.touched.longDescription && formik.errors.longDescription && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.longDescription}</div>
        )}
      </div>

      {/* Submit Button */}
      {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {formik.isSubmitting ? "Submitting..." : "Add Pet"}
        </button>
      </div>
    </form>
  );
}

export default AddPetForm;
