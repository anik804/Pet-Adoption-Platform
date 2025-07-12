import React, { useState } from "react";
import { useForm } from "react-hook-form";
import LogoSection from "../../Shared/Logo Section/LogoSection";
import bg from "../../../assets/register_bg.jpg";
import useAuth from "../../../Hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router";
import SocialLogin from "../Social Login/SocialLogin";
import { updateProfile } from "firebase/auth";
import { auth } from "../../../Firebase/firebase.init";
import Swal from "sweetalert2";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [authError, setAuthError] = useState("");
  const [imageType, setImageType] = useState("file"); // file or url

  const onSubmit = async (data) => {
    setAuthError("");

    try {
      let imageURL = "";

      // ✅ Upload image
      if (imageType === "file") {
        const image = data.imageFile[0];
        if (!image) throw new Error("No file selected");

        const formData = new FormData();
        formData.append("image", image);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY`,
          {
            method: "POST",
            body: formData,
          }
        );
        const imgData = await res.json();
        if (!imgData.success) throw new Error("Image upload failed");
        imageURL = imgData.data.url;
      } else {
        if (!data.imageURL) throw new Error("No URL provided");
        imageURL = data.imageURL;
      }

      // ✅ Create Firebase user
      const result = await createUser(data.email, data.password);
      if (result.user) {
        await updateProfile(auth.currentUser, {
          displayName: data.fullName,
          photoURL: imageURL,
        });

        // ✅ Save to DB
        await fetch(`http://localhost:3000/users/${result.user.email}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: result.user.email,
            name: data.fullName,
            photo: imageURL,
          }),
        });

        // ✅ Success alert
        Swal.fire({
          icon: "success",
          title: "Registered Successfully!",
          text: "Welcome to the platform 🎉",
          confirmButtonColor: "#f59e0b",
        }).then(() => {
          navigate(from, { replace: true });
        });
      }
    } catch (error) {
      console.error(error);
      setAuthError("Registration failed. " + error.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8 px-4 md:px-12 bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-white bg-opacity-90 shadow-lg rounded-lg max-w-md w-full p-8 md:p-12">
        <LogoSection />
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
          Create a New Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Full Name */}
          <div className="mb-6">
            <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              {...register("fullName", { required: "Full name is required" })}
              className={`w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-600 mt-1 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              className={`w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/,
                  message:
                    "Password must have at least one uppercase, one lowercase, one number and 6+ characters",
                },
              })}
              className={`w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Image Upload Type */}
          <div className="mb-4">
            <p className="text-gray-700 font-medium mb-2">Choose Image Input Method</p>
            <div className="flex space-x-6">
              <label className="cursor-pointer flex items-center">
                <input
                  type="radio"
                  value="file"
                  checked={imageType === "file"}
                  onChange={() => setImageType("file")}
                  className="mr-2"
                />
                Upload File
              </label>
              <label className="cursor-pointer flex items-center">
                <input
                  type="radio"
                  value="url"
                  checked={imageType === "url"}
                  onChange={() => setImageType("url")}
                  className="mr-2"
                />
                Use URL
              </label>
            </div>
          </div>

          {/* Image Input */}
          {imageType === "file" ? (
            <div className="mb-6">
              <label htmlFor="imageFile" className="block text-gray-700 font-medium mb-2">
                Profile Image File
              </label>
              <input
                id="imageFile"
                type="file"
                {...register("imageFile", {
                  required: "Profile image file is required",
                })}
                className={`w-full border rounded py-2 px-3 file:border-0 file:bg-gray-100 file:rounded file:px-4 file:py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${
                  errors.imageFile ? "border-red-500" : "border-gray-300"
                }`}
                accept="image/*"
              />
              {errors.imageFile && (
                <p className="text-red-600 mt-1 text-sm">{errors.imageFile.message}</p>
              )}
            </div>
          ) : (
            <div className="mb-6">
              <label htmlFor="imageURL" className="block text-gray-700 font-medium mb-2">
                Profile Image URL
              </label>
              <input
                id="imageURL"
                type="url"
                placeholder="https://example.com/image.jpg"
                {...register("imageURL", {
                  required: "Image URL is required",
                  pattern: {
                    value: /^(http|https):\/\/[^ "]+$/,
                    message: "Invalid URL format",
                  },
                })}
                className={`w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${
                  errors.imageURL ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.imageURL && (
                <p className="text-red-600 mt-1 text-sm">{errors.imageURL.message}</p>
              )}
            </div>
          )}

          {/* Auth Error */}
          {authError && (
            <p className="text-red-600 text-center font-semibold mb-4">{authError}</p>
          )}

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded transition"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-600 font-semibold hover:underline">
            Login
          </Link>
        </p>

        <div className="mt-8">
          <SocialLogin />
        </div>
      </div>
    </div>
  );
};

export default Register;
