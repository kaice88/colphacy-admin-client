import { createBrowserRouter } from "react-router-dom"
import Layout from './layouts/Layout'
import ErrorPage from "./pages/Error"
import Home from "./pages/Home"
import * as ROUTES from "./constants/routes"
import Login from "./pages/Login"

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
        ],
    },
])

