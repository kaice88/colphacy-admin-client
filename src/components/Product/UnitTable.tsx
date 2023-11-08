import { FC } from 'react';
import { Checkbox, Input, NumberInput, Select, Table } from '@mantine/core';
import { Control, Controller, FieldArrayWithId } from 'react-hook-form';
import { Product } from './type';

const UnitTable: FC<{ control: Control<Product> | undefined; unitFields: FieldArrayWithId<Product, "productUnits", "id">[] }> = ({ unitFields, control }) => {
  const rows = unitFields.map((unitField, index) => (
    <tr key={unitField.id} >
      <td>
        <Controller
          name={`productUnits.${index}.unitId` as const}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              {...field}
              required
              radius="md"
              data={[{ value: "2", label: "a" }, { value: "3", label: "b" }]}
            // error={
            //   errors.category
            //     ? errors.category.type === 'required'
            //       ? 'Tên tài khoản có độ dài ít nhất 6 kí tự'
            //       : errors.category.message
            //     : false
            // }
            />
          )}
        />
      </td>
      <td><Controller
        name={`productUnits.${index}.ratio` as const}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <NumberInput
            {...field}
            w="100%"
            required
          // error={
          //   errors?.ingredients?.[index]?.name
          //     ? errors.ingredients?.[index]?.name?.message
          //     : false
          // }
          />
        )}
      /></td>
      <td><Controller
        name={`productUnits.${index}.salePrice` as const}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            {...field}
            w="100%"
            required
          // error={
          //   errors?.ingredients?.[index]?.name
          //     ? errors.ingredients?.[index]?.name?.message
          //     : false
          // }
          />
        )}
      /></td>
      <td>
        <Controller
          name={`productUnits.${index}.importPrice` as const}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              {...field}
              w="100%"
              required
            // error={
            //   errors?.ingredients?.[index]?.name
            //     ? errors.ingredients?.[index]?.name?.message
            //     : false
            // }
            />
          )}
        />
      </td>
      <td>
        <Controller
          name={`productUnits.${index}.isDefaultUnit` as const}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input.Wrapper
              {...field}
            >
              <Checkbox
              // error={
              //   errors?.ingredients?.[index]?.name
              //     ? errors.ingredients?.[index]?.name?.message
              //     : false
              // } 
              />
            </Input.Wrapper>
          )}
        />
      </td>

    </tr >
  ));

  return (
    <Table horizontalSpacing="xl" striped highlightOnHover withBorder>
      <thead>
        <tr>
          <th>Đơn vị tính</th>
          <th>Tỉ lệ quy đổi</th>
          <th>Giá bán lẻ</th>
          <th>Giá nhập</th>
          <th>Mặc định bán</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default UnitTable;
