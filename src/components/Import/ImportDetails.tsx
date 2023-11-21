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
  importDetail,
  setValue,
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
    } catch (error) {
      handleGlobalException(error, () => {});
    }
  }
  useEffect(() => {
    if (importDetail && mode !== 'ADD') {
      getUnitByProduct(Number(importField.product));
      setSearchProduct(importDetail.product.name);
    }
  }, []);

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
              style={
                mode === 'VIEW'
                  ? {
                      pointerEvents: 'none',
                    }
                  : {}
              }
              data={transformSelectData(productData || [])}
              searchable
              onSearchChange={(value) => {
                setSearchProduct(value);
              }}
              onChange={(value) => {
                getUnitByProduct(Number(value));
                field.onChange(value);
                setValue(`importDetails.${index}.unitId`, '');
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
              style={
                mode === 'VIEW'
                  ? {
                      pointerEvents: 'none',
                    }
                  : {}
              }
              required
              radius="md"
              data={transformSelectData(unitData)}
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
              style={
                mode === 'VIEW'
                  ? {
                      pointerEvents: 'none',
                    }
                  : {}
              }
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
              style={
                mode === 'VIEW'
                  ? {
                      pointerEvents: 'none',
                    }
                  : {}
              }
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
              style={
                mode === 'VIEW'
                  ? {
                      pointerEvents: 'none',
                    }
                  : {}
              }
              required
              min={1000}
              step={10000}
              parser={(value) => value.replace(/[^\d.]/g, '')}
              formatter={(value) =>
                !Number.isNaN(parseFloat(value))
                  ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                  : ''
              }
              error={
                errors?.importDetails?.[index]?.importPrice
                  ? errors.importDetails?.[index]?.importPrice?.message
                  : false
              }
            />
          )}
        />
      </td>
      <td
        style={{
          fontWeight: 'normal',
        }}
      >
        {(
          watch(`importDetails.${index}.importPrice`) *
          watch(`importDetails.${index}.quantity`)
        ).toLocaleString('vi-VN')}{' '}
        VNĐ
        {/* <Input
          style={{
            pointerEvents: 'none',
          }}
          required
          min={1000}
          step={10000}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value))
              ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
              : ''
          }
          value={
            watch(`importDetails.${index}.importPrice`) *
            watch(`importDetails.${index}.quantity`)
          }
        /> */}
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
  importDetails,
  appendImport,
  removeImport,
  mode,
  watch,
  setValue,
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
      importDetail={importDetails?.[index]}
      setValue={setValue}
    ></Item>
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
    <div style={{ height: '70%', paddingBottom: '10px' }}>
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
                {mode !== 'VIEW' && <th></th>}
                <th>Tổng tiền</th>
                <th
                  style={{
                    fontWeight: 'normal',
                  }}
                >
                  {calTotal().toLocaleString('vi-VN')} VNĐ
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
