import { Button, Flex, TextInput, Select } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Map from '../../Map/Map';
import { handleGlobalException } from '../../../utils/error';
import {
  useAddBranch,
  useEditBranch,
  useViewDetailBranch,
} from '../../../hooks/useBranch';
import { notificationShow } from '../../Notification';
import { isEmpty } from 'lodash';
import { Branch, DetailBranch } from '../type';

function findName(
  id: string,
  data: Record<any, any>[],
  idKey: string,
  nameKey: string,
) {
  for (let i = 0; i < data.length; i++) {
    if (data[i][idKey] === id) {
      return data[i][nameKey];
    }
  }
  return 'ProvinceID not found';
}
function findId(
  name: string,
  data: Record<any, any>[],
  idKey: string,
  nameKey: string,
) {
  const record = data.find((item) => item[nameKey] === name);
  return record[idKey];
}

function formatData(
  data: Record<string, string>[],
  idKey: string,
  nameKey: string,
) {
  return data.map((item) => ({
    value: item[idKey],
    label: item[nameKey],
  }));
}

function formatDataWards(data: { WardName: string }[]) {
  return data.map((item) => ({
    value: item.WardName,
    label: item.WardName,
  }));
}

const BranchForm: React.FC<{
  onSuccesSubmitAdd?: () => void;
  onSuccesSubmitEdit?: () => void;
  onCancel: () => void;
  idBranch?: number;
  isEdit?: boolean;
}> = ({
  onSuccesSubmitAdd,
  onSuccesSubmitEdit,
  onCancel,
  idBranch,
  isEdit,
}) => {
  const [provinceId, setProvinceId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [wardId, setWardId] = useState('');
  const [branchesProvinces, setBranchesProvinces] = useState([]);
  const [branchesDistricts, setBranchesDistricts] = useState([]);
  const [branchesWards, setBranchesWards] = useState([]);
  const [branchesStatus, setBranchesStatus] = useState([]);
  const [detailBranch, setDetailBranch] = useState<DetailBranch>();
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditProvince, setIsEditProvince] = useState(false);
  const [viewLat, setViewLat] = useState();
  const [viewLng, setViewLng] = useState();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      status: 'OPEN',
      closingHour: '',
      openingHour: '',
      phone: '',
      streetAddress: '',
      ward: '',
      district: '',
      province: '',
      latitude: 0,
      longitude: 0,
    },
  });

  const {
    fetchAddBranchProvinces,
    fetchAddBranchDistricts,
    fetchAddBranchWards,
    handleAddBranch,
    onSubmitAddBranchForm,
  } = useAddBranch(provinceId, districtId);

  const { onSubmitEditBranchForm } = useEditBranch();

  const { fetchViewDetailBranch, fetchBranchStatuses } =
    useViewDetailBranch(idBranch);

  const handleProvincesChange = (value: string) => {
    setIsEditProvince(true);
    setValue(
      'province',
      findName(value, branchesProvinces, 'ProvinceID', 'ProvinceName'),
    );
    setProvinceId(value);
    setDistrictId('');
    setWardId('');
    setValue('ward', '');
    setBranchesDistricts([]);
    setBranchesWards([]);
    if (isEdit) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  };
  const handleDistrictsChange = (value: string) => {
    setIsEditProvince(true);
    setValue(
      'district',
      findName(value, branchesDistricts, 'DistrictID', 'DistrictName'),
    );
    setDistrictId(value);
    setWardId('');
    setValue('ward', '');
    setBranchesWards([]);
  };
  const handleWardsChange = (value: string) => {
    setValue('ward', value);
    setWardId(value);
  };
  const handleStreetAddressChange = (address: string) => {
    setValue('streetAddress', address);
  };

  useEffect(() => {
    async function fetchStatusData() {
      const data = await fetchBranchStatuses.refetch();
      if (data.isSuccess) {
        setBranchesStatus(data.data.data);
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchStatusData();
  }, []);

  useEffect(() => {
    if (provinceId === null) {
      setBranchesDistricts([]);
    }
    async function fetchAddProvincesData() {
      const data = await fetchAddBranchProvinces.refetch();
      if (data.isSuccess) {
        setBranchesProvinces(data.data.data);
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchAddProvincesData();
    if (provinceId) {
      async function fetchAddDistrictsData() {
        const data = await fetchAddBranchDistricts.refetch();
        if (data.isSuccess) {
          setBranchesDistricts(data.data.data);
        } else if (data.isError) {
          const error = data.error;
          handleGlobalException(error, () => {});
        }
      }
      fetchAddDistrictsData();
    }
    if (districtId) {
      async function fetchAddWardsData() {
        const data = await fetchAddBranchWards.refetch();
        if (data.isSuccess) {
          setBranchesWards(data.data.data);
        } else if (data.isError) {
          const error = data.error;
          handleGlobalException(error, () => {});
        }
      }
      fetchAddWardsData();
    }
  }, [provinceId, districtId]);

  useEffect(() => {
    if (idBranch && !isEmpty(branchesProvinces)) {
      async function fetchDetailBranch() {
        const data = await fetchViewDetailBranch.refetch();
        if (data.isSuccess) {
          setIsDragging(false);
          const result = data.data.data;
          setViewLat(result.latitude);
          setViewLng(result.longitude);
          setDetailBranch(result);
          Object.keys(result).forEach((key) => {
            if (key === 'province') {
              const Id = findId(
                result[key],
                branchesProvinces,
                'ProvinceID',
                'ProvinceName',
              );
              setValue(key, Number(Id));
              setProvinceId(Number(Id));
            } else {
              setValue(key, result[key]);
            }
          });
        } else if (data.isError) {
          const error = data.error;
          handleGlobalException(error, () => {});
        }
      }
      fetchDetailBranch();
    }
  }, [idBranch, branchesProvinces]);

  useEffect(() => {
    if (!isEditing && detailBranch && !isEmpty(branchesDistricts)) {
      Object.keys(detailBranch).forEach((key) => {
        if (key === 'district') {
          const Id = branchesDistricts.every((branch) =>
            branch.hasOwnProperty('DistrictID'),
          )
            ? findId(
                detailBranch[key],
                branchesDistricts,
                'DistrictID',
                'DistrictName',
              )
            : null;
          setValue(key, Number(Id));
          setDistrictId(Number(Id));
        }
      });
    }
  }, [detailBranch, branchesDistricts]);

  useEffect(() => {
    if (detailBranch && !isEmpty(branchesWards)) {
      Object.keys(detailBranch).forEach((key) => {
        if (key === 'ward') {
          setValue(key, detailBranch[key]);
        }
      });
    }
  }, [detailBranch, branchesWards]);

  const formattedProvinces = formatData(
    branchesProvinces,
    'ProvinceID',
    'ProvinceName',
  );
  const formattedDistricts = formatData(
    branchesDistricts,
    'DistrictID',
    'DistrictName',
  );
  const formattedWards = formatDataWards(branchesWards);

  const handleDrag = (lat: number, lng: number) => {
    setValue('latitude', lat);
    setValue('longitude', lng);
    setIsDragging(true);
  };
  const handleCancel = () => {
    onCancel();
  };
  const onSubmit: SubmitHandler<Branch> = (data) => {
    const handleSuccess = (message: string) => {
      if (isEdit) {
        onSuccesSubmitEdit();
      } else {
        onSuccesSubmitAdd();
      }
      notificationShow('success', 'Success!', message);
    };

    const handleError = (error) => {
      handleGlobalException(error, () => {
        setError('openingHour', {
          type: 'manual',
          message: error.response.data.openingHour,
        });
        setError('closingHour', {
          type: 'manual',
          message: error.response.data.closingHour,
        });
        setError('phone', {
          type: 'manual',
          message: error.response.data.phone,
        });
      });
    };

    if (!isEditProvince) {
      data.province = findName(
        getValues('province'),
        branchesProvinces,
        'ProvinceID',
        'ProvinceName',
      );

      data.district = findName(
        getValues('district'),
        branchesDistricts,
        'DistrictID',
        'DistrictName',
      );
    }
    if (!isEdit) {
      onSubmitAddBranchForm(
        data,
        () => {
          handleSuccess('Thêm nhánh mới thành công!');
        },
        handleError,
      );
    } else {
      onSubmitEditBranchForm(
        data,
        () => {
          handleSuccess('Chỉnh sửa nhánh thành công!');
        },
        handleError,
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap="md" pb="lg">
        <Flex direction="row">
          <Controller
            name="province"
            control={control}
            rules={{ required: 'Vui lòng chọn Tỉnh/ Thành' }}
            render={({ field }) => {
              return (
                <Select
                  style={
                    idBranch && !isEdit
                      ? {
                          pointerEvents: 'none',
                        }
                      : {}
                  }
                  p={10}
                  {...field}
                  name="province"
                  required
                  placeholder="Chọn Tỉnh/ Thành"
                  data={formattedProvinces}
                  onChange={handleProvincesChange}
                  value={provinceId}
                  error={errors.province ? errors.province.message : false}
                />
              );
            }}
          ></Controller>
          <Controller
            name="district"
            control={control}
            rules={{ required: 'Vui lòng chọn Quận/ Huyện' }}
            render={({ field }) => (
              <Select
                style={
                  idBranch && !isEdit
                    ? {
                        pointerEvents: 'none',
                      }
                    : {}
                }
                p={10}
                {...field}
                name="district"
                required
                placeholder="Chọn Quận/ Huyện"
                data={formattedDistricts}
                onChange={handleDistrictsChange}
                value={districtId}
                error={errors.district ? errors.district.message : false}
              />
            )}
          ></Controller>
          <Controller
            name="ward"
            control={control}
            rules={{ required: 'Vui lòng chọn Phường/ Xã' }}
            render={({ field }) => (
              <Select
                style={
                  idBranch && !isEdit
                    ? {
                        pointerEvents: 'none',
                      }
                    : {}
                }
                p={10}
                {...field}
                name="ward"
                required
                placeholder="Chọn Phường/ Xã"
                data={formattedWards}
                onChange={handleWardsChange}
                error={errors.ward ? errors.ward.message : false}
              />
            )}
          ></Controller>
        </Flex>
        <div>
          {viewLat && viewLng && (
            <div>
              <Map
                isView={idBranch && !isEdit}
                onDrag={handleDrag}
                onStreetAddressChange={handleStreetAddressChange}
                control={control}
                initialLat={viewLat}
                initialLng={viewLng}
              />
            </div>
          )}
          {!viewLat && !viewLng && (
            <div>
              <Map
                isView={idBranch && !isEdit}
                onDrag={handleDrag}
                onStreetAddressChange={handleStreetAddressChange}
                control={control}
              />
            </div>
          )}
        </div>
        <Flex direction="row">
          <Controller
            name="openingHour"
            control={control}
            rules={{ required: false, minLength: 4, maxLength: 5 }}
            render={({ field }) => (
              <TextInput
                style={
                  idBranch && !isEdit
                    ? {
                        pointerEvents: 'none',
                      }
                    : {}
                }
                p={10}
                {...field}
                required
                label="Giờ mở cửa"
                radius="md"
                error={
                  errors.openingHour
                    ? errors.openingHour.type === 'minLength' ||
                      errors.openingHour.type === 'maxLength'
                      ? 'Sai định dạng giờ (HH:mm)'
                      : errors.openingHour.message
                    : false
                }
              />
            )}
          ></Controller>
          <Controller
            name="closingHour"
            control={control}
            rules={{ required: false, minLength: 4, maxLength: 5 }}
            render={({ field }) => (
              <TextInput
                style={
                  idBranch && !isEdit
                    ? {
                        pointerEvents: 'none',
                      }
                    : {}
                }
                p={10}
                {...field}
                required
                label="Giờ đóng cửa"
                radius="md"
                error={
                  errors.closingHour
                    ? errors.closingHour.type === 'minLength' ||
                      errors.closingHour.type === 'maxLength'
                      ? 'Sai định dạng giờ (HH:mm)'
                      : errors.closingHour.message
                    : false
                }
              />
            )}
          ></Controller>
        </Flex>
        <Flex direction="row">
          <Controller
            name="phone"
            control={control}
            rules={{ required: false, minLength: 10, maxLength: 10 }}
            render={({ field }) => (
              <TextInput
                style={
                  idBranch && !isEdit
                    ? {
                        pointerEvents: 'none',
                      }
                    : {}
                }
                {...field}
                px={10}
                required
                label="Số điện thoại"
                radius="md"
                error={
                  errors.phone
                    ? errors.phone.type === 'minLength' ||
                      errors.phone.type === 'maxLength'
                      ? 'Số điện thoại phải gồm 10 chữ số đó'
                      : errors.phone.message
                    : false
                }
              />
            )}
          ></Controller>
          {idBranch && (
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  style={
                    idBranch && !isEdit
                      ? {
                          pointerEvents: 'none',
                        }
                      : {}
                  }
                  px={10}
                  {...field}
                  label="Trạng thái"
                  data={branchesStatus}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                />
              )}
            ></Controller>
          )}
        </Flex>
        {(!idBranch || isEdit) && (
          <Flex justify="center">
            <Button
              loading={handleAddBranch.isLoading}
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
              onClick={handleCancel}
            >
              {' '}
              Hủy
            </Button>
          </Flex>
        )}
      </Flex>
    </form>
  );
};

export default BranchForm;
