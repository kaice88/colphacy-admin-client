import { Button, Flex, TextInput } from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { handleGlobalException } from "../../utils/error";
import { notificationShow } from "../Notification";
import useUnit from "../../hooks/useUnit";

export interface Unit {
  id: number | undefined;
  name: string | undefined;
}
const UnitForm: React.FC<{
  onClose: () => void;
  title: string;
}> = ({ title, onClose }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });
  const { handleAddUnit, onSubmitAddUnitForm } = useUnit();
  const onSubmit: SubmitHandler<{ name: string }> = (data) => {
    if (title === "add") {
      onSubmitAddUnitForm(
        data,
        (error) => {
          handleGlobalException(error, () => {
            Object.keys(error.response.data).forEach((key) => {
              setError(key, {
                type: "manual",
                message: error.response.data[key],
              });
            });
          });
        },
        () => {
          onClose();
          notificationShow("success", "Success!", "Thêm đơn vị thành công!");
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {title !== "delete" && (
        <Controller
          name="name"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <TextInput
              {...field}
              required
              label="Tên đơn vị"
              radius="md"
              error={errors.name ? errors.name.message : false}
            />
          )}
        ></Controller>
      )}

      <Flex justify="space-around" align="center" my="xs">
        <Button
          loading={handleAddUnit.isLoading}
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
        <Button
          className="button cancel"
          variant="outline"
          styles={(theme) => ({
            root: {
              color: theme.colors.munsellBlue[0],
              ...theme.fn.hover({
                color: theme.fn.darken(theme.colors.munsellBlue[0], 0.1),
              }),
            },
          })}
          onClick={onClose}
        >
          {" "}
          Hủy
        </Button>
      </Flex>
    </form>
  );
};

export default UnitForm;
