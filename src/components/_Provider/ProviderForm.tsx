import { Button, Flex, TextInput } from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { handleGlobalException } from "../../utils/error";
import { notificationShow } from "../Notification";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorObject } from "../../types/error";
import { Provider } from "../../types/Provider";
import useProvider from "../../hooks/useProvider";

const ProviderForm: React.FC<{
  onClose: () => void;
  title: string;
  Provider: Provider | undefined;
}> = ({ title, onClose, Provider }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      id: Provider ? Provider.id : "",
      name: Provider ? Provider.name : "",
      address: Provider ? Provider.address : "",
      phone: Provider ? Provider.phone : "",
      email: Provider ? Provider.email : "",
    },
  });
  const {
    handleAddProvider,
    onSubmitAddProviderForm,
    handleUpdateProvider,
    onSubmitUpdateProviderForm,
    fetchProvider,
  } = useProvider(
    {
      offset: 0,
      limit: 10,
      keyword: "",
    },
    {
      offset: 0,
      limit: 5,
    }
  );
  const location = useLocation();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<{
    id: string | 0;
    name: string;
    address: string;
    phone: string | number;
    email: string;
  }> = (data) => {
    if (title === "add") {
      onSubmitAddProviderForm(
        data,
        (error) => {
          const newError = error as ErrorObject;
          handleGlobalException(newError, () => {
            Object.keys(newError.response.data).forEach((key) => {
              const typedKey = key as
                | "name"
                | "address"
                | "phone"
                | "email"
                | `root.${string}`
                | "root";
              setError(typedKey, {
                type: "manual",
                message: newError.response.data[typedKey],
              });
            });
          });
        },
        () => {
          onClose();
          notificationShow(
            "success",
            "Success!",
            "Thêm nhà cung cấp thành công!"
          );
          navigate("/", { state: { from: location.pathname } });
        }
      );
    }
    if (title === "update") {
      onSubmitUpdateProviderForm(
        data,
        (error) => {
          const newError = error as ErrorObject;
          handleGlobalException(newError, () => {
            Object.keys(newError.response.data).forEach((key) => {
              const typedKey = key as
                | "name"
                | "address"
                | "phone"
                | "email"
                | `root.${string}`
                | "root";
              setError(typedKey, {
                type: "manual",
                message: newError.response.data[typedKey],
              });
            });
          });
        },
        async () => {
          await fetchProvider.refetch();
          onClose();
          notificationShow(
            "success",
            "Success!",
            "Sửa nhà cung cấp thành công!"
          );
          navigate("/", { state: { from: location.pathname } });
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {title !== "delete" && (
        <Flex direction="column" gap="md" pb="lg">
          <Controller
            name="name"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <TextInput
                {...field}
                required
                label="Tên nhà cung cấp "
                radius="md"
                error={errors.name ? errors.name.message : false}
              />
            )}
          ></Controller>
          <Controller
            name="address"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <TextInput
                {...field}
                required
                label="Địa chỉ"
                radius="md"
                error={errors.address ? errors.address.message : false}
              />
            )}
          ></Controller>
          <Controller
            name="phone"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <TextInput
                {...field}
                required
                label="SĐT"
                radius="md"
                error={errors.phone ? errors.phone.message : false}
              />
            )}
          ></Controller>
          <Controller
            name="email"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <TextInput
                {...field}
                required
                label="Email"
                radius="md"
                error={errors.email ? errors.email.message : false}
              />
            )}
          ></Controller>
        </Flex>
      )}

      <Flex justify="space-around" align="center" my="xs">
        <Button
          loading={
            handleAddProvider.isLoading || handleUpdateProvider.isLoading
          }
          className="button"
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
      </Flex>
    </form>
  );
};

export default ProviderForm;
