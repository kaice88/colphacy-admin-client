import {
  Button,
  Avatar,
  Image,
  Menu,
  Header,
  Flex,
} from "@mantine/core";
import Logo from "../assets/images/Logo.png";
import {
  IconLogout,
  IconPassword,
  IconUserCircle,
} from "@tabler/icons-react";
import useAuth from "../hooks/useAuth";
import NotiList from "../components/Notifications/NotiList";

export default function HomeHeader() {
  const { userProfile } = useAuth();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout.mutate();
  };
  return (
    <Header height={{ base: 60, md: 60 }} p="xs">
      <Flex justify={"space-between"} align={"center"}>
        <Image maw={165} radius="md" src={Logo} alt="Random image" />

        <Flex gap="md" justify="center" align="center">
          <NotiList />
          <Menu trigger="hover">
            <Menu.Target>
              <Button
                leftIcon={
                  <Avatar
                    radius="100%"
                    styles={() => ({
                      placeholderIcon: {
                        width: "40px",
                        height: "40px",
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
                    ...theme.fn.hover({
                      color: theme.fn.darken(theme.colors.munsellBlue[0], 0.3),
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
        </Flex>
      </Flex>
    </Header>
  );
}
