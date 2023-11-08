import { createBrowserRouter } from 'react-router-dom';
import Layout from './layouts/Layout';
import ErrorPage from './pages/Error';
import Home from './pages/Home';
import * as ROUTES from './constants/routes';
import Login from './pages/Login';
import Account from './pages/Account';
import Branch from './pages/Branch';
import Product from './pages/Product';
import UnitPage from './pages/UnitPage';
import ChangePassword from './pages/ChangePassword';
import CategoryPage from './pages/CategoryPage';

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
        path: '/profile',
        element: <Account />,
      },
      {
        path: '/editPassword',
        element: <ChangePassword />,
      },
      {
        element: <Branch />,
        path: '/branch-management',
      },
      {
        path: 'product-management',
        element: <Product />,
      },
      {
        path: 'unit-management',
        element: <UnitPage />,
      },
      {
        path: 'category-management',
        element: <CategoryPage />,
      },
    ],
  },
]);
