import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import Select from "react-select";
import * as Yup from "yup";
import useAuth from "../../Hooks/useAuth"; // ✅ Get user context

// TipTap Editor
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function AddPetForm({ initialValues, onSubmit }) {
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { user } = useAuth(); // ✅ Get logged-in user

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
    },
    validationSchema: Yup.object({
      petName: Yup.string().required("Required"),
      petAge: Yup.number().min(0).required("Required"),
      petCategory: Yup.object().required("Required"),
      petLocation: Yup.string().required("Required"),
      shortDescription: Yup.string().required("Required"),
      longDescription: Yup.string().required("Required"),
      petImage: Yup.string().required("Required"),
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
              userId: user.uid, // ✅ Send userId
            });

            alert("Pet added successfully!");
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
    data.append("upload_preset", "Pet-Adoption-User"); // Replace with your actual preset

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dyyikpmpo/image/upload", // Replace with your cloud name
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
    <form onSubmit={formik.handleSubmit} className="space-y-6 max-w-xl mx-auto p-4 bg-white shadow rounded">
      {/* Image Upload */}
      <div>
        <label className="font-medium block">Pet Image</label>
        <input type="file" accept="image/*" onChange={onImageChange} className="mt-1" />
        {uploading && <p>Uploading...</p>}
        {formik.values.petImage && <img src={formik.values.petImage} alt="preview" className="mt-2 w-32" />}
        {formik.touched.petImage && formik.errors.petImage && (
          <div className="text-red-500">{formik.errors.petImage}</div>
        )}
      </div>

      {/* Pet Name */}
      <div>
        <label className="font-medium block">Pet Name</label>
        <input
          type="text"
          name="petName"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.petName}
          className="w-full border rounded px-2 py-1"
        />
        {formik.touched.petName && formik.errors.petName && (
          <div className="text-red-500">{formik.errors.petName}</div>
        )}
      </div>

      {/* Pet Age */}
      <div>
        <label className="font-medium block">Pet Age</label>
        <input
          type="number"
          name="petAge"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.petAge}
          className="w-full border rounded px-2 py-1"
        />
        {formik.touched.petAge && formik.errors.petAge && (
          <div className="text-red-500">{formik.errors.petAge}</div>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="font-medium block">Category</label>
        <Select
          options={categories}
          value={formik.values.petCategory}
          onChange={(val) => formik.setFieldValue("petCategory", val)}
          onBlur={() => formik.setFieldTouched("petCategory", true)}
        />
        {formik.touched.petCategory && formik.errors.petCategory && (
          <div className="text-red-500">{formik.errors.petCategory}</div>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="font-medium block">Location</label>
        <input
          type="text"
          name="petLocation"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.petLocation}
          className="w-full border rounded px-2 py-1"
        />
        {formik.touched.petLocation && formik.errors.petLocation && (
          <div className="text-red-500">{formik.errors.petLocation}</div>
        )}
      </div>

      {/* Short Description */}
      <div>
        <label className="font-medium block">Short Description</label>
        <input
          type="text"
          name="shortDescription"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.shortDescription}
          className="w-full border rounded px-2 py-1"
        />
        {formik.touched.shortDescription && formik.errors.shortDescription && (
          <div className="text-red-500">{formik.errors.shortDescription}</div>
        )}
      </div>

      {/* Long Description */}
      <div>
        <label className="font-medium block mb-1">Long Description</label>
        <div className="border p-2 rounded min-h-[150px]">
          <EditorContent editor={editor} />
        </div>
        {formik.touched.longDescription && formik.errors.longDescription && (
          <div className="text-red-500 mt-1">{formik.errors.longDescription}</div>
        )}
      </div>

      {/* Submit Button */}
      {errorMsg && <div className="text-red-600">{errorMsg}</div>}
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {formik.isSubmitting ? "Submitting..." : "Add Pet"}
      </button>
    </form>
  );
}

export default AddPetForm;
