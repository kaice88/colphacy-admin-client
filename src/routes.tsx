import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import ErrorPage from "./pages/Error";
import Home from "./pages/Home";
import * as ROUTES from "./constants/routes";
import Login from "./pages/Login";
import Account from "./pages/Account";
import EditPassword from "./pages/EditPassword";
import Branch from "./pages/Branch";
import UnitPage from "./pages/UnitPage";

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: ROUTES.HOME,
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Account />,
      },
      {
        path: "/editPassword",
        element: <EditPassword />,
      },
      {
        index: true,
        element: <Branch />,
        path: "/branch-management",
      },
      {
        element: <UnitPage />,
        path: "/unit-management",
      },
    ],
  },
]);
