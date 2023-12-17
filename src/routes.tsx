import { Navigate, createBrowserRouter } from 'react-router-dom';
import Layout from './layouts/Layout';
import ErrorPage from './pages/Error';
import * as ROUTES from './constants/routes';
import Login from './pages/Login';
import Account from './pages/Account';
import Branch from './pages/Branch';
import Product from './pages/Product';
import UnitPage from './pages/UnitPage';
import ChangePassword from './pages/ChangePassword';
import CategoryPage from './pages/CategoryPage';
import ProviderPage from './pages/ProviderPage';
import Import from './pages/Import';
import Order from './pages/Order';
import Review from './pages/Review';
import Stock from './pages/Stock';
import Dashboard from './pages/Dashboard';

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
        element: <Navigate to="/branch-management" />,
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
        path: 'branch-management',
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
      {
        path: 'provider-management',
        element: <ProviderPage />,
      },
      {
        path: 'import-management',
        element: <Import />,
      },
      {
        path: 'order-management',
        element: <Order />,
      },
      {
        path: 'stock-management',
        element: <Stock />,
      },
      {
        path: 'review-management',
        element: <Review />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
    ],
  },
]);
