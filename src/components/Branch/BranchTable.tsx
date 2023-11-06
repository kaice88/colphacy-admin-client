import { FC, useState } from "react";
import { Modal, Table } from "@mantine/core";
import { IconEdit, IconTrashX } from "@tabler/icons-react";
import BranchForm from "./BranchForm";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
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
  const [opened, { open, close }] = useDisclosure(false);
  const handleSuccessSubmit = () => {
    close();
  };

  const handleCloseModal = () => {
    close();
  };
  const [openedRowId, setOpenedRowId] = useState<number>(0);
  const openModal = (rowId: number) => {
    open();
    setOpenedRowId(rowId);
  };

  const rows = allBranches.items.map((element, index) => (
    <React.Fragment key={element.id}>
      {openedRowId === element.id && (
        <Modal opened={opened} onClose={close} size="60" centered m={20}>
          <BranchForm
            onSuccesSubmit={handleSuccessSubmit}
            onCancel={handleCloseModal}
            idBranch={element.id}
          />
        </Modal>
      )}
      <tr key={element.id} onClick={() => openModal(element.id)}>
        <td>{startIndex + index + 1}</td>
        <td>{element.address}</td>
        <td>{element.phone}</td>
        <td className="button-row">
          <IconEdit
            className="delete-edit"
            strokeWidth="1.8"
            size="22px"
            onClick={() => openModal(element.id)}
          />
          <IconTrashX className="delete-edit" strokeWidth="1.8" size="22px" />
        </td>
      </tr>
    </React.Fragment>
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
