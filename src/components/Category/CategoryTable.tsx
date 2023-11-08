import { FC } from "react";
import { Table } from "@mantine/core";
import { IconEdit, IconTrashX } from "@tabler/icons-react";
export interface Category {
    id: number | undefined;
    name: string | undefined;
  }
interface CategoryTableProps {
  startIndex: number;
  endIndex: number;
  allCategoryes: AllCategoryesProps;
}
interface AllCategoryesProps {
  items: Category[];
  numPages: number;
  offset: number;
  limit: number;
  totalItems: number;
}
const CategoryTable: FC<CategoryTableProps> = ({ startIndex, allCategoryes}) => {
  const rows = allCategoryes.items.map((element, index) => (
    <tr key={element.id}>
      <td>{startIndex + index + 1}</td>
      <td>{element.name}</td>
      <td>
        <IconEdit
          className="delete-edit"
          strokeWidth="1.8"
          size="22px"
          onClick={()=>{}}
        />
        <IconTrashX className="delete-edit" strokeWidth="1.8" size="22px" onClick={()=>{}}/>
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

export default CategoryTable;