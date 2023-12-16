import {
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
  mode: 'ADD' | 'VIEW' | 'EDIT' | 'CANCEL';
}> = ({ onClose, employeeId, mode }) => {
  const {
    loading,
    onSubmitEmployeeForm,
    fetchBranch,
    fetchEmployee
  } = useEmployeeDetail(employeeId);

  const [employeeData, setEmployeeData] = useState<Employee>();
  const [branchData, setBranchData] = useState();
  useEffect(() => {
    async function fetchData() {
      try {
        console.log(ok);
        if (employeeId) {
          const data = await fetchBranch.refetch()
          setEmployeeData(data.data?.data.items);
        }
        const data = await fetchBranch.refetch()
        // setBranchData(data);
      } catch (error) {
        handleGlobalException(error, () => { });
      }
    }
    fetchData();
  }, [])
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
      fullName: "",
      username: '',
      phone: '',
      password: '',
      gender: '',
      roleId: 0,
      branchId: 0,
    },
  });
  const onSubmit = (data: Employee) => {
    onSubmitEmployeeForm(
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
            style={
              mode === 'VIEW'
                ? {
                  pointerEvents: 'none',
                }
                : {}
            }
            required
            label="Tên nhân viên"
            radius="md"
            error={errors.fullName ? errors.fullName.message : false}
            className="employee-input"
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
            style={
              mode === 'VIEW'
                ? {
                  pointerEvents: 'none',
                }
                : {}
            }
            required
            label="Username"
            radius="md"
            error={errors.username ? errors.username.message : false}
            className="employee-input"
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
            style={
              mode === 'VIEW'
                ? {
                  pointerEvents: 'none',
                }
                : {}
            }
            required
            label="SĐT"
            radius="md"
            error={errors.phone ? errors.phone.message : false}
            className="employee-input"
          />
        )}
      />
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
      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            label="Giới tính"
            data={['MALE', 'FEMALE', 'OTHER']}
            onChange={(value) => {
              field.onChange(value);
            }}
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
              // data={branchData.map(item => ({ label: item.address, value: item.id }))}
              data={[]}
              onChange={setBranchId}
              value={branchId}
              error={errors.branchId ? errors.branchId.message : false}
            />
          );
        }}
      ></Controller>
    </form>
  )
};

export default EmployeeForm;
