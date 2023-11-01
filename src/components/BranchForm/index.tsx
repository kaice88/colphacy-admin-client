import {
  Button,
  Flex,
  TextInput,
  Text,
  useMantineTheme,
  Select,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Map from "../Map/Map";
import { handleGlobalException } from "../../utils/error";
import { useAddBranch } from "../../hooks/useBranch";
import { notificationShow } from "../Notification";

function findName(
  id: string,
  data: Record<any, any>[],
  idKey: string,
  nameKey: string
) {
  for (let i = 0; i < data.length; i++) {
    if (data[i][idKey] === id) {
      return data[i][nameKey];
    }
  }
  return "ProvinceID not found";
}

function formatData(
  data: Record<string, string>[],
  idKey: string,
  nameKey: string
) {
  return data.map((item) => ({
    value: item[idKey],
    label: item[nameKey],
  }));
}

export interface Branch {
  closingHour: string;
  openingHour: string;
  phone: string;
  streetAddress: string;
  ward: string;
  district: string;
  province: string;
  latitude: number;
  longitude: number;
}

function formatDataWards(data: { WardName: string }[]) {
  return data.map((item) => ({
    value: item.WardName,
    label: item.WardName,
  }));
}

const BranchForm: React.FC<{
  onSuccesSubmit: () => void;
  onCancel: () => void;
}> = ({ onSuccesSubmit, onCancel }) => {
  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [wardId, setWardId] = useState("");
  const [branchesProvinces, setBranchesProvinces] = useState([]);
  const [branchesDistricts, setBranchesDistricts] = useState([]);
  const [branchesWards, setBranchesWards] = useState([]);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      closingHour: "",
      openingHour: "",
      phone: "",
      streetAddress: "",
      ward: "",
      district: "",
      province: "",
      latitude: 0,
      longitude: 0,
    },
  });
  const theme = useMantineTheme();

  const {
    fetchAddBranchProvinces,
    fetchAddBranchDistricts,
    fetchAddBranchWards,
    handleAddBranch,
    onSubmitAddBranchForm,
  } = useAddBranch(+provinceId, +districtId);

  const handleProvincesChange = (value: string) => {
    setValue(
      "province",
      findName(value, branchesProvinces, "ProvinceID", "ProvinceName")
    );
    setProvinceId(value);
    setDistrictId("");
    setWardId("");
    setBranchesDistricts([]);
    setBranchesWards([]);
  };
  const handleDistrictsChange = (value: string) => {
    setValue(
      "district",
      findName(value, branchesDistricts, "DistrictID", "DistrictName")
    );
    setDistrictId(value);
    setWardId("");
    setBranchesWards([]);
  };
  const handleWardsChange = (value: string) => {
    setValue("ward", value);
    setWardId(value);
  };
  const handleStreetAddressChange = (address: string) => {
    setValue("streetAddress", address);
  };

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
        handleGlobalException(error, () => {
          setError("closingHour", {
            type: "manual",
            message: error.response.data.closingHour,
          });
          setError("phone", {
            type: "manual",
            message: error.response.data.phone,
          });
        });
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

  const formattedProvinces = formatData(
    branchesProvinces,
    "ProvinceID",
    "ProvinceName"
  );
  const formattedDistricts = formatData(
    branchesDistricts,
    "DistrictID",
    "DistrictName"
  );
  const formattedWards = formatDataWards(branchesWards);

  const handleDrag = (lat: number, lng: number) => {
    setValue("latitude", lat);
    setValue("longitude", lng);
  };
  const handleCancel = () => {
    onCancel();
  };
  const onSubmit: SubmitHandler<Branch> = (data) => {
    onSubmitAddBranchForm(
      data,
      () => {
        onSuccesSubmit();
        notificationShow("success", "Success!", "Thêm nhánh mới thành công!");
      },
      (error) => {
        handleGlobalException(error, () => {
          setError("openingHour", {
            type: "manual",
            message: error.response.data.openingHour,
          });
          setError("closingHour", {
            type: "manual",
            message: error.response.data.closingHour,
          });
          setError("phone", {
            type: "manual",
            message: error.response.data.phone,
          });
        });
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Text
        fw="600"
        color={theme.colors.cobaltBlue[0]}
        fz="18px"
        align="center"
        pb="lg"
      >
        Thêm chi nhánh
      </Text>
      <Flex direction="column" gap="md" pb="lg">
        <Flex direction="row">
          <Select
            p={10}
            name="province"
            required
            placeholder="Chọn Tỉnh/ Thành"
            data={formattedProvinces}
            onChange={handleProvincesChange}
            value={provinceId}
          />
          <Select
            p={10}
            name="district"
            required
            placeholder="Chọn Quận/ Huyện"
            data={formattedDistricts}
            onChange={handleDistrictsChange}
            value={districtId}
          />
          <Select
            p={10}
            name="ward"
            required
            placeholder="Chọn Phường/ Xã"
            data={formattedWards}
            onChange={handleWardsChange}
            value={wardId}
          />
        </Flex>
        <div>
          <Map
            onDrag={handleDrag}
            onStreetAddressChange={handleStreetAddressChange}
          />
        </div>
        <Flex direction="row">
          <Controller
            name="openingHour"
            control={control}
            rules={{ required: false, minLength: 4, maxLength: 5 }}
            render={({ field }) => (
              <TextInput
                p={10}
                {...field}
                required
                label="Giờ mở cửa"
                radius="md"
                error={
                  errors.openingHour
                    ? errors.openingHour.type === "minLength" ||
                      errors.openingHour.type === "maxLength"
                      ? "Sai định dạng giờ (HH:mm)"
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
                p={10}
                {...field}
                required
                label="Giờ đóng cửa"
                radius="md"
                error={
                  errors.closingHour
                    ? errors.closingHour.type === "minLength" ||
                      errors.closingHour.type === "maxLength"
                      ? "Sai định dạng giờ (HH:mm)"
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
                {...field}
                px={10}
                required
                label="Số điện thoại"
                radius="md"
                error={
                  errors.phone
                    ? errors.phone.type === "minLength" ||
                      errors.phone.type === "maxLength"
                      ? "Số điện thoại phải gồm 10 chữ số đó"
                      : errors.phone.message
                    : false
                }
              />
            )}
          ></Controller>
        </Flex>
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
                    0.1
                  ),
                }),
              },
            })}
            type="submit"
          >
            {" "}
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
            {" "}
            Hủy
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};

export default BranchForm;
