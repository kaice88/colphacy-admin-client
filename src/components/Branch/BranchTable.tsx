import { FC } from "react";
import { Table } from "@mantine/core";
import { IconEdit, IconTrashX } from "@tabler/icons-react";
interface BranchTableProps {
  startIndex: number;
  endIndex: number;
  allBranches: AllBranchesProps;
}
interface AllBranchesProps {
  items: ItemsProps[];
  numPages: number;
  offset: number;
  limit: number;
  totalItems: number;
}
interface ItemsProps {
  id: number;
  address: string;
  phone: string;
}
const BranchTable: FC<BranchTableProps> = ({ startIndex, allBranches }) => {
  const rows = allBranches.items.map((element, index) => (
    <tr key={element.id}>
      <td>{startIndex + index + 1}</td>
      <td>{element.address}</td>
      <td>{element.phone}</td>
      <td>
        <IconEdit className="delete-edit" strokeWidth="1.8" size="22px" />
        <IconTrashX className="delete-edit" strokeWidth="1.8" size="22px" />
      </td>
    </tr>
  ));

  return (
    <Table horizontalSpacing="xl" striped highlightOnHover withBorder>
      <thead>
        <tr>
          <th>STT</th>
          <th>Địa chỉ</th>
          <th>Thông tin liên hệ</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default BranchTable;
