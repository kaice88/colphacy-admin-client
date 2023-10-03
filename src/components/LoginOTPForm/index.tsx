import { Button, Flex, TextInput, useMantineTheme, Text, Center } from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { IFormInputs } from "./type"
import useAuth from "../../hooks/useAuth";
import { useState } from "react";

const LoginOTPForm: React.FC<{ onMethodChange: () => void }> = (props) => {
    const [error, setError] = useState({});
    const theme = useMantineTheme();
    const { control, handleSubmit } = useForm({
        defaultValues: {
            phoneNumber: "",
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
                    name="phoneNumber"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <TextInput
                        {...field}
                        required
                        label="Số điện thoại"
                        radius="md"
                        error=""
                    />}
                ></Controller>
                <Button styles={(theme) => ({
                    root: {
                        backgroundColor: theme.colors.munsellBlue[0],
                        ...theme.fn.hover({
                            backgroundColor: theme.fn.darken(theme.colors.munsellBlue[0], 0.1),
                        }),
                    }
                })} type="submit">
                    ĐĂNG NHẬP</Button>
                <Center><span onClick={props.onMethodChange} >Đăng nhập bằng mật khẩu</span></Center>
            </Flex>
        </form>);
}

export default LoginOTPForm