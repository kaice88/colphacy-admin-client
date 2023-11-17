import {
  Button,
  Flex,
  Modal,
  Pagination,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconSearch } from '@tabler/icons-react';
// import ImportForm from '../components/Import/ImportForm';
// import ImportTable from '../components/Import/ImportTable';
// import useImport from '../hooks/useImport';
import { useRef, useState } from 'react';
import { notificationShow } from '../components/Notification';
import ImportForm from '../components/Import/ImportForm';

const LIMIT = 10;

export default function Import() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ImportId, setImportId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [keyword, setKeyWord] = useState<string>('');
  const [sortBy, setSortBy] = useState<'salePrice' | 'importPrice' | null>(
    null,
  );
  const [order, setOrder] = useState<'desc' | 'asc' | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [mode, setMode] = useState<'ADD' | 'EDIT' | 'VIEW'>('EDIT');
  const theme = useMantineTheme();
  //   const { ImportData, loading, onSubmitDeleteImportForm, fetchImport } =
  //     useImport((currentPage - 1) * LIMIT, keyword, sortBy, order);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.trim();
    setKeyWord(keyword);
    setCurrentPage(1);
  };

  const handleEdit = (Id: number) => {
    setMode('EDIT');
    setImportId(Id);
    open();
  };

  //   const handleDelete = (Id: number) => {
  //     onSubmitDeleteImportForm(Id, () => {
  //       notificationShow('success', 'Success!', 'Xóa đơn nhập hàng thành công!');
  //       fetchImport.refetch();
  //     });
  //   };

  const handleView = (Id: number) => {
    setMode('VIEW');
    setImportId(Id);
    open();
  };
  const handleSortData = (sortBy: 'salePrice' | 'importPrice' | null) => {
    if (order !== 'asc') {
      setSortBy(sortBy);
    } else {
      setSortBy(null);
    }
    setOrder((prev) =>
      prev === 'desc' ? 'asc' : prev === 'asc' ? null : 'desc',
    );
  };
  const handleCloseModal = () => {
    close();
    // fetchImport.refetch();
  };

  return (
    <div className="branch-ctn">
      <Title size="h5" color={theme.colors.cobaltBlue[0]}>
        Danh sách đơn nhập hàng
      </Title>
      <Flex justify="space-between" align="center" py="lg">
        <div className="search">
          <input
            ref={inputRef}
            value={keyword}
            placeholder="Tìm bằng tên đơn nhập hàng..."
            spellCheck={false}
            onChange={handleChange}
          />
          <button
            className="search-btn"
            onMouseDown={(e) => e.preventDefault()}
          >
            <IconSearch size="1.3rem"></IconSearch>
          </button>
        </div>
        <Button
          leftIcon={<IconPlus size="15px" />}
          styles={(theme) => ({
            root: {
              backgroundColor: theme.colors.munsellBlue[0],
              ...theme.fn.hover({
                backgroundColor: theme.fn.darken(
                  theme.colors.munsellBlue[0],
                  0.1,
                ),
              }),
            },
          })}
          onClick={() => {
            setImportId(null);
            setMode('ADD');
            open();
          }}
        >
          Thêm đơn nhập hàng
        </Button>
      </Flex>
      <Modal
        size="70%"
        opened={opened}
        onClose={close}
        centered
        m="20"
        title={
          mode === 'ADD'
            ? 'Thêm đơn nhập hàng'
            : mode === 'EDIT'
            ? 'Sửa đơn nhập hàng'
            : 'Xem đơn nhập hàng'
        }
        styles={() => ({
          title: {
            fontWeight: 'bold',
          },
        })}
      >
        <ImportForm onClose={handleCloseModal} mode={mode} importId={1} />
      </Modal>
      {/* <div className="branch-table">
        <ImportTable
          data={ImportData?.items}
          startIndex={ImportData?.offset}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleView={handleView}
          handleSortData={handleSortData}
          sortBy={sortBy}
          order={order}
        />
      </div>
      {!loading && ImportData && (
        <Flex justify="space-between" align="center" py="lg">
          <div>
            {ImportData?.totalItems === 0 ? (
              <div>Không tìm thấy kết quả nào.</div>
            ) : ImportData?.totalItems === 1 ? (
              <div>Tìm thấy 1 kết quả.</div>
            ) : (
              <div>
                Hiển thị {ImportData?.items.length} kết quả từ{' '}
                {ImportData?.offset + 1} -{' '}
                {ImportData?.offset + ImportData?.items.length} trong tổng{' '}
                {ImportData?.totalItems} kết quả
              </div>
            )}
          </div>
          <Pagination
            value={currentPage}
            total={ImportData?.numPages}
            onChange={setCurrentPage}
            position="center"
            styles={(theme) => ({
              control: {
                '&[data-active]': {
                  backgroundColor: theme.colors.munsellBlue[0],
                  border: 0,
                },
              },
            })}
          />
        </Flex>
      )} */}
    </div>
  );
}
