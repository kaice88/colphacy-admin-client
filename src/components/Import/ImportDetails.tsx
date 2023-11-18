import { FC, useEffect, useState } from 'react';
import { Button, Flex, Input, NumberInput, Select, Table } from '@mantine/core';
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from 'react-hook-form';
import { transformSelectData } from '../../utils/helper';
import { IconTrashX } from '@tabler/icons-react';
import { DatePickerInput, DateTimePicker } from '@mantine/dates';
import { useDebouncedValue } from '@mantine/hooks';
import useImportDetail from '../../hooks/useImportDetail';
import axios from '../../settings/axios';
import { handleGlobalException } from '../../utils/error';

const Item = ({
  importField,
  control,
  errors,
  removeImport,
  mode,
  watch,
  index,
}) => {
  const [searchProduct, setSearchProduct] = useState('');
  const [productDebounced] = useDebouncedValue(searchProduct, 200);
  const { productData } = useImportDetail(null, '', '', productDebounced);
  const [unitData, setUnitData] = useState([]);

  async function getUnitByProduct(productId) {
    try {
      if (productId) {
        const unitData = await axios.get('/units/products', {
          params: {
            productId,
          },
        });

        setUnitData(unitData?.data);
      }
      // return [];
    } catch (error) {
      handleGlobalException(error, () => {});
    }
  }
  return (
    <tr key={importField.id} className="importDetailsBody">
      {/* <td>{index + 1}</td> */}
      <td
        style={{
          width: '150px',
        }}
      >
        <Controller
          name={`importDetails.${index}.product` as const}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              {...field}
              required
              radius="md"
              disabled={mode === 'VIEW'}
              data={transformSelectData(productData || [])}
              searchable
              onSearchChange={(value) => {
                setSearchProduct(value);
              }}
              onChange={(value) => {
                getUnitByProduct(Number(value));
                field.onChange(value);
              }}
              error={
                errors.importDetails?.[index]?.product
                  ? errors.importDetails?.[index]?.product?.type === 'required'
                    ? 'Sản phẩm không được để trống'
                    : errors.importDetails?.[index]?.product?.message
                  : false
              }
            />
          )}
        />
      </td>
      <td>
        <Controller
          name={`importDetails.${index}.unitId` as const}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              {...field}
              disabled={mode === 'VIEW'}
              required
              radius="md"
              data={transformSelectData(unitData)}
              // data={getUnitByProduct(
              //   watch(`importDetails.${index}.product`),
              // ).then((data) =>
              //   (data || []).map((item) => ({
              //     value: item.id.toString(),
              //     label: item.name,
              //   })),
              // )}
              error={
                errors.importDetails?.[index]?.unitId
                  ? errors.importDetails?.[index]?.unitId?.type === 'required'
                    ? 'Đơn vị tính không được để trống'
                    : errors.importDetails?.[index]?.unitId?.message
                  : false
              }
            />
          )}
        />
      </td>

      <td>
        <Controller
          name={`importDetails.${index}.expirationDate` as const}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <DatePickerInput
              {...field}
              valueFormat="DD/MM/YYYY"
              disabled={mode === 'VIEW'}
              required
              radius="md"
              dropdownType="modal"
              error={
                errors?.importDetails?.[index]?.expirationDate
                  ? errors.importDetails?.[index]?.expirationDate?.message
                  : false
              }
            />
          )}
        />
      </td>
      <td>
        <Controller
          name={`importDetails.${index}.quantity` as const}
          control={control}
          rules={{ required: true, min: 1 }}
          render={({ field }) => (
            <NumberInput
              {...field}
              disabled={mode === 'VIEW'}
              required
              min={1}
              error={
                errors?.importDetails?.[index]?.quantity
                  ? errors.importDetails?.[index]?.quantity?.message
                  : false
              }
            />
          )}
        />
      </td>
      <td>
        <Controller
          name={`importDetails.${index}.importPrice` as const}
          control={control}
          rules={{ required: true, min: 1000 }}
          render={({ field }) => (
            <NumberInput
              {...field}
              disabled={mode === 'VIEW'}
              required
              min={1000}
              step={1000}
              error={
                errors?.importDetails?.[index]?.importPrice
                  ? errors.importDetails?.[index]?.importPrice?.message
                  : false
              }
            />
          )}
        />
      </td>
      <td>
        <NumberInput
          disabled={true}
          required
          min={1000}
          step={1000}
          value={
            watch(`importDetails.${index}.importPrice`) *
            watch(`importDetails.${index}.quantity`)
          }
        />
      </td>
      {mode !== 'VIEW' && (
        <td>
          <IconTrashX
            className="delete-edit"
            strokeWidth="1.8"
            size="22px"
            onClick={() => removeImport(index)}
          />
        </td>
      )}
    </tr>
  );
};

