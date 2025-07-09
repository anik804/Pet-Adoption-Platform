import React, { useState } from "react";
import { useForm } from "react-hook-form";
import LogoSection from "../../Shared/Logo Section/LogoSection";
import bg from "../../../assets/register_bg.jpg";
import useAuth from "../../../Hooks/useAuth";
import { Link } from "react-router";
import SocialLogin from "../Social Login/SocialLogin";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { createUser } = useAuth();

  const [authError, setAuthError] = useState("");
  const [imageType, setImageType] = useState("file"); // file or url

  const onSubmit = async (data) => {
    setAuthError("");
    //
    // console.log(createUser);
    //
    try {
      let image;
      createUser(data.email, data.password)
        .then((result) => {
          console.log("User created successfully:", result);
        })
        .catch((error) => {
          throw new Error("Failed to create user: " + error.message);
        });
      if (imageType === "file") {
        image = data.imageFile[0];
        if (!image) throw new Error("No file selected");
      } else {
        image = data.imageURL;
        if (!image) throw new Error("No URL provided");
      }

      // You can now handle image upload or just use the URL directly
      console.log("Registering user:", {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        image,
        imageType,
      });

      alert("Registered successfully!");
    } catch (error) {
      setAuthError("Registration failed. " + error.message);
    }
  };

  return (
    <div
      className="flex items-center justify-start min-h-screen bg-cover bg-center px-6 md:px-20"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="card bg-base-100 m-10 w-[300px] md:w-[400px] shadow-2xl">
        <div className="card-body">
          <h2 className="card-title text-center">Create a new account</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset space-y-2">
              {/* Full Name */}
              <label className="label">Full Name</label>
              <input
                type="text"
                {...register("fullName", { required: "Full name is required" })}
                className="input"
                placeholder="Full name"
              />
              {errors.fullName && (
                <span className="text-red-500 text-sm">
                  {errors.fullName.message}
                </span>
              )}

              {/* Email */}
              <label className="label">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                className="input"
                placeholder="Email"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}

              {/* Password */}
              <label className="label">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/,
                    message:
                      "Password must have at least one uppercase, one lowercase, one number and 6+ characters",
                  },
                })}
                className="input"
                placeholder="Password"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}

              {/* Image Type Toggle */}
              <label className="label">Choose Image Input Method</label>
              <div className="flex space-x-4">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    value="file"
                    checked={imageType === "file"}
                    onChange={() => setImageType("file")}
                    className="mr-1"
                  />
                  Upload File
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    value="url"
                    checked={imageType === "url"}
                    onChange={() => setImageType("url")}
                    className="mr-1"
                  />
                  Use URL
                </label>
              </div>

              {/* Conditionally Render Image Field */}
              {imageType === "file" ? (
                <>
                  <label className="label">Profile Image File</label>
                  <input
                    type="file"
                    {...register("imageFile", {
                      required: "Profile image file is required",
                    })}
                    className="file-input file-input-bordered"
                    accept="image/*"
                  />
                  {errors.imageFile && (
                    <span className="text-red-500 text-sm">
                      {errors.imageFile.message}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <label className="label">Profile Image URL</label>
                  <input
                    type="url"
                    {...register("imageURL", {
                      required: "Image URL is required",
                      pattern: {
                        value: /^(http|https):\/\/[^ "]+$/,
                        message: "Invalid URL format",
                      },
                    })}
                    className="input"
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.imageURL && (
                    <span className="text-red-500 text-sm">
                      {errors.imageURL.message}
                    </span>
                  )}
                </>
              )}

              {/* Auth Error */}
              {authError && (
                <span className="text-red-500 text-sm font-medium">
                  {authError}
                </span>
              )}

              {/* Register Button */}
              <button className="btn btn-neutral mt-4 w-full">Register</button>
            </fieldset>
            <p>
              Already have an account ?{" "}
              <Link to="/login" className="font-bold text-pink-500">
                Login
              </Link>
            </p>
          </form>
          <SocialLogin></SocialLogin>
        </div>
      </div>
    </div>
  );
};

export default Register;
