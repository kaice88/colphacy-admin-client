import { Table } from '@mantine/core';
import { IconEdit, IconUserCancel } from '@tabler/icons-react';
import { EmployeeListItem } from './type';

const EmployeeTable: React.FC<{
  startIndex: number | undefined;
  handleEdit: (Id: number) => void;
  handleView: (Id: number) => void;
  handleCancel: (Id: number) => void;
  data: EmployeeListItem[] | undefined;
}> = ({
  data,
  startIndex,
  handleEdit,
  handleView,
  handleCancel
}) => {
    const rows = (data || []).map((element, index) => (
      <tr key={element.id}>
        <td>{startIndex !== undefined ? startIndex + index + 1 : ''}</td>
        <td onClick={() => handleView(element.id)}>{element.fullName}</td>
        <td>{element.username}</td>
        <td>{element.phone}</td>
        <td>{element.branch}</td>
        <td>{element.role}</td>
        <td>
          <IconEdit
            className="edit-button"
            strokeWidth="1.8"
            size="22px"
            onClick={() => handleEdit(element.id)}
          />
          <IconUserCancel
            className="delete-button"
            strokeWidth="1.8"
            size="22px"
            onClick={() => handleCancel(element.id)}
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
        styles={() => ({
          '.mantine-Table-th': {
            padding: '0px 0px',
          },
        })}
        className="listTable"
      >
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ và tên</th>
            <th>Tên người dùng</th>
            <th>SĐT</th>
            <th>Chi nhánh</th>
            <th>Giới tính</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    );
  };

export default EmployeeTable;
