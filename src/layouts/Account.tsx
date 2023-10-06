import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Box,
  Select,
  Avatar,
  Text,
  FileButton,
  MantineTheme,
} from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { http } from "../settings/https";
interface Account {
  id: string;
  image: string;
  name: string;
  username: string;
  gender: string;
}

export default function Account() {
  const [user, setUser] = useState<Account | null>({
    id: "1",
    name: "Alice",
    username: "Phuong",
    gender: "Nữ",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0QwbkMyUN3Ln8ZBOhSUKsxM4rtVWyG_231g&usqp=CAU",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    http.get(`accounts/1`).then((res) => {
      setUser(res.data);
      // console.log(res.data);
    });
  }, []);

  const form = useForm({
    initialValues: { name: "", username: "", gender: "Nam" },

    validate: {
      name: (value) => (value.length < 0 ? "Vui lòng nhập đủ thông tin" : null),
      username: (value) =>
        value.length < 0 ? "Vui lòng nhập đủ thông tin" : null,
    },
  });
  const styleButton = (theme: MantineTheme) => ({
    root: {
      backgroundColor: theme.colors.munsellBlue[0],
      ...theme.fn.hover({
        backgroundColor: theme.fn.darken(theme.colors.munsellBlue[0], 0.1),
      }),
    },
  });
  //handle event
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submited");
  };
  return (
    <>
      <Text size="20px">
        <Button
          variant="default"
          styles={() => ({
            root: {
              border: 0,
            },
          })}
          onClick={() => {
            history.back();
          }}
        >
          <IconChevronLeft />
        </Button>
        Thông tin cá nhân
      </Text>
      <Box maw={340} mx="auto">
        <form className="form" onSubmit={handleSubmit}>
          <FileButton onChange={setFile} accept="image/png,image/jpeg">
            {(props) => (
              <button className="imageBtn" {...props}>
                <Avatar
                  w="179px"
                  h="149px"
                  radius="100%"
                  src={user?.image}
                />
              </button>
            )}
          </FileButton>

          <TextInput
            label="Họ tên"
            placeholder={user?.name}
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Tên người dùng"
            placeholder={user?.username}
            {...form.getInputProps("username")}
          />
          <Select
            label="Giới tính"
            placeholder={user?.gender}
            data={["Nam", "Nữ", "Khác"]}
            styles={(theme) => ({
              item: {
                "&[data-selected]": {
                  "&": {
                    backgroundColor: theme.white,

                    color: theme.black,
                  },
                  "&:hover": {
                    backgroundColor: theme.fn.darken(
                      theme.colors.munsellBlue[0],
                      0.1
                    ),
                    color: theme.white,
                  },
                },

                "&[data-hovered]": {
                  backgroundColor: theme.fn.darken(
                    theme.colors.munsellBlue[0],
                    0.1
                  ),
                  color: theme.white,
                },
              },
            })}
          />
          <Button type="submit" mt="sm" ml="33.33%" styles={styleButton}>
            Lưu thông tin
          </Button>
        </form>
      </Box>
    </>
  );
}
