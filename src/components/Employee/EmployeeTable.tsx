import { Table } from '@mantine/core';
import { IconEdit, IconUserCancel } from '@tabler/icons-react';
import { EmployeeListItem } from './type';

const EmployeeTable: React.FC<{
  startIndex: number | undefined;
  handleEdit: (Id: number) => void;
  handleAdd: () => void;
  handleDelete: (Id: number) => void;
  data: EmployeeListItem[] | undefined;
}> = ({
  data,
  startIndex,
  handleEdit,
  handleAdd,
  handleDelete
}) => {
    const rows = (data || []).map((element, index) => (
      <tr key={element.id}>
        <td>{startIndex !== undefined ? startIndex + index + 1 : ''}</td>
        <td>{element.fullName}</td>
        <td>{element.username}</td>
        <td>{element.phone}</td>
        <td>{element.branch}</td>
        <td>{element.gender}</td>
        <td>{element.role}</td>
        <td>
          <IconEdit
            className="edit-button"
            strokeWidth="1.8"
            size="22px"
            onClick={() => handleEdit(element.id)}
          />
          <IconUserCancel
            className={"delete-button"}
            color={element.active ? 'black' : 'red'}
            strokeWidth="1.8"
            size="22px"
            onClick={() => handleDelete(element.id)}
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
        // styles={() => ({
        //   // '.mantine-Table-th': {
        //   //   padding: '0px 0px',
        //   // },
        // })}
        className="listTable"
      >
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ và tên</th>
            <th>Tên tài khoản</th>
            <th>SĐT</th>
            <th>Chi nhánh</th>
            <th>Giới tính</th>
            <th>Vai trò</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    );
  };

export default EmployeeTable;
