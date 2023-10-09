import { Center, Paper } from "@mantine/core";
import LoginPasswordForm from "../components/LoginForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoginOTPForm from "../components/LoginOTPForm";

const Login: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [loginWithOTP, setLoginWithOTP] = useState(false);
    const handleLoginMethodToggle = () => {
        setLoginWithOTP((prev) => !prev)
    }
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated])

    return (<>
        {!isAuthenticated &&
            <Center pt="10%">
                <Paper shadow="sm" p="md" withBorder w="500px" className="login-container">
                    {!loginWithOTP ? <LoginPasswordForm onMethodChange={handleLoginMethodToggle} /> : <LoginOTPForm onMethodChange={handleLoginMethodToggle} />}
                </Paper>
            </Center>}</>
    );
}

export default Login