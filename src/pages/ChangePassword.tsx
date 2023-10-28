import useEmployeeProfile from "../hooks/useEmployeeProfile";
import { Button, Flex, PasswordInput } from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { IconArrowLeft } from "@tabler/icons-react";
import { notificationShow } from "../components/Notification";
import { useNavigate } from "react-router-dom";
export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePassword() {
  const { onSubmitChangePasswordForm, handleUpdatePassword } =
    useEmployeeProfile();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const onSubmit: SubmitHandler<IChangePassword> = (data) => {
    onSubmitChangePasswordForm(data, () => {
      notificationShow("success", "Success!", "Cập nhật thông tin thành công!");
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    });
  };
  const handleBack = () => {
    navigate(-1);
  };
  const handleCancel = () => {
    navigate(0);
  };
  return (
    <>
      <Button
        styles={(theme) => ({
          root: {
            backgroundColor: theme.white,
            color: theme.black,
            ...theme.fn.hover({
              color: theme.colors.munsellBlue[0],
              backgroundColor: theme.white,
            }),
            marginTop: "20px",
            paddingLeft: "5px",
          },
        })}
        onClick={handleBack}
      >
        <IconArrowLeft />
      </Button>
      <form className="employee-account-form" onSubmit={handleSubmit(onSubmit)}>
        <Flex
          direction="column"
          gap="md"
          style={{ width: "30vw", margin: "auto", marginTop: "3%" }}
        >
          <Controller
            name="oldPassword"
            control={control}
            rules={{ required: true, minLength: 8 }}
            render={({ field }) => (
              <PasswordInput
                {...field}
                required
                label="Mật khẩu cũ"
                radius="md"
                error={
                  errors.oldPassword
                    ? errors.oldPassword.type === "minLength"
                      ? "Mật khẩu có độ dài ít nhất 8 kí tự"
                      : errors.oldPassword.message
                    : false
                }
              />
            )}
          ></Controller>
          <Controller
            name="newPassword"
            control={control}
            rules={{ required: true, minLength: 8 }}
            render={({ field }) => (
              <PasswordInput
                {...field}
                required
                label="Mật khẩu mới"
                radius="md"
                error={
                  errors.newPassword
                    ? errors.newPassword.type === "minLength"
                      ? "Mật khẩu có độ dài ít nhất 8 kí tự"
                      : errors.newPassword.message
                    : false
                }
              />
            )}
          ></Controller>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{ required: true, minLength: 8 }}
            render={({ field }) => (
              <PasswordInput
                {...field}
                required
                label="Nhập lại mật khẩu mới"
                radius="md"
                error={
                  errors.confirmPassword
                    ? errors.confirmPassword.type === "minLength"
                      ? "Mật khẩu có độ dài ít nhất 8 kí tự"
                      : errors.confirmPassword.message
                    : false
                }
              />
            )}
          ></Controller>
          <Flex
            direction={{ base: "column", sm: "row" }}
            gap={{ base: "sm", sm: "lg" }}
            justify={{ sm: "center" }}
          >
            <Button
              loading={handleUpdatePassword.isLoading}
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
              Lưu
            </Button>
            <Button
              styles={(theme) => ({
                root: {
                  color: theme.colors.munsellBlue[0],
                  background: theme.white,
                  borderColor: theme.colors.munsellBlue[0],
                  ...theme.fn.hover({
                    backgroundColor: theme.fn.darken(theme.white, 0.05),
                  }),
                },
              })}
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </Flex>
        </Flex>
      </form>
    </>
  );
}
