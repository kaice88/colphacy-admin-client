import { Button, Flex, TextInput, Text, useMantineTheme } from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

const BranchForm: React.FC<{}> = (props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      username: "",
      openTime: "",
      closeTime: "",
      phoneNumber: "",
    },
  });
  const theme = useMantineTheme();

  const onSubmit = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Text
        fw="600"
        color={theme.colors.cobaltBlue[0]}
        fz="20px"
        align="center"
        pb="lg"
      >
        Thêm chi nhánh
      </Text>
      <Flex direction="column" gap="md">
        <div>
          <Controller
            name="openTime"
            control={control}
            rules={{ required: false, minLength: 6 }}
            render={({ field }) => (
              <TextInput {...field} required label="Giờ mở cửa" radius="md" />
            )}
          ></Controller>
          <Controller
            name="closeTime"
            control={control}
            rules={{ required: false, minLength: 4 }}
            render={({ field }) => (
              <TextInput {...field} required label="Giờ đóng cửa" radius="md" />
            )}
          ></Controller>
        </div>
        <Controller
          name="phoneNumber"
          control={control}
          rules={{ required: false, minLength: 6 }}
          render={({ field }) => (
            <TextInput
              {...field}
              required
              label="Số điện thoại"
              radius="md"
              //   error={
              //     errors.username
              //       ? errors.username.type === "minLength"
              //         ? "Tên tài khoản có độ dài ít nhất 6 kí tự"
              //         : errors.username.message
              //       : false
              //   }
            />
          )}
        ></Controller>
        <Flex justify="center">
          <Button
            // loading={handleCancel.isLoading}
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
            HỦY
          </Button>
          <Button
            // loading={handleSave.isLoading}
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
            LƯU
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};

export default BranchForm;
