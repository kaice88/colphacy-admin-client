import {
    Button,
    Flex,
    Select,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { transformSelectCustomerData, transformSelectData } from '../../utils/helper';
import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useAddOrder } from '../../hooks/useOrder';
import { Order } from './type';
import OrderDetails from './OrderDetail';
import { handleGlobalException } from '../../utils/error';
import { notificationShow } from '../Notification';

const AddOrderForm: React.FC<{
    onClose: () => void;
    setStatus: React.Dispatch<React.SetStateAction<string | null>>
}> = ({ onClose, setStatus }) => {
    const {
        control,
        handleSubmit,
        watch,
        setError,
        setValue,
        register,
        formState: { errors },
    } = useForm({
        defaultValues: {
            branchId: "",
            customerId: "",
            orderTime: new Date(),
            items: [
                {
                    productId: "",
                    quantity: 0,
                    unitId: "",
                    salePrice: 1000
                }
            ]
        },
    });
    const {
        fields: orderFields,
        append: appendOrder,
        remove: removeOrder,
    } = useFieldArray({
        name: 'items',
        control,
    });
    const [searchCustomer, setSearchCustomer] = useState('');
    const [searchBranch, setSearchBranch] = useState('');
    const [branchDebounced] = useDebouncedValue(searchBranch, 100);
    const [customerDebounced] = useDebouncedValue(searchCustomer, 100);
    const { branchData, productData, customerData, onSubmitAddOrderForm } =
        useAddOrder(branchDebounced, undefined, customerDebounced);
    const [orderData, setOrderData] = useState<Order | null>(null)
    const onSubmit = (data) => {
        onSubmitAddOrderForm(
            data,
            (error) => {
                handleGlobalException(error, () => {
                    Object.keys(error.response.data).forEach((key) => {
                        setError(key, {
                            type: 'manual',
                            message: error.response.data[key],
                        });
                    });
                });
            },
            () => {
                notificationShow(
                    'success',
                    'Success!',
                    'Thêm đơn hàng mới thành công!'
                );
                onClose();
                setStatus("PENDING")
            },
        );
    };
    return (
        branchData !== undefined &&
        productData !== undefined &&
        (
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <Flex justify="space-between" py="lg" gap="lg">
                        <Controller
                            name="branchId"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    required
                                    radius="md"
                                    label="Chi nhánh"
                                    data={transformSelectData(branchData || [], true)}
                                    searchable
                                    onSearchChange={(value) => {
                                        setSearchBranch(value);
                                    }}
                                    error={
                                        errors.branchId
                                            ? errors.branchId.type === 'required'
                                                ? 'Chi nhánh không được để trống'
                                                : errors.branchId.message
                                            : false
                                    }
                                    w="100%"
                                />
                            )}
                        />
                        <Controller
                            name="customerId"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    w="100%"
                                    required
                                    radius="md"
                                    label="Khách hàng"
                                    data={transformSelectCustomerData(customerData || [])}
                                    searchable
                                    onSearchChange={(value) => {
                                        setSearchCustomer(value);
                                    }}
                                    error={
                                        errors.customerId
                                            ? errors.customerId.type === 'required'
                                                ? 'Khách hàng không được để trống'
                                                : errors.customerId.message
                                            : false
                                    }
                                />
                            )}
                        />
                        <Controller
                            name="orderTime"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <DateTimePicker
                                    w="100%"
                                    {...field}
                                    required
                                    label="Ngày đặt"
                                    radius="md"
                                    error={errors.orderTime ? errors.orderTime.message : false}
                                    dropdownType="modal"
                                />
                            )}
                        />
                    </Flex>

                    <OrderDetails
                        control={control}
                        orderFields={orderFields}
                        errors={errors}
                        items={orderData}
                        unitData={[]}
                        appendOrder={appendOrder}
                        removeOrder={removeOrder}
                        watch={watch}
                        setValue={setValue}
                        register={register}
                    />
                </div>


                <Flex justify="flex-end" align="center" my="xs">
                    <Button
                        mx="xs"
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

export default AddOrderForm;
