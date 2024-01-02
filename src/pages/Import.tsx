import {
  ActionIcon,
  Button,
  Flex,
  Modal,
  Pagination,
  Select,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { IconBuildingStore, IconPlus, IconSearch } from '@tabler/icons-react';
import ImportTable from '../components/Import/ImportTable';
import { useRef, useState } from 'react';
import ImportForm from '../components/Import/ImportForm';
import useImport from '../hooks/useImport';
import { notificationShow } from '../components/Notification';
import { DatePickerInput, DatesProvider } from '@mantine/dates';
import { transformSelectData } from '../utils/helper';
import useAuth from '../hooks/useAuth';

const LIMIT = 10;

export default function Import() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [importId, setImportId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [keyword, setKeyWord] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [mode, setMode] = useState<'ADD' | 'EDIT' | 'VIEW'>('EDIT');
  const { userProfile } = useAuth();
  const theme = useMantineTheme();
  const [searchBranch, setSearchBranch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchDebounced] = useDebouncedValue(searchBranch, 100);
  console.log('hi');
  const {
    importData,
    loading,
    fetchImport,
    onSubmitDeleteImportForm,
    branchData,
  } = useImport(
    branchDebounced,
    Number(selectedBranch),
    (currentPage - 1) * LIMIT,
    keyword,
    startDate,
    endDate,
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setKeyWord(keyword);
    setCurrentPage(1);
  };
  const handleEdit = (Id: number) => {
    setMode('EDIT');
    setImportId(Id);
    open();
  };

  const handleDelete = (Id: number) => {
    onSubmitDeleteImportForm(Id, () => {
      notificationShow('success', 'Success!', 'Xóa đơn nhập hàng thành công!');
      fetchImport.refetch();
    });
  };

  const handleView = (Id: number) => {
    setMode('VIEW');
    setImportId(Id);
    open();
  };

  const handleCloseModal = () => {
    close();
    fetchImport.refetch();
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
            placeholder="Tìm kiếm theo tên sản phẩm"
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
      <Flex justify="flex-start" align="center" pb="lg" gap="lg">
        <Flex align="center" gap="sm">
          <DatesProvider settings={{ locale: 'vn' }}>
            <DatePickerInput
              placeholder="Ngày bắt đầu"
              value={startDate}
              valueFormat="DD/MM/YYYY"
              onChange={setStartDate}
              clearable
            />
          </DatesProvider>
          đến
          <DatePickerInput
            placeholder="Ngày kết thúc"
            value={endDate}
            valueFormat="DD/MM/YYYY"
            onChange={setEndDate}
            clearable
          />
        </Flex>
        {userProfile?.role === 'ADMIN' && (
          <Select
            radius="md"
            data={transformSelectData(branchData || [], true)}
            searchable
            onSearchChange={(value) => {
              setSearchBranch(value);
            }}
            onChange={(value) => setSelectedBranch(value)}
            clearable
            placeholder="Chọn chi nhánh"
            icon={
              <ActionIcon color="indigo" variant="light">
                <IconBuildingStore size="1.125rem" />
              </ActionIcon>
            }
          />
        )}
      </Flex>

      <Modal
        size="100%"
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
        <ImportForm
          onClose={handleCloseModal}
          mode={mode}
          importId={importId}
        />
      </Modal>
      <div className="branch-table">
        <ImportTable
          data={importData?.items}
          startIndex={importData?.offset}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleView={handleView}
        />
      </div>
      {!loading && importData && (
        <Flex justify="space-between" align="center" py="lg">
          <div>
            {importData?.totalItems === 0 ? (
              <div>Không tìm thấy kết quả nào.</div>
            ) : importData?.totalItems === 1 ? (
              <div>Tìm thấy 1 kết quả.</div>
            ) : (
              <div>
                Hiển thị {importData?.items.length} kết quả từ{' '}
                {importData?.offset + 1} -{' '}
                {importData?.offset + importData?.items.length} trong tổng{' '}
                {importData?.totalItems} kết quả
              </div>
            )}
          </div>
          <Pagination
            value={currentPage}
            total={importData?.numPages}
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
      )}
    </div>
  );
}
