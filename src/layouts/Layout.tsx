import { AppShell } from '@mantine/core';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar/Navbar';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { LOGIN } from '../constants/routes';

const Layout: React.FC = () => {
  const { isAuthenticated, logout,getTokenDuration } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(LOGIN, { state: { from: location.pathname } });
    }
    else {
   
      const tokenDuration = getTokenDuration()
      const logoutTimeout = setTimeout(() => {
        logout.mutate();
      
      }, tokenDuration)
      return () => {
        clearTimeout(logoutTimeout)
      }
    }

    if (location?.state?.from) {
      navigate(location?.state?.from);
    }

  }, [isAuthenticated, location?.state?.from]);

  return (
    <>
      {isAuthenticated && (
        <AppShell
          padding="md"
          navbarOffsetBreakpoint="sm"
          navbar={<Navbar />}
          header={<Header />}
        >
          <div className="content">
            <Outlet></Outlet>
          </div>
        </AppShell>
      )}
    </>
  );
};
export default Layout;
