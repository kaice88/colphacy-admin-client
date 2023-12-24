import {
  Button,
  FileButton,
  Flex,
  Input,
  Loader,
  NumberInput,
  Select,
  TextInput,
  Textarea,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import useProvider from '../../hooks/useProvider';
import useImportDetail from '../../hooks/useImportDetail';
import { transformSelectData } from '../../utils/helper';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useDebouncedState, useDebouncedValue } from '@mantine/hooks';
import ImportDetails from './ImportDetails';
import { handleGlobalException } from '../../utils/error';
import { notificationShow } from '../Notification';

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
  } = useForm({
    defaultValues: {
      branch: '',
      invoiceNumber: '',
      provider: '',
      importTime: new Date(),
      importDetails: [
        {
          product: '',
          unitId: '',
          expirationDate: new Date(),
          quantity: 1,
          importPrice: 1000,
        },
      ],
    },
  });

  const [searchProvider, setSearchProvider] = useState('');
  const [providerDebounced] = useDebouncedValue(searchProvider, 100);
  const [searchBranch, setSearchBranch] = useState('');
  const [branchDebounced] = useDebouncedValue(searchBranch, 100);
  const { providerData, branchData, onSubmitImportForm, importData } =
    useImportDetail(importId, providerDebounced, branchDebounced);

  const {
    fields: importFields,
    append: appendImport,
    remove: removeImport,
  } = useFieldArray({
    name: 'importDetails',
    control,
  });

  const onSubmit = (data) => {
    onSubmitImportForm(
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
          `${!importId
            ? 'Thêm sản phẩm mới thành công!'
            : 'Cập nhật sản phẩm thành công!'
          } `,
        );
        onClose();
      },
    );
  };

  useEffect(() => {
    if (importData && mode !== 'ADD') {
      const transformData = {
        ...importData,
        importTime: new Date(importData.importTime),
        branch: importData.branch.id.toString(),
        provider: importData.provider.id.toString(),
        importDetails: importData.importDetails.map((item) => ({
          ...item,
          product: item.product.id.toString(),
          expirationDate: new Date(item.expirationDate),
          unitId: item.unitId.toString(),
        })),
      };
      console.log(importData.provider.name,"day")
      setSearchProvider(importData.provider.name);
      setSearchBranch(importData.branch.address);
      type TransformDataKeys = keyof typeof transformData;

      (Object.keys(transformData) as TransformDataKeys[]).map(
        (item: TransformDataKeys) => {
          setValue(item, transformData[item]);
        },
      );
    }
  }, [importData]);
 console.log(searchProvider,"ne")
 console.log(importData,"ne")
  return (
    branchData !== undefined &&
    providerData !== undefined && (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
        {importData !== undefined   &&
          <> <Flex justify="space-between" py="lg" gap="lg">
          <Controller
            name="branch"
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
                label="Chi nhánh"
                data={transformSelectData(branchData || [], true)}
                searchable
                onSearchChange={(value) => {
                  console.log(value,"search")
                  setSearchBranch(value);
                }}
                searchValue={searchBranch}
                error={
                  errors.branch
                    ? errors.branch.type === 'required'
                      ? 'Chi nhánh không được để trống'
                      : errors.branch.message
                    : false
                }
                w="100%"
              />
            )}
          />
          <Controller
            name="provider"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                w="100%"
                required
                radius="md"
                style={
                  mode === 'VIEW'
                    ? {
                      pointerEvents: 'none',
                    }
                    : {}
                }
                label="Nhà cung cấp"
                data={transformSelectData(providerData || [])}
                searchable
                onSearchChange={(value) => {
                  setSearchProvider(value);
                }}
                searchValue={searchProvider}
                error={
                  errors.provider
                    ? errors.provider.type === 'required'
                      ? 'Nhà cung cấp phẩm không được để trống'
                      : errors.provider.message
                    : false
                }
              />
            )}
          />
          <Controller
            name="invoiceNumber"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextInput
                w="100%"
                {...field}
                style={
                  mode === 'VIEW'
                    ? {
                      pointerEvents: 'none',
                    }
                    : {}
                }
                required
                label="Số hóa đơn"
                radius="md"
                error={
                  errors.invoiceNumber ? errors.invoiceNumber.message : false
                }
              />
            )}
          />
          <Controller
            name="importTime"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <DateTimePicker
                w="100%"
                {...field}
                style={
                  mode === 'VIEW'
                    ? {
                      pointerEvents: 'none',
                    }
                    : {}
                }
                required
                label="Ngày nhập"
                radius="md"
                error={errors.importTime ? errors.importTime.message : false}
                dropdownType="modal"
              />
            )}
          />
        </Flex>
         
          <ImportDetails
            control={control}
            importFields={importFields}
            errors={errors}
            importDetails={importData?.importDetails}
            unitData={[]}
            appendImport={appendImport}
            removeImport={removeImport}
            mode={mode}
            watch={watch}
            setValue={setValue}
          /></>
          }
        </div>

        {mode !== 'VIEW' && (
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
        )}
      </form>
    )
  );

};

export default ImportForm;
