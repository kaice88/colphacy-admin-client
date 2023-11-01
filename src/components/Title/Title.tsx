import { Button, Divider, Flex, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function Title(props) {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <Flex align={"center"}>
      <Button
        styles={(theme) => ({
          root: {
            backgroundColor: theme.white,
            color: theme.black,
            ...theme.fn.hover({
              color: theme.colors.munsellBlue[0],
              backgroundColor: theme.white,
            }),
            paddingLeft: "0px",
            paddingRight: "10px",
          },
        })}
        onClick={handleBack}
      >
        <IconArrowLeft onClick={handleBack} />
      </Button>
      <Divider size="xs" color="dark" orientation="vertical" />
      <Text style={{ paddingLeft: "14px" }} size={"18px"}>
        {props.title}
      </Text>
    </Flex>
  );
}
