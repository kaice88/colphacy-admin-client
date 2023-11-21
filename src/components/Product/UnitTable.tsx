import { FC } from 'react';
import {
  Button,
  Checkbox,
  Flex,
  Input,
  NumberInput,
  Select,
  Table,
} from '@mantine/core';
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from 'react-hook-form';
import { Product } from './type';
import { transformSelectData } from '../../utils/helper';
import { IconTrashX } from '@tabler/icons-react';

const UnitTable: FC<{
  control: Control<Product> | undefined;
  unitFields: FieldArrayWithId<Product, 'productUnits', 'id'>[];
  errors: FieldErrors<Product>;
  unitData: { id: number; name: string }[];
  appendUnit: UseFieldArrayAppend<Product, 'productUnits'>;
  removeUnit: UseFieldArrayRemove;
  mode: 'ADD' | 'VIEW' | 'EDIT';
}> = ({
  unitFields,
  control,
  errors,
  unitData,
  appendUnit,
  removeUnit,
  mode,
}) => {
  const rows = unitFields.map((unitField, index) => (
    <tr key={unitField.id}>
      <td>
        <Controller
          name={`productUnits.${index}.unitId` as const}
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
                errors.productUnits?.[index]?.unitId
                  ? errors.productUnits?.[index]?.unitId?.type === 'required'
                    ? 'Đơn vị tính không được để trống'
                    : errors.productUnits?.[index]?.unitId?.message
                  : false
              }
            />
          )}
        />
      </td>

      <td>
        <Controller
          name={`productUnits.${index}.ratio` as const}
          control={control}
          rules={{ required: true, min: 1 }}
          render={({ field }) => (
            <NumberInput
              {...field}
              w="100%"
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
                errors?.productUnits?.[index]?.ratio
                  ? errors.productUnits?.[index]?.ratio?.message
                  : false
              }
            />
          )}
        />
      </td>
      <td>
        <Controller
          name={`productUnits.${index}.salePrice` as const}
          control={control}
          rules={{ required: true, min: 1000 }}
          render={({ field }) => (
            <NumberInput
              {...field}
              w="100%"
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
                errors?.productUnits?.[index]?.salePrice
                  ? errors.productUnits?.[index]?.salePrice?.message
                  : false
              }
            />
          )}
        />
      </td>
      <td>
        <Controller
          name={`productUnits.${index}.defaultUnit` as const}
          control={control}
          render={({ field }) => (
            <Input.Wrapper {...field}>
              <Checkbox
                checked={field.value}
                onChange={field.onChange}
                style={
                  mode === 'VIEW'
                    ? {
                        pointerEvents: 'none',
                      }
                    : {}
                }
              />
            </Input.Wrapper>
          )}
        />
      </td>
      {mode !== 'VIEW' && (
        <td>
          <IconTrashX
            className="delete-edit"
            strokeWidth="1.8"
            size="22px"
            onClick={() => removeUnit(index)}
          />
        </td>
      )}
    </tr>
  ));

  return (
    <>
      <Controller
        name="productUnits"
        control={control}
        render={() => (
          <Input.Wrapper
            label="Bảng đơn vị tính"
            required
            error={errors.productUnits?.message}
          >
            <Table
              horizontalSpacing="xl"
              striped
              highlightOnHover
              withBorder
              my="5px"
            >
              <thead>
                <tr>
                  <th>Đơn vị tính</th>
                  <th>Tỉ lệ quy đổi</th>
                  <th>Giá bán lẻ</th>
                  <th>Mặc định bán</th>
                  {mode !== 'VIEW' && <th></th>}
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Input.Wrapper>
        )}
      ></Controller>
      {mode !== 'VIEW' && (
        <Flex justify="flex-end">
          <Button
            my="xs"
            onClick={() =>
              appendUnit({
                unitId: '',
                ratio: 1,
                salePrice: 1000,
                defaultUnit: true,
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
    </>
  );
};

export default UnitTable;
