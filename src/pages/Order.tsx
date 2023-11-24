import { Button, Flex, Tabs, Title, useMantineTheme } from '@mantine/core';
import { DatePickerInput, DatesProvider } from '@mantine/dates';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { OrderStatus } from '../enums/Order';
import OrderTable from '../components/Order/OrderTable';

const Order: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [keyword, setKeyWord] = useState<string>('');
  const theme = useMantineTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.trim();
    setKeyWord(keyword);
    // setCurrentPage(1);
  };
  return (
    <div className="branch-ctn">
      <Title size="h5" color={theme.colors.cobaltBlue[0]}>
        Danh sách đơn hàng
      </Title>
      <Flex justify="space-between" align="center" py="lg">
        <div className="search">
          <input
            ref={inputRef}
            value={keyword}
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
          onClick={() => {}}
        >
          Thêm đơn hàng
        </Button>
      </Flex>
      <Tabs defaultValue="PENDING">
        <Tabs.List grow>
          {Object.keys(OrderStatus).map((item) => (
            <Tabs.Tab key={item} value={item}>
              {OrderStatus[item as keyof typeof OrderStatus]}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {Object.keys(OrderStatus).map((item) => (
          <Tabs.Panel key={item} value={item} pt="xs">
            <OrderTable
              startIndex={0}
              sortBy={'order_time'}
              order={'asc'}
              time={'Thời gian đặt'}
            />
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
};

export default Order;
