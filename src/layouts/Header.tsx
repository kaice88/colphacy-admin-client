import { Button, Avatar, Image, Menu, Header } from "@mantine/core";
import images from "../assets/images/logo.jpg";
import { IconLogout, IconPassword, IconUserCircle } from "@tabler/icons-react";
import useAuth from "../hooks/useAuth";

export default function HomeHeader() {
  const { userProfile } = useAuth();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout.mutate();
  };
  return (
    <Header height={{ base: 50, md: 70 }} p="xs" m={5} mx="3%" display={"flex"}>
      <Image maw={165} radius="md" src={images} alt="Random image" />

      <Menu trigger="hover">
        <Menu.Target>
          <Button
            leftIcon={
              <Avatar
                radius="100%"
                styles={() => ({
                  placeholderIcon: {
                    width: "57px",
                    height: "57px",
                    backgroundColor: "white",
                  },
                })}
              />
            }
            styles={(theme) => ({
              root: {
                backgroundColor: "white",
                border: 0,
                fontSize: "16px",
                color: theme.fn.lighten(theme.colors.munsellBlue[0], 0.5),
                marginLeft: "auto",
                ...theme.fn.hover({
                  color: theme.fn.darken(theme.colors.munsellBlue[0], 0.1),
                  backgroundColor: "white",
                }),
              },
            })}
          >
            {userProfile && userProfile.username}
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            component="a"
            href="/profile"
            icon={<IconUserCircle size={20} />}
          >
            Tài khoản
          </Menu.Item>
          <Menu.Item
            component="a"
            href="/editPassword"
            icon={<IconPassword size={20} />}
          >
            Cập nhật mật khẩu
          </Menu.Item>
          <Menu.Item icon={<IconLogout size={20} />} onClick={handleLogout}>
            Đăng xuất
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Header>
  );
}
