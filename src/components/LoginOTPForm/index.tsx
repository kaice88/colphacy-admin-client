import { Button, Flex, TextInput } from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { IFormInputs } from "./type"
import useAuth from "../../hooks/useAuth";
import { useState } from "react";

const LoginOTPForm: React.FC = () => {
    const [error, setError] = useState({});
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
            </Flex>
        </form>);
}

export default LoginOTPForm