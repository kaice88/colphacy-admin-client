import {
  ActionIcon,
  Autocomplete,
  Flex,
  Group,
  Pagination,
  Select,
  Title,
  useMantineTheme,
} from '@mantine/core';
import StockTable from '../components/Stock/StockTable';
import { useStock } from '../hooks/useStock';
import { useRef, useState } from 'react';
import { IconBuildingStore, IconSearch } from '@tabler/icons-react';
import useAuth from '../hooks/useAuth';
import { useDebouncedValue } from '@mantine/hooks';
import { transformSelectData } from '../utils/helper';

function Stock() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { userProfile } = useAuth();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const theme = useMantineTheme();
  const [keyword, setKeyWord] = useState<string>('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setKeyWord(keyword);
    setCurrentPage(1);
  };
  const [searchBranch, setSearchBranch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchDebounced] = useDebouncedValue(searchBranch, 100);
  const { stockData, isLoading, branchData } = useStock(
    branchDebounced,
    Number(selectedBranch),
    (currentPage - 1) * 10,
    keyword,
  );

  const getData = (stockData, startIndex) => {
    const collapsedData = {};
    let index = 0;
    for (let i = stockData.length - 1; i >= 0; i--) {
      const { productId, productName, quantity } = stockData[i];
      if (collapsedData[productId]) {
        collapsedData[productId].totalQuantity += quantity;
      } else {
        index++;
        collapsedData[productId] = {
          no: startIndex !== undefined ? startIndex + index : '',
          productName,
          totalQuantity: quantity,
          id: productId,
        };
      }
    }

    return Object.values(collapsedData);
  };

  return (
    stockData !== undefined && (
      <div className="branch-ctn">
        <Title size="h5" color={theme.colors.cobaltBlue[0]}>
          Danh sách tồn kho
        </Title>
        <Flex justify="space-between" align="center" py="lg">
          <div className="search">
            <input
              ref={inputRef}
              value={keyword}
              placeholder="Tìm kiếm theo tên"
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
        <StockTable
          isLoading={isLoading}
          stockData={stockData.data.items}
          result={getData(stockData.data.items, stockData.data.offset)}
          startIndex={stockData.data.offset}
        ></StockTable>
        {!isLoading && stockData && (
          <Flex justify="space-between" align="center" py="lg">
            <div>
              {stockData.data?.totalItems === 0 ? (
                <div>Không tìm thấy kết quả nào.</div>
              ) : stockData.data?.totalItems === 1 ? (
                <div>Tìm thấy 1 kết quả.</div>
              ) : (
                <div>
                  Hiển thị{' '}
                  {getData(stockData.data.items, stockData.data.offset).length}{' '}
                  kết quả từ {stockData.data?.offset + 1} -{' '}
                  {stockData.data?.offset +
                    getData(stockData.data.items, stockData.data.offset)
                      .length}{' '}
                  trong tổng {stockData.data?.totalItems} kết quả
                </div>
              )}
            </div>
            <Pagination
              value={currentPage}
              total={stockData.data?.numPages}
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
    )
  );
}

export default Stock;
