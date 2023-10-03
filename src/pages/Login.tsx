import { Center, Flex, Paper, Text, useMantineTheme } from "@mantine/core";
import LoginPasswordForm from "../components/LoginForm";
import LoginOTPForm from "../components/LoginOTPForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Login: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const [loginWithOTP, setLoginWithOTP] = useState(false);
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated])
    return (<>
        {!isAuthenticated &&
            <Center pt="10%">
                <Paper shadow="sm" p="md" withBorder w="500px" className="login-container">
                    <Text fw="600" color={theme.colors.cobaltBlue[0]} fz="20px" align="center" pb="lg">Đăng nhập</Text>
                    {!loginWithOTP ?
                        <><LoginPasswordForm />
                            <Flex justify="space-between">
                                <span>Quên mật khẩu</span>
                                <span onClick={() => { setLoginWithOTP(true) }}>Đăng nhập bằng OTP</span>
                            </Flex></>
                        : <>
                            <LoginOTPForm />
                            <Center><span onClick={() => { setLoginWithOTP(false) }} >Đăng nhập bằng mật khẩu</span></Center>
                        </>
                    }
                </Paper>
            </Center>}</>
    );
}

export default Login