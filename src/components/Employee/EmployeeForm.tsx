import {
  Button,
  Flex,
  PasswordInput,
  Select,
  TextInput
} from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { handleGlobalException } from '../../utils/error';
import { useEffect, useState } from 'react';
import { notificationShow } from '../Notification';
import { Employee } from './type';
import { useEmployeeDetail } from '../../hooks/useEmployee';

const EmployeeForm: React.FC<{
  onClose: () => void;
  employeeId: undefined | number;
  mode: 'ADD' | 'EDIT' | 'DELETE';
}> = ({ onClose, employeeId, mode }) => {
  const {
    loading,
    onSubmitEmployeeForm,
    fetchBranch,
    fetchEmployeeById,
    detailEmployee,
    branchData
  } = useEmployeeDetail(employeeId);

  useEffect(() => {
    if (branchData === undefined && detailEmployee === undefined) {
      async function fetchData() {
        try {
          if (employeeId) {
            await fetchEmployeeById.refetch();
          }
          await fetchBranch.refetch();
        } catch (error) {
          handleGlobalException(error, () => { });
        }
      }
      fetchData();
    }
  }, [branchData, detailEmployee])

  const [branchId, setBranchId] = useState();
  const {
    control,
    handleSubmit,
    watch,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Employee>({
    defaultValues: {
      id: mode === "EDIT" ? detailEmployee?.id : undefined,
      fullName: "",
      username: '',
      phone: '',
      password: '',
      gender: '',
      roleId: 1,
      branchId: 0,
    },
  });
  const onSubmit = (data: Employee) => {
    onSubmitEmployeeForm(
      data,
      (error) => {
        console.log(data);
        handleGlobalException(error, () => {
          if (error.response.status !== 400) {
            const data = error.response.data;
            Object.keys(data).forEach((key) => {
              notificationShow("error", "Error!", data[key]);
            });
          }
          else {
            Object.keys(error.response.data).forEach((key) => {
              setError(key, {
                type: 'manual',
                message: error.response.data[key],
              });
            });
          }
        });
      },
      () => {
        notificationShow(
          'success',
          'Success!',
          `${!employeeId
            ? 'Thêm nhân viên mới thành công!'
            : 'Cập nhật nhân viên thành công!'
          } `,
        );
        onClose();
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="fullName"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextInput
            {...field}
            disabled={mode === "EDIT"}
            required
            label="Tên nhân viên"
            radius="md"
            error={errors.fullName ? errors.fullName.message : false}
            className="employee-input"
            value={mode === "EDIT" ? detailEmployee?.fullName : undefined}
          />
        )}
      />
      <Controller
        name="username"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextInput
            {...field}
            required
            disabled={mode === "EDIT"}
            label="Tên tài khoản"
            radius="md"
            error={errors.username ? errors.username.message : false}
            className="employee-input"
            value={mode === "EDIT" ? detailEmployee?.username : undefined}
          />
        )}
      />
      <Controller
        name="phone"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextInput
            {...field}
            required
            disabled={mode === "EDIT"}
            label="SĐT"
            radius="md"
            error={errors.phone ? errors.phone.message : false}
            className="employee-input"
            value={mode === "EDIT" ? detailEmployee?.phone : undefined}
          />
        )}
      />
      {
        mode === "ADD" &&
        <Controller
          name="password"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <PasswordInput
              {...field}
              required
              label="Mật khẩu"
              radius="md"
              error={
                errors.password
                  ? errors.password.type === "minLength"
                    ? "Mật khẩu có độ dài ít nhất 8 kí tự"
                    : errors.password.message
                  : false
              }
            />
          )}
        />
      }

      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            label="Giới tính"
            data={["MALE", "FEMALE", "OTHER"]}
            onChange={(value) => {
              field.onChange(value);
            }}
            value={mode === "EDIT" ? detailEmployee?.gender : undefined}
          />
        )}
      />
      <Controller
        name="branchId"
        control={control}

        rules={{ required: 'Vui lòng chọn chi nhánh' }}
        render={({ field }) => {
          return (
            <Select
              {...field}
              name="branchId"
              required
              label="Chọn chi nhánh"
              data={branchData ? branchData.map(item => ({ label: item.address, value: item.id })) : []}
              onChange={(value) => {
                field.onChange(value);
              }}
              error={errors.branchId ? errors.branchId.message : false}
              value={mode === "EDIT" && detailEmployee!==undefined ? detailEmployee.branch : undefined}
            />
          );
        }}
      ></Controller>
      <Flex justify="center">
        <Button
          loading={loading}
          className="button"
          m={10}
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
          onClick={onClose}
        >
          {' '}
          Hủy
        </Button>
      </Flex>
    </form>
  )
};

export default EmployeeForm;
