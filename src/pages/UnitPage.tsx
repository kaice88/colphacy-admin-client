import { Button, Flex, Group, Modal } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import UnitForm from "../components/unit/UnitForm";
import { useDisclosure } from "@mantine/hooks";

export default function UnitPage() {
  const [action, setAction] = useState("add");
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className="unit-ctn">
      <h1 className="unit-title">Danh sách đơn vị tính</h1>
      <Flex justify={"flex-end"}>
        <Modal
          opened={opened}
          onClose={close}
          size="60"
          centered
          m={20}
          title={action === "add" ? "Thêm đơn vị tính" : ""}
          styles={() => ({
            title: {
              fontWeight: "bold",
            },
          })}
        >
          <UnitForm title={action} onClose={close} />
        </Modal>
        {/* <Group ml="auto"> */}
        <Button
          // className="button unit-add-button"
          leftIcon={<IconPlus size="15px" />}
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
          onClick={() => {
            setAction("add");
            open();
          }}
        >
          Thêm đơn vị tính
        </Button>
        {/* </Group> */}
      </Flex>
    </div>
  );
}
