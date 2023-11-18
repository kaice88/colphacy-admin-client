import { Center, Flex, Table } from '@mantine/core';
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconSelector,
  IconTrashX,
} from '@tabler/icons-react';
import { ProductListItem } from './type';
import { deleteModal } from '../../utils/deleteModal';

const ProductTable: React.FC<{
  startIndex: number | undefined;
  handleEdit: (Id: number) => void;
  handleView: (Id: number) => void;
  handleDelete: (Id: number) => void;
  data: ProductListItem[] | undefined;
  handleSortData: (sortBy: 'salePrice' | 'importPrice' | null) => void;
  order: 'asc' | 'desc' | null;
  sortBy: 'salePrice' | 'importPrice' | null;
}> = ({
  data,
  startIndex,
  handleEdit,
  handleView,
  handleDelete,
  handleSortData,
  order,
  sortBy,
}) => {
  const rows = (data || []).map((element, index) => (
    <tr key={element.id}>
      <td>{startIndex !== undefined ? startIndex + index + 1 : ''}</td>
      <td onClick={() => handleView(element.id)}>{element.name}</td>
      <td>{element.categoryName}</td>
      <td>{element.importPrice}</td>
      <td>{element.salePrice}</td>
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
          <th>Tên</th>
          <th>Danh mục</th>
          <th>
            <Flex justify="space-between">
              Giá nhập
              <Center>
                {sortBy !== 'importPrice' ? (
                  <IconSelector
                    size="1rem"
                    onClick={() => handleSortData('importPrice')}
                  />
                ) : order === 'asc' ? (
                  <IconChevronUp
                    size="1rem"
                    onClick={() => handleSortData('importPrice')}
                  />
                ) : (
                  <IconChevronDown
                    size="1rem"
                    onClick={() => handleSortData('importPrice')}
                  />
                )}
              </Center>
            </Flex>
          </th>
          <th>
            <Flex justify="space-between">
              Giá bán lẻ
              <Center>
                {sortBy !== 'salePrice' ? (
                  <IconSelector
                    size="1rem"
                    onClick={() => handleSortData('salePrice')}
                  />
                ) : order === 'asc' ? (
                  <IconChevronUp
                    size="1rem"
                    onClick={() => handleSortData('salePrice')}
                  />
                ) : (
                  <IconChevronDown
                    size="1rem"
                    onClick={() => handleSortData('salePrice')}
                  />
                )}
              </Center>
            </Flex>
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default ProductTable;
