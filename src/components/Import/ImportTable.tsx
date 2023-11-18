import { Center, Flex, Table } from '@mantine/core';
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconSelector,
  IconTrashX,
} from '@tabler/icons-react';
import { deleteModal } from '../../utils/deleteModal';

const ImportTable: React.FC<{
  startIndex: number | undefined;
  handleEdit: (Id: number) => void;
  handleView: (Id: number) => void;
  handleDelete: (Id: number) => void;
}> = ({ data, startIndex, handleEdit, handleView, handleDelete }) => {
  const rows = (data || []).map((element, index) => (
    <tr key={element.id}>
      <td>{startIndex !== undefined ? startIndex + index + 1 : ''}</td>
      <td onClick={() => handleView(element.id)}>{element.invoiceNumber}</td>
      <td>{element.importTime}</td>
      <td>{element.total}</td>
      <td>{element.employee}</td>
      <td>
        <IconEdit
          className="edit-button"
          strokeWidth="1.8"
          size="22px"
          onClick={() => handleEdit(element.id)}
        />
        <IconTrashX
          className="delete-button"
          strokeWidth="1.8"
          size="22px"
          onClick={() => {
            deleteModal('sản phẩm', element.name, () =>
              handleDelete(element.id),
            );
          }}
        />
      </td>
    </tr>
  ));

  return (
    <Table
      horizontalSpacing="xl"
      striped
      highlightOnHover
      withBorder
      className="listTable"
    >
      <thead>
        <tr>
          <th>STT</th>
          <th>Số hóa đơn</th>
          <th>Ngày nhập</th>
          <th>Tổng</th>
          <th>Nhân viên</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default ImportTable;
