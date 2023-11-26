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
  const formattedDate = (date) =>
    new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);

  const rows = (data || []).map((element, index) => (
    <tr key={element.id}>
      <td>{startIndex !== undefined ? startIndex + index + 1 : ''}</td>
      <td onClick={() => handleView(element.id)}>{element.invoiceNumber}</td>
      <td>{formattedDate(new Date(element.importTime))}</td>
      <td>{element.total.toLocaleString('vi-VN')} VNĐ</td>
      <td>{element.employee}</td>
      <td>
        <IconEdit
          className="edit-button"
          strokeWidth="1.8"
          size="22px"
          onClick={() => handleEdit(element.id)}
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
