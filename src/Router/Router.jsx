import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import Pets from "../Pages/Pets/Pets";

const router = createBrowserRouter([
  {
    path: "/",
    // element: <div>Hello World</div>,
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "pets",
        Component: Pets,

      }
    ]
  },
]);

export default router;