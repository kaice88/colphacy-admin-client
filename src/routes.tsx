import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import ErrorPage from "./pages/Error";
import Home from "./pages/Home";
import Account from "./layouts/Account";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "profile",
        element: <Account />,
      },
    ],
  },
]);
