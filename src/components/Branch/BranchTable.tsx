import { FC, useState } from "react";
import { Modal, Table } from "@mantine/core";
import { IconEdit, IconTrashX } from "@tabler/icons-react";
import BranchForm from "./BranchForm";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import { deleteModal } from "../../utils/deleteModal";
interface BranchTableProps {
  startIndex: number;
  endIndex: number;
  allBranches: AllBranchesProps;
  handleSuccessEditSubmit: () => void;
  handleDelete: (Id: number) => void;
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
const BranchTable: FC<BranchTableProps> = ({
  startIndex,
  allBranches,
  handleSuccessEditSubmit,
  handleDelete,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const handleSuccessSubmit = () => {
    close();
    handleSuccessEditSubmit();
  };
  const handleCloseModal = () => {
    close();
  };
  const [openedRowId, setOpenedRowId] = useState<number>(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const openModal = (rowId: number, isEditing: boolean) => {
    open();
    setOpenedRowId(rowId);
    setIsEdit(isEditing);
  };

  const rows = allBranches.items.map((element, index) => (
    <React.Fragment key={element.id}>
      {openedRowId === element.id && (
        <Modal
          title={isEdit ? "Sửa chi nhánh" : "Xem chi nhánh"}
          opened={opened}
          onClose={close}
          size="60"
          centered
          m={20}
          styles={() => ({
            title: {
              fontWeight: "bold",
            },
          })}
        >
          <BranchForm
            isEdit={isEdit}
            onSuccesSubmitEdit={handleSuccessSubmit}
            onCancel={handleCloseModal}
            idBranch={element.id}
          />
        </Modal>
      )}
      <tr key={element.id} onClick={() => openModal(element.id, false)}>
        <td>{startIndex + index + 1}</td>
        <td>{element.address}</td>
        <td>{element.phone}</td>
        <td className="button-row">
          <IconEdit
            className="edit-button"
            strokeWidth="1.8"
            size="22px"
            onClick={(event) => {
              event.stopPropagation();
              openModal(element.id, true);
            }}
          />
          <IconTrashX
            className="delete-button"
            strokeWidth="1.8"
            size="22px"
            onClick={(event) => {
              event.stopPropagation();
              deleteModal("chi nhánh", "chi nhánh này", () =>
                handleDelete(element.id)
              );
            }}
          />
        </td>
      </tr>
    </React.Fragment>
  ));

  return (
    <Table
      horizontalSpacing="xl"
      striped
      highlightOnHover
      withBorder
      className="listTableCustom"
    >
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
