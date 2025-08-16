import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import bg from "../../../assets/login_bg.jpg";
import useAuth from "../../../Hooks/useAuth";
import LogoSection from "../../Shared/Logo Section/LogoSection";
import SocialLogin from "../Social Login/SocialLogin";

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
      console.log("Saving user to backend:", user.email);
      const response = await fetch(
        `https://pet-adoption-platform-server-side.vercel.app/users/${user.email}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
            role: "user",
          }),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to save user, server responded with:", errorText);
      } else {
        console.log("User saved successfully");
      }
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then(async (result) => {
        if (result.user) {
          await saveUserToBackend(result.user);

          // ✅ SweetAlert success
          Swal.fire({
            icon: "success",
            title: "Login Successful!",
            text: `Welcome back, ${result.user.displayName || "User"} 🎉`,
            confirmButtonColor: "#f59e0b",
          }).then(() => {
            navigate(from, { replace: true });
          });
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);

        // ✅ SweetAlert error
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.message,
          confirmButtonColor: "#f59e0b",
        });
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 md:px-12 bg-cover bg-center py-5"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-white bg-opacity-90 shadow-lg rounded-lg max-w-md w-full p-8 md:p-12">
        <LogoSection />
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
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
              <p className="text-red-600 mt-1 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
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
                    "Password must contain at least one uppercase, one lowercase, one number, and be at least 6 characters long",
                },
              })}
              className={`w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-600 mt-1 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-600 mb-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-amber-600 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded transition"
          >
            Login
          </button>
        </form>

        {/* Social Login */}
        <div className="mt-8">
          <SocialLogin />
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
