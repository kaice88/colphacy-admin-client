import { Button, Flex, TextInput } from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useCategory from "../../hooks/useCategory";
import { handleGlobalException } from "../../utils/error";
import { notificationShow } from "../Notification";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorObject } from "../../types/error";

export interface Category {
  id: number | undefined;
  name: string ;
}
const CategoryForm: React.FC<{
  onClose: () => void;
  title: string;
  category: Category | undefined;
}> = ({ title, onClose, category }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      id: category ? category.id : "",
      name: category ? category.name : "",
    },
  });
  const {
    handleAddCategory,
    onSubmitAddCategoryForm,
    onSubmitUpdateCategoryForm,
    handleUpdateCategory,
  } = useCategory(
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
    id: string | number | undefined;
    name: string;
  }> = (data) => {
    if (title === "add") {
      onSubmitAddCategoryForm(
        { name: data.name },
        (error) => {
          const newError = error as ErrorObject;
          handleGlobalException(newError, () => {
            setError("name", {
              type: "manual",
              message: newError.response.data.name,
            });
          });
        },
        () => {
          onClose();
          notificationShow("success", "Success!", "Thêm danh mục thành công!");
          navigate("/", { state: { from: location.pathname } });
        }
      );
    }
    if (title === "update") {
      onSubmitUpdateCategoryForm(
        data as Category, 
        (error) => {
          const newError = error as ErrorObject;
          handleGlobalException(newError, () => {
            setError("name", {
              type: "manual",
              message: newError.response.data.name,
            });
          });
        },
        () => {
          onClose();
          notificationShow("success", "Success!", "Sửa danh mục thành công!");
          navigate("/", { state: { from: location.pathname } });
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
              label="Tên danh mục"
              radius="md"
              error={errors.name ? errors.name.message : false}
            />
          )}
        ></Controller>
      )}

      <Flex justify="space-around" align="center" my="xs">
        <Button
          loading={handleAddCategory.isLoading}
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
          loading={handleUpdateCategory.isLoading}
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

export default CategoryForm;
