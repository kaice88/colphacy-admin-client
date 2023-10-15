import React, { useEffect, useState } from "react";
import useEmployeeProfile from "../hooks/useEmployeeProfile";
import {
  Avatar,
  BackgroundImage,
  Button,
  Flex,
  Select,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { IconPencil } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
export interface Account {
  id: string;
  fullName: string;
  username: string;
  phone: string;
  gender: string;
  role: string;
  branch: string;
  active: boolean;
}

export default function Account() {
  const [account, setAccount] = useState<Account | null>(null);
  const { fetchEmployeeProfile, onSubmitProfileForm } = useEmployeeProfile();

  useEffect(() => {
    async function fetchData() {
      const data = await fetchEmployeeProfile.refetch();
      if (data.isSuccess) {
        setAccount(data.data.data);
      } else if (data.isError) {
        const error = data.error.response;
        if (error.status === 403) {
        }
      }
    }
    fetchData();
  }, []);
  console.log(account);
  const theme = useMantineTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      id: "",
      fullName: "",
      username: "",
      phone: "",
      gender: "",
      role: "",
      branch: "",
      active: true,
    },
  });
  const changePassword = () => {};
  const onSubmit = () => {};
  // const onSubmit: SubmitHandler<Account> = (data) => {
  //   onSubmitProfileForm(data, (error) => {
  //     if (error.code === "ERR_NETWORK") {
  //       notificationShow("error", "Error!", error.message);
  //     } else if (error.response.status === 500) {
  //       notificationShow("error", "Error!", error.response.data.error);
  //     } else {
  //       setError("username", {
  //         type: "manual",
  //         message:
  //           error.response.status === 404 ? true : error.response.data.username,
  //       });
  //       setError("password", {
  //         type: "manual",
  //         message:
  //           error.response.status === 404
  //             ? error.response.data.error
  //             : error.response.data.password,
  //       });
  //     }
  //   });
  // };
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
        {/* <Button variant="text" onClick={onUpload}>
          {uploadButtonLabel}
        </Button> */}
        <Controller
          name="fullName"
          control={control}
          rules={{ required: false, minLength: 6 }}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Họ tên"
              radius="md"
              value={account?.fullName}
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
          name="username"
          control={control}
          rules={{ required: false, minLength: 6 }}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Tên đăng nhập"
              radius="md"
              value={account?.username}
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
          rules={{ required: false, minLength: 6 }}
          render={({ field }) => (
            <Flex align="center">
              <TextInput
                {...field}
                disabled={true}
                label="SĐT"
                radius="md"
                value={account?.phone}
                error={
                  errors.username
                    ? errors.username.type === "minLength"
                      ? "Tên tài khoản có độ dài ít nhất 6 kí tự"
                      : errors.username.message
                    : false
                }
              />
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
              placeholder={account?.gender}
              data={["MALE", "FEMALE", "OTHERS"]}
            />
          )}
        ></Controller>

        <Controller
          name="role"
          control={control}
          rules={{ required: false, minLength: 6 }}
          render={({ field }) => (
            <TextInput
              {...field}
              disabled={true}
              label="Vai trò"
              value={account?.role}
              radius="md"
              // value={account?.role}
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
          name="branch"
          control={control}
          disabled={true}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Chi nhánh"
              radius="md"
              value={account?.branch}
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
        <Button
          // loading={handleLoginPassword.isLoading}
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
            Quên mật khẩu
          </Text>
        </a>
      </Flex>
    </form>
  );
}
