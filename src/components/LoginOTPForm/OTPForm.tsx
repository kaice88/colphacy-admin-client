import { Button, Flex, useMantineTheme, Text, PinInput, Center, Group } from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { IFormInputs } from "./type"


const OTPForm: React.FC = () => {
    const theme = useMantineTheme();
    const { control, handleSubmit } = useForm({
        defaultValues: {
            phoneNumber: "",
        }
    })
    const onSubmit: SubmitHandler<IFormInputs> = (data) => {
        console.log(data);
        // login.mutate(data);
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Text fw="600" color={theme.colors.cobaltBlue[0]} fz="20px" align="center" pb="lg">Nhập mã xác thực</Text>
            <Flex direction="column" gap="md" >
                <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <Group position="center"><PinInput {...field} type="number" length={6} /></Group>}
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