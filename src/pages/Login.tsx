import { Center, Flex, Paper } from "@mantine/core";
import LoginPasswordForm from "../components/LoginForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Login: React.FC = () => {
    const { isAuthenticated } = useAuth();
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
                    {!loginWithOTP ?
                        <><LoginPasswordForm />
                            <Flex justify="space-between">
                                <span>Quên mật khẩu</span>
                                <span onClick={() => { setLoginWithOTP(true) }}>Đăng nhập bằng OTP</span>
                            </Flex></>
                        : <></>
                    }
                </Paper>
            </Center>}</>
    );
}

export default Login