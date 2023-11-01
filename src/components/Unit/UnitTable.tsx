import { FC } from "react";
import { Table } from "@mantine/core";
import { IconEdit, IconTrashX } from "@tabler/icons-react";
import { Unit } from "./UnitFrom";
interface UnitTableProps {
  startIndex: number;
  endIndex: number;
  allUnites: AllUnitesProps;
  handleEdit: (unit: Unit) => void;
  handleDelete: (unit: Unit) => void;
}
interface AllUnitesProps {
  items: Unit[];
  numPages: number;
  offset: number;
  limit: number;
  totalItems: number;
}
const UnitTable: FC<UnitTableProps> = ({ startIndex, allUnites, handleEdit,  handleDelete}) => {
  const rows = allUnites.items.map((element, index) => (
    <tr key={element.id}>
      <td>{startIndex + index + 1}</td>
      <td>{element.name}</td>
      <td>
        <IconEdit
          className="delete-edit"
          strokeWidth="1.8"
          size="22px"
          onClick={()=>handleEdit(element)}
        />
        <IconTrashX className="delete-edit" strokeWidth="1.8" size="22px" onClick={()=>handleDelete(element)}/>
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
