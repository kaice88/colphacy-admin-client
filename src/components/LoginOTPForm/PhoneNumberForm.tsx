import { Button, Flex, useMantineTheme, Text, TextInput, Center } from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { IPhoneNumberFormInputs } from "./type"
import useAuth from "../../hooks/useAuth";
import { notificationShow } from "../Notification";


const PhoneNumberForm: React.FC<{ onMethodChange: () => void, onFormChange: (phoneNumber: string) => void }> = (props) => {
    const theme = useMantineTheme();
    const { control, handleSubmit, formState: { errors }, setError, getValues } = useForm({
        defaultValues: {
            phoneNumber: "",
        }
    })
    const { onSubmitPhoneNumberForm, handleGenerateOTP } = useAuth();

    const onSubmit: SubmitHandler<IPhoneNumberFormInputs> = (data) => {
        onSubmitPhoneNumberForm(data,
            () => {
                props.onFormChange(getValues("phoneNumber"));
            },
            (error) => {
                if (error.code === 'ERR_NETWORK') {
                    notificationShow('error', 'Error!', error.message)
                }
                else if (error.response.status === 500) {
                    notificationShow('error', 'Error!', error.response.data.error)
                }
                else {
                    setError("phoneNumber", {
                        type: "manual",
                        message: (error.response.status === 404 || error.response.status === 500) ? error.response.data.error : error.response.data.phone,
                    })
                }
            },
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Text fw="600" color={theme.colors.cobaltBlue[0]} fz="20px" align="center" pb="lg">Đăng nhập</Text>
            <Flex direction="column" gap="md">
                <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{ required: true, pattern: /^\d{10}$/ }}
                    render={({ field }) => <TextInput
                        {...field}
                        required
                        label="Số điện thoại"
                        radius="md"
                        error={errors.phoneNumber ? (errors.phoneNumber.type === 'pattern' ? "Đồ dài của số điện thoại phải là 10 chữ số" : errors.phoneNumber.message) : false}
                    />}
                ></Controller>
                <Button
                    loading={handleGenerateOTP.isLoading}
                    styles={(theme) => ({
                        root: {
                            backgroundColor: theme.colors.munsellBlue[0],
                            ...theme.fn.hover({
                                backgroundColor: theme.fn.darken(theme.colors.munsellBlue[0], 0.1),
                            }),
                        }
                    })} type="submit">
                    ĐĂNG NHẬP</Button>
                <Center><Text className="option" color={theme.colors.munsellBlue[0]} onClick={props.onMethodChange} >Đăng nhập bằng mật khẩu</Text></Center>
            </Flex>
        </form>);
}

export default PhoneNumberForm