const ImportDetails: FC<{
  control: Control<Product> | undefined;
  importFields: FieldArrayWithId<Product, 'importDetails', 'id'>[];
  errors: FieldErrors<Product>;
  unitData: { id: number; name: string }[];
  appendImport: UseFieldArrayAppend<Product, 'importDetails'>;
  removeImport: UseFieldArrayRemove;
  mode: 'ADD' | 'VIEW' | 'EDIT';
}> = ({
  importFields,
  control,
  errors,
  unitData,
  appendImport,
  removeImport,
  mode,
  watch,
}) => {
  const rows = importFields.map((importField, index) => (
    <Item
      key={importField.id}
      index={index}
      importField={importField}
      control={control}
      errors={errors}
      removeImport={removeImport}
      mode={mode}
      watch={watch}
    ></Item>
    // <tr key={importField.id} className="importDetailsBody">
    //   {/* <td>{index + 1}</td> */}
    //   <td
    //     style={{
    //       width: '150px',
    //     }}
    //   >
    //     <Controller
    //       name={`importDetails.${index}.product` as const}
    //       control={control}
    //       rules={{ required: true }}
    //       render={({ field }) => (
    //         <Select
    //           {...field}
    //           required
    //           radius="md"
    //           disabled={mode === 'VIEW'}
    //           data={transformSelectData(productData || [])}
    //           searchable
    //           onSearchChange={(value) => {
    //             setSearchProduct(value);
    //           }}
    //           error={
    //             errors.importDetails?.[index]?.product
    //               ? errors.importDetails?.[index]?.product?.type === 'required'
    //                 ? 'Sản phẩm không được để trống'
    //                 : errors.importDetails?.[index]?.product?.message
    //               : false
    //           }
    //         />
    //       )}
    //     />
    //   </td>
    //   <td>
    //     <Controller
    //       name={`importDetails.${index}.unitId` as const}
    //       control={control}
    //       rules={{ required: true }}
    //       render={({ field }) => (
    //         <Select
    //           {...field}
    //           disabled={mode === 'VIEW'}
    //           required
    //           radius="md"
    //           data={getUnitByProduct(
    //             watch(`importDetails.${index}.product`),
    //           ).then((data) =>
    //             (data || []).map((item) => ({
    //               value: item.id.toString(),
    //               label: item.name,
    //             })),
    //           )}
    //           error={
    //             errors.importDetails?.[index]?.unitId
    //               ? errors.importDetails?.[index]?.unitId?.type === 'required'
    //                 ? 'Đơn vị tính không được để trống'
    //                 : errors.importDetails?.[index]?.unitId?.message
    //               : false
    //           }
    //         />
    //       )}
    //     />
    //   </td>

    //   <td>
    //     <Controller
    //       name={`importDetails.${index}.expirationDate` as const}
    //       control={control}
    //       rules={{ required: true }}
    //       render={({ field }) => (
    //         <DateTimePicker
    //           {...field}
    //           disabled={mode === 'VIEW'}
    //           required
    //           radius="md"
    //           dropdownType="modal"
    //           error={
    //             errors?.importDetails?.[index]?.expirationDate
    //               ? errors.importDetails?.[index]?.expirationDate?.message
    //               : false
    //           }
    //         />
    //       )}
    //     />
    //   </td>
    //   <td>
    //     <Controller
    //       name={`importDetails.${index}.quantity` as const}
    //       control={control}
    //       rules={{ required: true, min: 1 }}
    //       render={({ field }) => (
    //         <NumberInput
    //           {...field}
    //           disabled={mode === 'VIEW'}
    //           required
    //           min={1}
    //           error={
    //             errors?.importDetails?.[index]?.quantity
    //               ? errors.importDetails?.[index]?.quantity?.message
    //               : false
    //           }
    //         />
    //       )}
    //     />
    //   </td>
    //   <td>
    //     <Controller
    //       name={`importDetails.${index}.importPrice` as const}
    //       control={control}
    //       rules={{ required: true, min: 1000 }}
    //       render={({ field }) => (
    //         <NumberInput
    //           {...field}
    //           disabled={mode === 'VIEW'}
    //           required
    //           min={1000}
    //           step={1000}
    //           error={
    //             errors?.importDetails?.[index]?.importPrice
    //               ? errors.importDetails?.[index]?.importPrice?.message
    //               : false
    //           }
    //         />
    //       )}
    //     />
    //   </td>
    //   <td>
    //     <NumberInput
    //       disabled={true}
    //       required
    //       min={1000}
    //       step={1000}
    //       value={
    //         watch(`importDetails.${index}.importPrice`) *
    //         watch(`importDetails.${index}.quantity`)
    //       }
    //     />
    //   </td>
    //   {mode !== 'VIEW' && (
    //     <td>
    //       <IconTrashX
    //         className="delete-edit"
    //         strokeWidth="1.8"
    //         size="22px"
    //         onClick={() => removeImport(index)}
    //       />
    //     </td>
    //   )}
    // </tr>
  ));

  const calTotal = () => {
    return importFields.reduce(
      (accumulator, currentValue, currentIndex) =>
        accumulator +
        watch(`importDetails.${currentIndex}.importPrice`) *
          watch(`importDetails.${currentIndex}.quantity`),
      0,
    );
  };
  return (
    <div style={{ height: '70%' }}>
      <Controller
        name="importDetails"
        control={control}
        render={() => (
          <Input.Wrapper required error={errors.importDetails?.message}>
            <Table
              horizontalSpacing="xl"
              striped
              highlightOnHover
              withBorder
              my="5px"
            >
              <thead>
                <tr className="importDetailsHead">
                  {/* <th>STT</th> */}
                  <th>Tên sản phẩm</th>
                  <th>Đơn vị tính</th>
                  <th>Hạn dùng</th>
                  <th>Số lượng</th>
                  <th>Giá nhập</th>
                  <th>Tổng tiền</th>
                  {mode !== 'VIEW' && <th></th>}
                </tr>
              </thead>
              <tbody>{rows}</tbody>

              <tfoot
                style={{
                  height: '35px',
                }}
              >
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th>Tổng tiền</th>
                <th
                  style={{
                    fontWeight: 'normal',
                  }}
                >
                  {calTotal().toLocaleString('vi-VN')} VND
                </th>
              </tfoot>
            </Table>
          </Input.Wrapper>
        )}
      ></Controller>
      {mode !== 'VIEW' && (
        <Flex justify="flex-end">
          <Button
            my="xs"
            onClick={() =>
              appendImport({
                product: '',
                unitId: '',
                expirationDate: new Date(),
                quantity: 1,
                importPrice: 1000,
              })
            }
            variant="default"
            styles={(theme) => ({
              root: {
                textAlign: 'center',
                width: '10%',
                minWidth: '70px',
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
        </Flex>
      )}
    </div>
  );
};

export default ImportDetails;
