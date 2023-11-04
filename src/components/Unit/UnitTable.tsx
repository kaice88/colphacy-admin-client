import { FC } from "react";
import { Table, useMantineTheme } from "@mantine/core";
import { IconEdit, IconTrashX } from "@tabler/icons-react";
import { Unit } from "./UnitForm";
import { deleteModal } from "../../utils/deleteModal";
interface UnitTableProps {
  startIndex: number;
  endIndex: number;
  allUnites: AllUnitesProps;
}
interface AllUnitesProps {
  items: Unit[];
  numPages: number;
  offset: number;
  limit: number;
  totalItems: number;
}
const UnitTable: FC<UnitTableProps> = ({ startIndex, endIndex, allUnites }) => {
  const theme = useMantineTheme();
  const rows = allUnites.items.map((element, index) => (
    <tr key={element.id}>
      <td>{startIndex + index + 1}</td>
      <td>{element.name}</td>
      <td>
        <IconEdit
          className="delete-edit"
          strokeWidth="1.8"
          size="22px"
          onClick={() => {}}
          color={theme.colors.cobaltBlue[0]}
        />
        <IconTrashX
          className="delete-edit"
          strokeWidth="1.8"
          size="22px"
          color="red"
          onClick={() => {
            deleteModal("đơn vị tinh", element.name, () => {
              console.log("xóa");
            });
          }}
        />
      </td>
    </tr>
  ));

  return (
    <Table horizontalSpacing="xl" striped highlightOnHover withBorder>
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default UnitTable;
