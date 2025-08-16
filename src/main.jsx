import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./Router/Router.jsx";
import AuthProvider from "./Context/Auth Context/AuthProvider.jsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify"; // ✅ import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // ✅ import toast styles

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer // ✅ add this so toasts can appear anywhere
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
