import { Button, Flex, Modal, Pagination, Tabs, Title, useMantineTheme } from "@mantine/core";
import { DatePickerInput, DatesProvider } from "@mantine/dates";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { OrderStatus } from "../enums/Order";
import OrderTable from "../components/Order/OrderTable";
import useOrder from "../hooks/useOrder";
import { useDisclosure } from "@mantine/hooks";
import AddOrderForm from "../components/Order/AddOrderForm";
const LIMIT = 10;

const Order: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<string | null>("PENDING");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [keyword, setKeyWord] = useState<string>("");


  const theme = useMantineTheme();
  const { OrderData, handleChangeStatusOrder } = useOrder((currentPage - 1) * LIMIT, keyword, startDate, endDate, status);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setKeyWord(keyword);
    setCurrentPage(1);
  };
  const [opened, { open, close }] = useDisclosure(false);
  const handleCloseModal = () => {
    close();
    // fetchImport.refetch();
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
            placeholder="Tìm kiếm theo tên sản phẩm, tên, sđt khách hàng, ..."
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
          <DatesProvider settings={{ locale: "vn" }}>
            <DatePickerInput
              placeholder="Thời gian đặt từ"
              value={startDate}
              valueFormat="DD/MM/YYYY"
              onChange={setStartDate}
              clearable
            />
          </DatesProvider>
          đến
          <DatePickerInput
            placeholder="ngày"
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
                  0.1
                ),
              }),
            },
          })}
          onClick={() => {
            open()
          }
          }
        >
          Thêm đơn hàng
        </Button>
      </Flex>
      <Tabs defaultValue="PENDING" onTabChange={setStatus}>
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
              startIndex={OrderData?.offset}
              sortBy={"order_time"}
              order={"asc"}
              time={"Thời gian đặt"}
              orders={OrderData?.items}
              status={item}
              changeStatusOrder={handleChangeStatusOrder}
            />
            { OrderData && (
              <Flex justify="space-between" align="center" py="lg">
                <div>
                  {OrderData?.totalItems === 0 ? (
                    <div>Không tìm thấy kết quả nào.</div>
                  ) : OrderData?.totalItems === 1 ? (
                    <div>Tìm thấy 1 kết quả.</div>
                  ) : (
                    <div>
                      Hiển thị {OrderData?.items.length} kết quả từ{' '}
                      {OrderData?.offset + 1} -{' '}
                      {OrderData?.offset + OrderData?.items.length} trong tổng{' '}
                      {OrderData?.totalItems} kết quả
                    </div>
                  )}
                </div>
                <Pagination
                  value={currentPage}
                  total={OrderData?.numPages}
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
          </Tabs.Panel>
        ))}
      </Tabs>
      <Modal
        size="100%"
        opened={opened}
        onClose={close}
        centered
        m="20"
        title="Thêm đơn hàng"
        styles={() => ({
          title: {
            fontWeight: 'bold',
          },
        })}
      >
        <AddOrderForm
          onClose={handleCloseModal}
          setStatus={setStatus}
        />
      </Modal>
    </div>
  );
};

export default Order;