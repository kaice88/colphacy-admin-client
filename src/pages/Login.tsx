import { Center, Paper } from '@mantine/core';
import LoginPasswordForm from '../components/LoginForm';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { HOME } from '../constants/routes';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginWithOTP, setLoginWithOTP] = useState(false);
  const handleLoginMethodToggle = () => {
    setLoginWithOTP((prev) => !prev);
  };

  useEffect(() => {
    if (isAuthenticated) {
      const { state } = location;

      if (state && state.from) navigate(state.from, { state: null });
      else navigate(HOME);
    }
  }, [isAuthenticated]);
  return (
    <>
      {!isAuthenticated && (
        <Center pt="10%">
          <Paper
            shadow="sm"
            p="md"
            withBorder
            w="500px"
            className="login-container"
          >
            {!loginWithOTP ? (
              <LoginPasswordForm onMethodChange={handleLoginMethodToggle} />
            ) : (
              <></>
            )}
          </Paper>
        </Center>
      )}
    </>
  );
};

export default Login;
