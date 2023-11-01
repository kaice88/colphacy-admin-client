import {
  Button,
  Flex,
  TextInput,
  Text,
  useMantineTheme,
  Select,
} from "@mantine/core";
import { notificationShow } from "../Notification";
import { useNavigate } from "react-router-dom";
import useUnit from "../../hooks/useUnit";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

export interface Unit {
  id: number | undefined;
  name: string | undefined;
}
const UnitForm: React.FC<{
  onSuccesSubmit: () => void;
  onCancelForm: () => void;
  title: string;
  unit: Unit | undefined;
}> = ({ onSuccesSubmit, onCancelForm, title, unit }) => {
  const navigate = useNavigate();
  // console.log(unit);
  const {
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      id: unit?.id,
      name: unit?.name,
    },
  });
  const theme = useMantineTheme();
  const { handleAddUnit, onSubmitAddUnitForm, onSubmitDeleteUnitForm } =
    useUnit();
  const onSubmit: SubmitHandler<Unit> = (data) => {
    if (title === "add") {
      onSubmitAddUnitForm(data, () => {
        onSuccesSubmit();
        notificationShow("success", "Success!", "Thêm đơn vị thành công!");
      });
    } else if (title === "delete") {
      onSubmitDeleteUnitForm(data, () => {
        onSuccesSubmit();
        notificationShow("success", "Success!", "Xóa đơn vị thành công!");
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Text
        fw="600"
        color={theme.colors.cobaltBlue[0]}
        fz="18px"
        align="center"
        pb="lg"
      >
        {title === "add" && <>Thêm đơn vị tính</>}
        {title === "edit" && <>Sửa đơn vị tính</>}
        {title === "delete" && <>Xóa đơn vị tính</>}
      </Text>
      {title !== "delete" && (
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextInput {...field} px={10} required label="Tên" radius="md" />
          )}
        ></Controller>
      )}
      <Flex direction="column" gap="md" pb="lg">
        <Flex justify="center">
          <Button
            loading={handleAddUnit.isLoading}
            className="button"
            m={10}
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
            {title !== "delete" && <>Lưu</>}
            {title === "delete" && <>Xóa</>}
          </Button>
          <Button
            className="button cancel"
            m={10}
            variant="outline"
            styles={(theme) => ({
              root: {
                color: theme.colors.munsellBlue[0],
                ...theme.fn.hover({
                  color: theme.fn.darken(theme.colors.munsellBlue[0], 0.1),
                }),
              },
            })}
            onClick={onCancelForm}
          >
            {" "}
            Hủy
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};

export default UnitForm;
