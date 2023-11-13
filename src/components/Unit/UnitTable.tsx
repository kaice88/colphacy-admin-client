import { FC } from 'react';
import { Table } from '@mantine/core';
import { IconEdit, IconTrashX } from '@tabler/icons-react';
import { Unit } from './UnitForm';
import { deleteModal } from '../../utils/deleteModal';

interface UnitTableProps {
  startIndex: number;
  endIndex: number;
  allUnites: AllUnitesProps;
  handleEdit: (unit: Unit) => void;
  handleDeleteUnit: (data: { id: number }) => void;
}
interface AllUnitesProps {
  items: Unit[];
  numPages: number;
  offset: number;
  limit: number;
  totalItems: number;
}

const UnitTable: FC<UnitTableProps> = ({
  startIndex,
  allUnites,
  handleEdit,
  handleDeleteUnit,
}) => {
  const rows = allUnites.items.map((element, index) => (
    <tr key={element.id}>
      <td>{startIndex + index + 1}</td>
      <td>{element.name}</td>
      <td align="right">
        <IconEdit
          className="edit-button"
          strokeWidth="1.8"
          size="22px"
          onClick={() => {
            handleEdit(element);
          }}
        />
        <IconTrashX
          className="delete-button"
          strokeWidth="1.8"
          size="22px"
          onClick={() => {
            deleteModal('đơn vị tính', element.name, () =>
              handleDeleteUnit({ id: element.id as number }),
            );
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
