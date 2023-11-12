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
import { IconPhotoPlus, IconTrashOff } from '@tabler/icons-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import useImage from '../../hooks/useImage';
import { Product } from './type';
import ImageUploaded from './ImageUploaded';
import UnitTable from './UnitTable';
import useProductDetail from '../../hooks/useProductDetail';
import { transformSelectData } from '../../utils/helper';
import { handleGlobalException } from '../../utils/error';
import { ProductStatus } from '../../enums/Product';
import { notificationShow } from '../Notification';

const ProductForm: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { uploadImages } = useImage();
  const { unitData, categoryData, onSubmitAddProductForm } = useProductDetail();

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<Product>({
    defaultValues: {
      name: '',
      categoryId: '',
      packing: '',
      manufacturer: '',
      brandOrigin: '',
      indications: '',
      registrationNumber: '',
      ingredients: [{ name: '', amount: 0.01 }],
      uses: '',
      sideEffects: '',
      storage: '',
      notes: '',
      usage: '',
      status: 'FOR_SALE',
      images: [],
      productUnits: [
        {
          unitId: '',
          ratio: 1,
          salePrice: 1000,
          defaultUnit: true,
        },
      ],
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    name: 'ingredients',
    control,
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    name: 'images',
    control,
    rules: { required: watch('status') === 'FOR_SALE' ? true : false },
  });

  const {
    fields: unitFields,
    append: appendUnit,
    remove: removeUnit,
  } = useFieldArray({
    name: 'productUnits',
    control,
    rules: { required: true },
  });

  const handleUpload = (items: File[]) => {
    const formData = new FormData();
    items.forEach((item) => {
      formData.append('image', item);
    });
    uploadImages.mutate(formData, {
      onSuccess: (data) => {
        data.data.forEach((item: string) => {
          appendImage({ url: item });
        });
      },
    });
  };

  const onSubmit = (data: Product) => {
    console.log(data);
    onSubmitAddProductForm(data, (error) => {
      handleGlobalException(error, () => {
        Object.keys(error.response.data).forEach((key) => {
          setError(key, {
            type: 'manual',
            message: error.response.data[key],
          });
        });
      });
    });
  };

  return (
    unitData !== undefined &&
    categoryData !== undefined && (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextInput
              {...field}
              required
              label="Tên sản phẩm"
              radius="md"
              error={errors.name ? errors.name.message : false}
              className="product-input"
            />
          )}
        />
        <Controller
          name="categoryId"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              {...field}
              required
              radius="md"
              label="Danh mục"
              data={transformSelectData(categoryData)}
              className="product-input"
              error={
                errors.categoryId
                  ? errors.categoryId.type === 'required'
                    ? 'Danh mục không được để trống'
                    : errors.categoryId.message
                  : false
              }
            />
          )}
        />

        <Input.Wrapper label="Thành phần" required className="product-input">
          {ingredientFields.map((imageField, index) => (
            <Flex justify="space-between" gap="5px" key={imageField.id} py={3}>
              <Controller
                name={`ingredients.${index}.name` as const}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    {...field}
                    w="100%"
                    required
                    error={
                      errors.ingredients?.[index]?.name
                        ? errors.ingredients?.[index]?.name?.message
                        : false
                    }
                  />
                )}
              />
              <Controller
                name={`ingredients.${index}.amount` as const}
                control={control}
                rules={{ required: true, min: 0.01 }}
                render={({ field }) => (
                  <NumberInput
                    {...field}
                    w="100%"
                    precision={2}
                    min={0.01}
                    required
                    error={
                      errors?.ingredients?.[index]?.amount
                        ? errors.ingredients?.[index]?.amount?.message
                        : false
                    }
                  />
                )}
              />
              <Button
                disabled={ingredientFields.length === 1}
                onClick={() => {
                  removeIngredient(index);
                }}
                variant="light"
                color="pink"
                styles={() => ({
                  root: {
                    width: '10%',
                    height: '36px',
                    padding: 0,
                    border: '0px',
                  },
                  label: {
                    fontWeight: 500,
                  },
                })}
              >
                <IconTrashOff size="1.2rem" />
              </Button>
            </Flex>
          ))}

          <Button
            onClick={() => {
              appendIngredient({ name: '', amount: 0.01 });
            }}
            variant="default"
            styles={(theme) => ({
              root: {
                width: '100%',
                height: '30px',
                padding: 0,
                border: '0px',
                backgroundColor: theme.fn.lighten(
                  theme.colors.flashWhite[0],
                  0.3,
                ),
                ...theme.fn.hover({
                  backgroundColor: theme.colors.flashWhite[0],
                }),
              },
              label: {
                fontWeight: 500,
              },
            })}
          >
            + Thêm
          </Button>
        </Input.Wrapper>

        <Controller
          name="packing"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextInput
              {...field}
              required
              label="Quy cách"
              radius="md"
              error={errors.packing ? errors.packing.message : false}
              className="product-input"
            />
          )}
        />
        <Controller
          name="manufacturer"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextInput
              {...field}
              required
              label="Nhà sản xuất"
              radius="md"
              error={errors.manufacturer ? errors.manufacturer.message : false}
              className="product-input"
            />
          )}
        />
        <Controller
          name="brandOrigin"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextInput
              {...field}
              required
              label="Xuất xứ thương hiệu"
              radius="md"
              error={errors.brandOrigin ? errors.brandOrigin.message : false}
              className="product-input"
            />
          )}
        />
        <Controller
          name="indications"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextInput
              {...field}
              required
              label="Chỉ định"
              radius="md"
              error={errors.indications ? errors.indications.message : false}
              className="product-input"
            />
          )}
        />
        <Controller
          name="registrationNumber"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextInput
              {...field}
              required
              label="Số đăng kí"
              radius="md"
              error={
                errors.registrationNumber
                  ? errors.registrationNumber.message
                  : false
              }
              className="product-input"
            />
          )}
        />
        <Controller
          name="uses"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Textarea
              {...field}
              required
              radius="md"
              label="Công dụng"
              autosize
              minRows={2}
              maxRows={6}
              className="product-input"
              error={errors.uses ? errors.uses.message : false}
            />
          )}
        />
        <Controller
          name="usage"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Textarea
              {...field}
              required
              radius="md"
              label="Cách dùng"
              autosize
              minRows={2}
              maxRows={6}
              className="product-input"
              error={errors.usage ? errors.usage.message : false}
            />
          )}
        />
        <Controller
          name="sideEffects"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <Textarea
              {...field}
              radius="md"
              label="Tác dụng phụ"
              autosize
              minRows={2}
              maxRows={6}
              className="product-input"
              error={errors.sideEffects ? errors.sideEffects.message : false}
            />
          )}
        />
        <Controller
          name="notes"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <Textarea
              {...field}
              radius="md"
              label="Lưu ý"
              autosize
              minRows={2}
              maxRows={6}
              className="product-input"
              error={errors.notes ? errors.notes.message : false}
            />
          )}
        />
        <Controller
          name="storage"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Textarea
              {...field}
              required
              radius="md"
              label="Bảo quản"
              autosize
              minRows={2}
              maxRows={6}
              className="product-input"
              error={errors.storage ? errors.storage.message : false}
            />
          )}
        />
        <Controller
          name="status"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <Select
              {...field}
              required
              radius="md"
              label="Trạng thái"
              data={[
                { value: 'PRE_ORDER', label: ProductStatus.PRE_ORDER },
                { value: 'DISCONTINUED', label: ProductStatus.DISCONTINUED },
                { value: 'FOR_SALE', label: ProductStatus.FOR_SALE },
              ]}
              className="product-input"
              error={
                errors.status
                  ? errors.status.type === 'required'
                    ? 'Trạng thái sản phẩm không được để trống'
                    : errors.status.message
                  : false
              }
            />
          )}
        />
        <Input.Wrapper
          label="Ảnh sản phẩm"
          py="7px"
          error={
            errors.images?.root
              ? errors.images?.root.type === 'required'
                ? "Thêm hình ảnh khi trạng thái sản phẩm là 'Bán'"
                : errors.images?.root.message
              : false
          }
        >
          <Flex
            gap="md"
            justify="flex-start"
            align="center"
            direction="row"
            wrap="wrap"
            py={5}
          >
            <FileButton
              onChange={handleUpload}
              accept="image/png,image/jpeg"
              multiple
            >
              {(props) => (
                <Button
                  {...props}
                  variant="default"
                  styles={() => ({
                    root: {
                      width: '100px',
                      height: '100px',
                    },
                  })}
                >
                  <IconPhotoPlus />
                </Button>
              )}
            </FileButton>
            {imageFields.map((imageField, index) => (
              <ImageUploaded
                key={imageField.id}
                imageField={imageField}
                index={index}
                control={control}
                removeImage={removeImage}
              />
            ))}
          </Flex>
        </Input.Wrapper>
        <UnitTable
          control={control}
          unitFields={unitFields}
          errors={errors}
          unitData={unitData}
          appendUnit={appendUnit}
          removeUnit={removeUnit}
        />
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
      </form>
    )
  );
};

export default ProductForm;
