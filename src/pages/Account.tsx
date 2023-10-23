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
import { IconArrowLeft, IconPencil } from "@tabler/icons-react";
import { notificationShow } from "../components/Notification";
import { useNavigate } from "react-router-dom";
import { isEmpty } from "lodash";
import { handleGlobalException } from "../utils/error";
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
  const { fetchEmployeeProfile, onSubmitProfileForm, handleUpdateProfile } =
    useEmployeeProfile();
  const navigate = useNavigate();
  const [data, setData] = useState<Account>();
  async function fetchData() {
    const data = await fetchEmployeeProfile.refetch();
    if (data.isSuccess) {
      const result = data.data.data;
      setData(result)
      Object.keys(result).forEach((key) => {
        setValue(key, result[key]);
      });
    }
     else if (data.isError) {
      const error = data.error.response;
      handleGlobalException(error, ()=>{
        if (error.response.status === 400) {
            const data = error.response.data;
            Object.keys(data).forEach((key) => {
              notificationShow("error", "Error!", data[key]);
            });
        }
      })
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  const theme = useMantineTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
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
    onSubmitProfileForm(data, () => {
      fetchData();
      notificationShow(
        "success",
        "Success!",
        "Cập nhật thông tin thành công!"
      );
    });
  };
  const handleBack = () => {
    navigate(-1);
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
      {!isEmpty(data) && <form onSubmit={handleSubmit(onSubmit)}>
        <Flex
          direction="column"
          gap="md"
          style={{ width: "50vw", margin: "auto" }}
        >
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
              <TextInput
                {...field}
                disabled={true}
                label="Vai trò"
                radius="md"
              />
            )}
          ></Controller>
          {data?.branch !== null && (
            <Controller
              name="branch"
              control={control}
              disabled={true}
              render={({ field }) => (
                <TextInput {...field} label="Chi nhánh" radius="md" />
              )}
            ></Controller>
          )}
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
      </form> }
     
    </>
  );
}
