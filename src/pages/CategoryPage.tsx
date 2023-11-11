import { Flex, Pagination, Title, useMantineTheme } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { handleGlobalException } from '../utils/error';
import { notificationShow } from '../components/Notification';
import { useForm } from 'react-hook-form';
import useCategory from '../hooks/useCategory';
import CategoryTable from '../components/Category/CategoryTable';
export interface AllCategoriesProps {
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
export default function CategoryPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const theme = useMantineTheme();

  const [allCategories, setAllCategories] = useState<AllCategoriesProps>({
    items: [],
    numPages: 0,
    offset: 0,
    limit: 0,
    totalItems: 0,
  });
  const itemsPerPage = allCategories.limit;
  const startIndex = allCategories.offset;
  const endIndex = startIndex + itemsPerPage;
  const totalCategories = allCategories.totalItems;
  const totalPages = allCategories.numPages;
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

  const { fetchCategory, fetchCategoriesSearchKeywork } = useCategory(
    search,
    filter,
  );
  const { setError } = useForm({
    defaultValues: {
      offset: '',
      limit: '',
    },
  });
  async function fetchCategoryData() {
    const data = await fetchCategory.refetch();
    if (data.isSuccess) {
      setAllCategories(data.data.data);
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
    const data = await fetchCategoriesSearchKeywork.refetch();
    if (data.isSuccess) {
      setAllCategories(data.data.data);
    } else if (data.isError) {
      const error = data.error;
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
      fetchCategoryData();
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
  return (
    <div className="unit-ctn">
      <Title size="h5" color={theme.colors.cobaltBlue[0]}>
        Danh sách danh mục
      </Title>
      <Flex>
        <div className="search-field">
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
        </div>
      </Flex>
      <div className="unit-table">
        <CategoryTable
          startIndex={startIndex * limitInit}
          endIndex={endIndex}
          allCategoryes={allCategories}
        />
      </div>
      <br />
      <div className="pagination-ctn">
        {totalCategories === 0 ? (
          <div> Không tìm thấy kết quả nào.</div>
        ) : totalCategories === 1 ? (
          <div>Tìm thấy 1 kết quả.</div>
        ) : (
          <div>
            Hiển thị{' '}
            {endIndex <= totalCategories
              ? itemsPerPage
              : totalCategories % itemsPerPage}{' '}
            kết quả từ {startIndex + 1} -{' '}
            {endIndex <= totalCategories ? endIndex : totalCategories} trong
            tổng {totalCategories} kết quả
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
