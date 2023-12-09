import { FC, useEffect, useState } from 'react';
import { Button, Flex, Input, NumberInput, Select, Table, Text, Title } from '@mantine/core';
import {
    Control,
    Controller,
    FieldArrayWithId,
    FieldErrors,
    UseFieldArrayAppend,
    UseFieldArrayRemove,
    UseFormRegister,
} from 'react-hook-form';
import { transformSelectData, transformSelectUnitData } from '../../utils/helper';
import { IconTrashX } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import axios from '../../settings/axios';
import { handleGlobalException } from '../../utils/error';
import { Order } from './type';
import { useAddOrder } from '../../hooks/useOrder';

interface ProductUnits {
    unitId: number,
    unitName: string,
    salePrice: number
}

const Item = ({
    orderFields,
    control,
    errors,
    removeOrder,
    watch,
    index,
    items,
    setValue,
}) => {
    const [searchProduct, setSearchProduct] = useState('');
    const [productDebounced] = useDebouncedValue(searchProduct, 200);
    const { productData } = useAddOrder("", productDebounced);
    const [unitData, setUnitData] = useState<ProductUnits[]>([]);
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
            handleGlobalException(error, () => { });
        }
    }
    const getPriceByUnitProduct = (unitId: number) => {
        console.log(unitId);
        const unit = unitData.filter(unit => unit.unitId == unitId);
        setValue(`items.${index}.salePrice`, unit[0] ? unit[0].salePrice : '');
    }

    return (
        <tr key={orderFields.id} className="itemsBody">
            <td
                style={{
                    width: '5em',
                }}>{index + 1}</td>
            <td
                style={{
                    width: '30em',
                }}
            >
                <Controller
                    name={`items.${index}.productId` as const}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            required
                            radius="md"
                            data={transformSelectData(productData || [])}
                            searchable
                            onSearchChange={(value) => {
                                if (value === "") {
                                    setUnitData([])
                                }
                                setSearchProduct(value);
                            }}
                            onChange={(value) => {
                                getUnitByProduct(Number(value));
                                field.onChange(value);
                                // setValue(`items.${index}.unitId`, '');
                            }}
                            error={
                                errors.items?.[index]?.product
                                    ? errors.items?.[index]?.product?.type === 'required'
                                        ? 'Sản phẩm không được để trống'
                                        : errors.items?.[index]?.product?.message
                                    : false
                            }
                        />
                    )}
                />
            </td>
            <td
                style={{
                    width: '10em',
                }}
            >
                <Controller
                    name={`items.${index}.unitId` as const}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            required
                            radius="md"
                            onChange={(value) => {
                                field.onChange(value)
                                getPriceByUnitProduct(Number(value))
                            }}
                            data={transformSelectUnitData(unitData)}
                            error={
                                errors.items?.[index]?.unitId
                                    ? errors.items?.[index]?.unitId?.type === 'required'
                                        ? 'Đơn vị tính không được để trống'
                                        : errors.items?.[index]?.unitId?.message
                                    : false
                            }
                        />
                    )}
                />
            </td>
            <td
                style={{
                    width: '10em',
                }}
            >
                <Controller
                    name={`items.${index}.quantity` as const}
                    control={control}
                    rules={{ required: true, min: 1 }}
                    render={({ field }) => (
                        <NumberInput
                            {...field}
                            required
                            min={1}
                            error={
                                errors?.items?.[index]?.quantity
                                    ? errors.items?.[index]?.quantity?.message
                                    : false
                            }
                        />
                    )}
                />

            </td>
            <td>
                <Controller
                    key={index}
                    name={`items.${index}.salePrice` as const}
                    control={control}
                    render={({ field }) => (
                        <NumberInput
                            {...field}
                            disabled
                            parser={(value) => value.replace(/[^\d.]/g, '')}
                            formatter={(value) =>
                                !Number.isNaN(parseFloat(value))
                                    ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                                    : ''
                            }
                            error={
                                errors?.items?.[index]?.salePrice
                                    ? errors.items?.[index]?.salePrice?.message
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
                    watch(`items.${index}.salePrice`) *
                    watch(`items.${index}.quantity`)
                ).toLocaleString('vi-VN')}{' '}
                đ
            </td>
            <td
                style={{
                    width: '5em',
                }}
            >
                <IconTrashX
                    className="delete-edit"
                    strokeWidth="1.8"
                    size="22px"
                    onClick={() => removeOrder(index)}
                />
            </td>
        </tr>
    );
};

const OrderDetail: FC<{
    control: Control<Order> | undefined;
    orderFields: FieldArrayWithId<Order, 'items', 'id'>[];
    errors: FieldErrors<Order>;
    unitData: { id: number; name: string }[];
    appendOrder: UseFieldArrayAppend<Order, 'items'>;
    removeOrder: UseFieldArrayRemove;
    // register: UseFormRegister<Order>
}> = ({
    orderFields,
    control,
    errors,
    unitData,
    appendOrder,
    removeOrder,
    watch,
    items,
    setValue,
}) => {
        const rows = orderFields.map((orderFields, index) => (
            <Item
                key={orderFields.id}
                index={index}
                orderFields={orderFields}
                control={control}
                errors={errors}
                removeOrder={removeOrder}
                watch={watch}
                items={items?.[index]}
                setValue={setValue}
            ></Item>
        ));

        const calTotal = () => {
            return orderFields.reduce(
                (accumulator, currentValue, currentIndex) =>
                    accumulator +
                    watch(`items.${currentIndex}.salePrice`) *
                    watch(`items.${currentIndex}.quantity`),
                0,
            );
        };
        return (
            <div style={{ height: '70%', paddingBottom: '10px' }}>
                <Controller
                    name="items"
                    control={control}
                    render={() => (
                        <Input.Wrapper required error={errors.items?.message}>
                            <Table
                                horizontalSpacing="xl"
                                striped
                                highlightOnHover
                                withBorder
                                my="5px"
                            >
                                <thead>
                                    <tr className="itemsHead">
                                        <th>STT</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Đơn vị tính</th>
                                        {/* <th>Hạn dùng</th> */}
                                        <th>Số lượng</th>
                                        <th>Giá</th>
                                        <th>Tổng tiền</th>
                                        <th></th>
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
                                    <th>Tổng tiền</th>
                                    <th
                                        style={{
                                            fontWeight: 'normal',
                                        }}
                                    >
                                        {calTotal().toLocaleString('vi-VN')} đ
                                    </th>
                                </tfoot>
                            </Table>
                        </Input.Wrapper>
                    )}
                ></Controller>
                <Flex justify="flex-end">
                    <Button
                        my="xs"
                        onClick={() =>
                            appendOrder({
                                productId: '',
                                unitId: '',
                                quantity: 1,
                                salePrice: 0
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
            </div>
        );
    };

export default OrderDetail;
