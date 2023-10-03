import { Button, Flex, TextInput, PasswordInput, Text, useMantineTheme } from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { IFormInputs } from "./type"
import useAuth from "../../hooks/useAuth";
import { useState } from "react";

const LoginForm: React.FC = () => {
    const [error, setError] = useState({});
    const theme = useMantineTheme();

    const { control, handleSubmit } = useForm({
        defaultValues: {
            username: "",
            password: "",
        }
    })
    const { login } = useAuth();
    const onSubmit: SubmitHandler<IFormInputs> = (data) => {
        console.log(data);
        // login.mutate(data);
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Text fw="600" color={theme.colors.cobaltBlue[0]} fz="20px" align="center" pb="lg">Đăng nhập</Text>
            <Flex direction="column" gap="md">
                <Controller
                    name="username"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <TextInput
                        {...field}
                        required
                        label="Tên đăng nhập"
                        radius="md"
                        error=""
                    />}
                ></Controller>
                <Controller
                    name="password"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <PasswordInput
                        {...field}
                        required
                        label="Mật khẩu"
                        radius="md"
                    />}
                ></Controller>
                <Button
                    styles={(theme) => ({
                        root: {
                            backgroundColor: theme.colors.munsellBlue[0],
                            ...theme.fn.hover({
                                backgroundColor: theme.fn.darken(theme.colors.munsellBlue[0], 0.1),
                            }),
                        }
                    })}
                    type="submit">
                    ĐĂNG NHẬP</Button>
            </Flex>
        </form>
    );
}

export default LoginForm