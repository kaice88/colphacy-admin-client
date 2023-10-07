import { Button, Flex, useMantineTheme, Text, PinInput, Group, Input } from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { IOTPFormInputs } from "./type"
import useAuth from "../../hooks/useAuth";


const OTPForm: React.FC<{ phoneNumber: string }> = (props) => {
    const theme = useMantineTheme();
    const { onSubmitOTPForm } = useAuth();
    const { control, handleSubmit, formState: { errors }, setError } = useForm({
        defaultValues: {
            otp: "",
        }
    })
    const onSubmit: SubmitHandler<IOTPFormInputs> = (data) => {
        onSubmitOTPForm({ ...data, phone: props.phoneNumber },
            (error) => {
                if (error.code === 'ERR_NETWORK') {
                    setError("otp", {
                        type: "manual",
                        message: error.message,
                    })
                }
                else {
                    setError("otp", {
                        type: "manual",
                        message: (error.response.status === 404 || error.response.status === 500) ? error.response.data.error : error.response.data.OTP,
                    })
                }
            },
        )
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Text fw="600" color={theme.colors.cobaltBlue[0]} fz="20px" align="center" pb="lg">Nhập mã xác thực</Text>
            <Flex direction="column" gap="md" >
                <Controller
                    name="otp"
                    control={control}
                    rules={{ required: true, pattern: /^\d{6}$/ }}
                    render={({ field }) => <Group position="center">
                        <Input.Wrapper
                            error={errors.otp ? (errors.otp.type === 'pattern' || errors.otp.type === 'required' ? "Vui lòng nhập đủ 6 chữ số" : errors.otp.message) : false}
                            style={{ textAlign: "center" }}>
                            <PinInput {...field} type="number" length={6} error={errors.otp ? true : false} />
                        </Input.Wrapper>
                    </Group>}
                ></Controller>
                <Button styles={(theme) => ({
                    root: {
                        backgroundColor: theme.colors.munsellBlue[0],
                        ...theme.fn.hover({
                            backgroundColor: theme.fn.darken(theme.colors.munsellBlue[0], 0.1),
                        }),
                    }
                })} type="submit">
                    XÁC NHẬN</Button>
            </Flex>
        </form>);
}

export default OTPForm