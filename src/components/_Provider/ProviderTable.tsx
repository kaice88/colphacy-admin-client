import { FC } from "react";
import { Table } from "@mantine/core";
import { IconEdit, IconTrashX } from "@tabler/icons-react";
import { AllProvidersProps, Provider } from "../../types/Provider";
import { deleteModal } from "../../utils/deleteModal";
import useProvider from "../../hooks/useProvider";
interface ProviderTableProps {
  startIndex: number;
  endIndex: number;
  allProvideres: AllProvidersProps;
  handleEdit: (Provider: Provider) => void;
}
const ProviderTable: FC<ProviderTableProps> = ({
  startIndex,
  allProvideres,
  handleEdit,
}) => {
  const rows = allProvideres.items.map((element, index) => (
    <tr key={element.id}>
      <td>{startIndex + index + 1}</td>
      <td>{element.name}</td>
      <td>{element.address}</td>
      <td>{element.phone}</td>
      <td>{element.email}</td>
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
            deleteModal("nhà cung cấp", element.name, () =>
              handleDeleteProvider({ id: element.id as number })
            );
          }}
        />
      </td>
    </tr>
  ));
  const { onSubmitDeleteProviderForm } = useProvider(
    { offset: 0, limit: 5, keyword: "" },
    { offset: 0, limit: 5 }
  );
  const handleDeleteProvider = (data: { id: number }) => {
    onSubmitDeleteProviderForm(data);
  };
  return (
    <Table horizontalSpacing="xl" striped highlightOnHover withBorder>
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên</th>
          <th>Địa chỉ</th>
          <th>SĐT</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default ProviderTable;
