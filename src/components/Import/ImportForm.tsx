import {
  Button,
  FileButton,
  Flex,
  Input,
  NumberInput,
  Select,
  TextInput,
  Textarea,
} from '@mantine/core';

import { Controller, useFieldArray, useForm } from 'react-hook-form';

const ImportForm: React.FC<{
  onClose: () => void;
  importId: number | null;
  mode: 'ADD' | 'VIEW' | 'EDIT';
}> = ({ onClose, importId, mode }) => {
  const {
    control,
    handleSubmit,
    watch,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Product>({
    defaultValues: {
      branch: '',
      invoices: '',
    },
  });

  //   const {
  //     fields: ingredientFields,
  //     append: appendIngredient,
  //     remove: removeIngredient,
  //   } = useFieldArray({
  //     name: 'ingredients',
  //     control,
  //   });

  const onSubmit = (data: Product) => {
    // onSubmitImportForm(
    //   data,
    //   (error) => {
    //     handleGlobalException(error, () => {
    //       Object.keys(error.response.data).forEach((key) => {
    //         setError(key, {
    //           type: 'manual',
    //           message: error.response.data[key],
    //         });
    //       });
    //     });
    //   },
    //   () => {
    //     notificationShow(
    //       'success',
    //       'Success!',
    //       `${
    //         !productId
    //           ? 'Thêm sản phẩm mới thành công!'
    //           : 'Cập nhật sản phẩm thành công!'
    //       } `,
    //     );
    //     onClose();
    //   },
    // );
  };

  //   useEffect(() => {
  //     if (productData && mode !== 'ADD') {
  //       const transformData = {
  //         ...productData,
  //         categoryId: productData.categoryId.toString(),
  //         images: productData.images.map((item) => ({ url: item })),
  //         productUnits: productData.productUnits.map((item) => ({
  //           ...item,
  //           unitId: item.unitId?.toString(),
  //         })),
  //       };
  //       type TransformDataKeys = keyof typeof transformData;

  //       (Object.keys(transformData) as TransformDataKeys[]).map(
  //         (item: TransformDataKeys) => {
  //           setValue(item, transformData[item]);
  //         },
  //       );
  //     }
  //   }, [productData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="branch"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextInput
            {...field}
            disabled={mode === 'VIEW'}
            required
            label="Tên chi nhánh"
            radius="md"
            // error={errors.name ? errors.name.message : false}
          />
        )}
      />

      {mode !== 'VIEW' && (
        <Flex justify="flex-end" align="center" my="xs">
          <Button
            mx="xs"
            className="button"
            styles={(theme) => ({
              root: {
                backgroundColor: theme.colors.munsellBlue[0],
                ...theme.fn.hover({
                  backgroundColor: theme.fn.darken(
                    theme.colors.munsellBlue[0],
                    0.1,
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
            Hủy
          </Button>
        </Flex>
      )}
    </form>
  );
};

export default ImportForm;
