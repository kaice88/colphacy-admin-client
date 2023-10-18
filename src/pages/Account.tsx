import { useEffect, useState } from "react";
import useEmployeeProfile from "../hooks/useEmployeeProfile";
import {
  Avatar,
  Button,
  Flex,
  Select,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { IconPencil } from "@tabler/icons-react";
import { notificationShow } from "../components/Notification";
export interface Account {
  id: number;
  fullName: string;
  username: string;
  phone: string;
  gender: string;
  role: string;
  branch: string;
  active: boolean;
}

export default function Account() {
  const { fetchEmployeeProfile, onSubmitProfileForm, handleUpdateProfile } = useEmployeeProfile();

  useEffect(() => {
    async function fetchData() {
      const data = await fetchEmployeeProfile.refetch();
      if (data.isSuccess) {
        const a = data.data.data;
        Object.keys(a).forEach((key) => {
          setValue(key, a[key]);
        });
      } else if (data.isError) {
        const error = data.error.response;
        if (error.code === "ERR_NETWORK") {
          notificationShow("error", "Error!", error.message);
        } else if (error.response.status === 500) {
          notificationShow("error", "Error!", error.response.data.error);
        }
      }
    }
    fetchData();
  }, []);
  const theme = useMantineTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm({
    defaultValues: {
      fullName: "",
      username: "",
      phone: "",
      gender: "",
      role: "",
      branch: "",
      active: false,
    },
  });
  const changePassword = () => {};
  const onSubmit: SubmitHandler<Account> = (data) => {
    onSubmitProfileForm(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex
        direction="column"
        gap="md"
        style={{ width: "50vw", margin: "auto" }}
      >
        <Avatar
          styles={() => ({
            placeholderIcon: {
              backgroundColor: "white",
            },
          })}
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            alignSelf: "center",
          }}
        />
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Họ tên"
              radius="md"
              required
              onChange={(value) => {
                field.onChange(value);
              }}
            />
          )}
        ></Controller>
        <Controller
          name="username"
          control={control}
          rules={{ required: true, minLength: 6 }}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Tên đăng nhập"
              radius="md"
              required
              onChange={(value) => {
                field.onChange(value);
              }}
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
          name="phone"
          control={control}
          rules={{
            required: false,
          }}
          render={({ field }) => (
            <Flex align="center">
              <TextInput {...field} disabled={true} label="SĐT" radius="md" />
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
                onClick={changePassword}
              >
                <IconPencil />
              </Button>
            </Flex>
          )}
        ></Controller>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Giới tính"
              data={["MALE", "FEMALE", "OTHER"]}
              onChange={(value) => {
                field.onChange(value);
              }}
            />
          )}
        ></Controller>

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <TextInput {...field} disabled={true} label="Vai trò" radius="md" />
          )}
        ></Controller>
        <Controller
          name="branch"
          control={control}
          disabled={true}
          render={({ field }) => (
            <TextInput {...field} label="Chi nhánh" radius="md" />
          )}
        ></Controller>
        <Button
          loading={handleUpdateProfile.isLoading}
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
          Lưu thông tin
        </Button>
        <a href="/editPassword">
          <Text color={theme.colors.munsellBlue[0]} align="center">
            Đổi mật khẩu
          </Text>
        </a>
      </Flex>
    </form>
  );
}
