import {
  Button,
  Flex,
  TextInput,
  Text,
  useMantineTheme,
  Select,
} from "@mantine/core";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Map from "../Map/Map";

const BranchForm: React.FC<{}> = (props) => {
  const [provinceSlug, setProvinceSlug] = useState("");
  const [districtSlug, setDistrictSlug] = useState("");
  const [wardSlug, setWardSlug] = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      username: "",
      openTime: "",
      closeTime: "",
      phoneNumber: "",
    },
  });
  const theme = useMantineTheme();

  const onSubmit = () => {};
  const handleProvincesChange = (value: string) => {
    setProvinceSlug(value);
    setDistrictSlug("");
  };
  const handleDistrictsChange = (value: string) => {
    setDistrictSlug(value);
  };
  const handleWardsChange = (value: string) => {
    setWardSlug(value);
  };
  const [branchesProvinces, setBranchesProvinces] = useState([]);
  const [branchesDistricts, setBranchesDistricts] = useState([]);
  const [branchesWards, setBranchesWards] = useState([]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Text
        fw="600"
        color={theme.colors.cobaltBlue[0]}
        fz="20px"
        align="center"
        pb="lg"
      >
        Thêm chi nhánh
      </Text>
      <Flex direction="column" gap="md">
        <Flex direction="row">
          <Select
            placeholder="Chọn Tỉnh/ Thành"
            data={branchesProvinces}
            onChange={handleProvincesChange}
            value={provinceSlug}
            clearable
          />
          <Select
            placeholder="Chọn Quận/ Huyện"
            data={branchesDistricts}
            onChange={handleDistrictsChange}
            value={districtSlug}
            clearable
          />
          <Select
            placeholder="Chọn Phường/ Xã"
            data={branchesWards}
            onChange={handleWardsChange}
            value={wardSlug}
            clearable
          />
        </Flex>
        <Flex direction="row">
          <Map />
        </Flex>
        <Flex direction="row">
          <Controller
            name="openTime"
            control={control}
            rules={{ required: false, minLength: 6 }}
            render={({ field }) => (
              <TextInput {...field} required label="Giờ mở cửa" radius="md" />
            )}
          ></Controller>
          <Controller
            name="closeTime"
            control={control}
            rules={{ required: false, minLength: 4 }}
            render={({ field }) => (
              <TextInput {...field} required label="Giờ đóng cửa" radius="md" />
            )}
          ></Controller>
        </Flex>
        <Flex direction="row">
          <Controller
            name="phoneNumber"
            control={control}
            rules={{ required: false, minLength: 6 }}
            render={({ field }) => (
              <TextInput
                {...field}
                required
                label="Số điện thoại"
                radius="md"
                //   error={
                //     errors.username
                //       ? errors.username.type === "minLength"
                //         ? "Tên tài khoản có độ dài ít nhất 6 kí tự"
                //         : errors.username.message
                //       : false
                //   }
              />
            )}
          ></Controller>
        </Flex>
        <Flex justify="center">
          <Button
            // loading={handleCancel.isLoading}
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
            HỦY
          </Button>
          <Button
            // loading={handleSave.isLoading}
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
            LƯU
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};

export default BranchForm;
