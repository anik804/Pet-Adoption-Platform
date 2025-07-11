import React from "react";
import LogoSection from "../../Shared/Logo Section/LogoSection";
import bg from "../../../assets/login_bg.jpg";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router";
import SocialLogin from "../Social Login/SocialLogin";
import useAuth from "../../../Hooks/useAuth";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const saveUserToBackend = async (user) => {
    try {
      console.log('Saving user to backend:', user.email);
      const response = await fetch(`http://localhost:3000/users/${user.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          role: 'user', // default role
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to save user, server responded with:', errorText);
      } else {
        console.log('User saved successfully');
      }
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then(async (result) => {
        if (result.user) {
          await saveUserToBackend(result.user);
        }
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  return (
    <div
      className="flex items-center justify-start min-h-screen bg-cover bg-center px-6 md:px-20"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card bg-base-100 w-[300px] md:w-[350px] shadow-2xl">
          <div className="card-body">
            <h2 className="card-title text-center">Login to your account</h2>
            <fieldset className="fieldset">
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
              <label className="label">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/,
                    message:
                      "Password must contain at least one uppercase, one lowercase, one number and be at least 6 characters long",
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
            </fieldset>
            <p>
              Don't have an account ?{" "}
              <Link to="/register" className="font-bold text-amber-600">
                Register
              </Link>
            </p>
            <button className="btn btn-neutral mt-4">Login</button>
          </div>
        </div>
      </form>
      <SocialLogin />
    </div>
  );
};

export default Login;
