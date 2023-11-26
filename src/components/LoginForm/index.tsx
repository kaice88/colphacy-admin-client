import {
  Button,
  Flex,
  TextInput,
  PasswordInput,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { IFormInputs } from "./type";
import useAuth from "../../hooks/useAuth";
import { handleGlobalException } from "../../utils/error";

const LoginForm: React.FC<{ onMethodChange: () => void }> = (props) => {
  const theme = useMantineTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { onSubmitAccountForm, handleLoginPassword } = useAuth();
  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    onSubmitAccountForm(data, (error) => {
      handleGlobalException(error, () => {
        setError("username", {
          type: "manual",
          message: error.response.data.username,
        });
        setError("password", {
          type: "manual",
          message: error.response.data.password,
        });
      });
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Text
        fw="600"
        color={theme.colors.cobaltBlue[0]}
        fz="20px"
        align="center"
        pb="lg"
      >
        Đăng nhập
      </Text>
      <Flex direction="column" gap="md">
        <Controller
          name="username"
          control={control}
          rules={{ required: false, minLength: 6 }}
          render={({ field }) => (
            <TextInput
              {...field}
              required
              label="Tên đăng nhập"
              radius="md"
              error={
                errors.username
                  ? errors.username.type === "minLength"
                    ? "Tên tài khoản có độ dài ít nhất 6 kí tự"
                    : errors.username.message
                  : false
              }
            />
          )}
        ></Controller>
        <Controller
          name="password"
          control={control}
          rules={{ required: true, minLength: 8 }}
          render={({ field }) => (
            <PasswordInput
              {...field}
              required
              label="Mật khẩu"
              radius="md"
              error={
                errors.password
                  ? errors.password.type === "minLength"
                    ? "Mật khẩu có độ dài ít nhất 8 kí tự"
                    : errors.password.message
                  : false
              }
            />
          )}
        ></Controller>
        <Button
          loading={handleLoginPassword.isLoading}
          styles={(theme) => ({
            root: {
              backgroundColor: theme.colors.munsellBlue[0],
              ...theme.fn.hover({
                backgroundColor: theme.fn.darken(
                  theme.colors.munsellBlue[0],
                  0.1
                ),
              }),
            },
          })}
          type="submit"
        >
          {" "}
          ĐĂNG NHẬP
        </Button>
        <Flex justify="space-between">
          <Text className="option" color={theme.colors.munsellBlue[0]}>
            Quên mật khẩu
          </Text>
          <Text
            className="option"
            color={theme.colors.munsellBlue[0]}
            onClick={props.onMethodChange}
          >
            Đăng nhập bằng OTP
          </Text>
        </Flex>
      </Flex>
    </form>
  );
};

export default LoginForm;
