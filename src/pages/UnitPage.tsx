import {
  Button,
  Flex,
  Group,
  Modal,
  Pagination,
  useMantineTheme,
  Title,
} from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import UnitTable from '../components/Unit/UnitTable';
import UnitForm, { Unit } from '../components/Unit/UnitForm';
import useUnit, { useUnitExceptAdd } from '../hooks/useUnit';
import { handleGlobalException } from '../utils/error';
import { notificationShow } from '../components/Notification';
import { useForm } from 'react-hook-form';
import { ErrorObject } from '../types/error';
export interface AllUnitsProps {
  items: ItemsProps[];
  numPages: number;
  offset: number;
  limit: number;
  totalItems: number;
}
interface ItemsProps {
  id: number;
  name: string;
}
export default function UnitPage() {
  const theme = useMantineTheme();
  const [action, setAction] = useState('add');
  const [opened, { open, close }] = useDisclosure(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [unit, setUnit] = useState<Unit>();
  const [allUnits, setAllUnits] = useState<AllUnitsProps>({
    items: [],
    numPages: 0,
    offset: 0,
    limit: 0,
    totalItems: 0,
  });
  const itemsPerPage = allUnits.limit;
  const startIndex = allUnits.offset;
  const endIndex = startIndex + itemsPerPage;
  const totalUnits = allUnits.totalItems;
  const totalPages = allUnits.numPages;
  const limitInit = 10;
  const offset = currentPage - 1;
  const search = {
    offset: offset,
    limit: 10,
    keyword: searchValue,
  };
  const filter = {
    offset: offset,
    limit: 10,
  };
  const [searchArr, setSearchArr] = useState(search);

  const { fetchUnit, fetchUnitSearchKeywork } = useUnitExceptAdd(
    search,
    filter,
  );
  const { onSubmitDeleteUnitForm } = useUnit();
  const handleDeleteUnit = (data: { id: number }) => {
    onSubmitDeleteUnitForm(data, () => {
      notificationShow('success', 'Success!', 'Xóa đơn vị thành công!');
      fetchUnitData();
    });
  };
  const { setError } = useForm({
    defaultValues: {
      offset: '',
      limit: '',
    },
  });
  async function fetchUnitData() {
    const data = await fetchUnit.refetch();
    if (data.isSuccess) {
      setAllUnits(data.data.data);
    } else if (data.isError) {
      const error = data.error;
      handleGlobalException(error, () => {
        if (error.response.status === 400) {
          const data = error.response.data;
          Object.keys(data).forEach((key) => {
            notificationShow('error', 'Error!', data[key]);
          });
        }
      });
    }
  }
  async function fetchKeyworkData() {
    const data = await fetchUnitSearchKeywork.refetch();
    if (data.isSuccess) {
      setAllUnits(data.data.data);
    } else if (data.isError) {
      const error = data.error as ErrorObject;
      handleGlobalException(error, () => {
        setError('offset', {
          type: 'manual',
          message: error.response.data.offset,
        });
        setError('limit', {
          type: 'manual',
          message: error.response.data.limit,
        });
      });
    }
  }
  useEffect(() => {
    if (searchArr.keyword) {
      fetchKeyworkData();
    } else {
      fetchUnitData();
    }
  }, [searchArr]);
  useEffect(() => {
    setSearchArr((prev) => {
      return {
        ...prev,
        offset: offset,
        keyword: searchValue,
      };
    });
  }, [searchValue, offset]);
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue);
      setCurrentPage(1);
    }
  };
  const handleEdit = (unit: Unit) => {
    setAction('update');
    open();
    setUnit(unit);
  };
  return (
    <div className="unit-ctn">
      <Title size="h5" color={theme.colors.cobaltBlue[0]}>
        Danh sách đơn vị tính
      </Title>
      <Flex py="lg">
        <div className="search">
          <input
            ref={inputRef}
            value={searchValue}
            placeholder="Tìm kiếm..."
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
        <Modal
          opened={opened}
          onClose={close}
          size="60"
          centered
          m={20}
          title={action === 'add' ? 'Thêm đơn vị tính' : 'Sửa đơn vị tính'}
          styles={() => ({
            title: {
              fontWeight: 'bold',
            },
          })}
        >
          <UnitForm
            title={action}
            onClose={() => {
              fetchUnitData();
              close();
            }}
            unit={unit}
          />
        </Modal>
        <Group ml="auto">
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
              setAction('add');
              open();
            }}
          >
            Thêm đơn vị tính
          </Button>
        </Group>
      </Flex>
      <div className="unit-table">
        <UnitTable
          startIndex={startIndex * limitInit}
          endIndex={endIndex}
          allUnites={allUnits}
          handleEdit={handleEdit}
          handleDeleteUnit={handleDeleteUnit}
        />
      </div>
      <br />
      <div className="pagination-ctn">
        {totalUnits === 0 ? (
          <div> Không tìm thấy kết quả nào.</div>
        ) : totalUnits === 1 ? (
          <div>Tìm thấy 1 kết quả.</div>
        ) : (
          <div>
            Hiển thị{' '}
            {endIndex <= totalUnits ? itemsPerPage : totalUnits % itemsPerPage}{' '}
            kết quả từ {startIndex + 1} -{' '}
            {endIndex <= totalUnits ? endIndex : totalUnits} trong tổng{' '}
            {totalUnits} kết quả
          </div>
        )}
        <Pagination
          value={currentPage}
          total={totalPages}
          onChange={handlePageChange}
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
      </div>
    </div>
  );
}
