import { Table } from '@mantine/core';
import { IconEdit, IconTrashX } from '@tabler/icons-react';

const ProductTable: React.FC = ({ data, startIndex }) => {
  const rows = (data || []).map((element, index) => (
    <tr key={element.id}>
      <td>{startIndex + index + 1}</td>
      <td>{element.name}</td>
      <td>{element.categoryName}</td>
      <td>{element.importPrice}</td>
      <td>{element.salePrice}</td>
      <td>
        <IconEdit className="delete-edit" strokeWidth="1.8" size="22px" />
        <IconTrashX className="delete-edit" strokeWidth="1.8" size="22px" />
      </td>
    </tr>
  ));

  return (
    <Table horizontalSpacing="xl" striped highlightOnHover withBorder mt="lg">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên</th>
          <th>Danh mục</th>
          <th>Giá nhập</th>
          <th>Giá bán lẻ</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default ProductTable;
