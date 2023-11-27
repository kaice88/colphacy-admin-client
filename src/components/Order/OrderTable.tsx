import { FC, useState } from "react";
import { Button, Center, Flex, Modal, Table, Text } from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from "@tabler/icons-react";
import { OrderItem } from "./type";
import { deleteModal } from "../../utils/deleteModal";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import OrderDetailModal from "./OrderDetailModal";
interface OrderTableProps {
  startIndex: number;
  sortBy:
    | "order_time"
    | "confirm_time"
    | "ship_time"
    | "deliver_time"
    | "cancel_time"
    | "total";
  order: "asc" | "desc";
  time: string;
  orders: OrderItem[] | undefined;
  status: string;
  changeStatusOrder: (data: {
    id: number;
    toStatus: string | null;
}) => void
}

const OrderTable: FC<OrderTableProps> = ({
  startIndex,
  sortBy,
  order,
  time,
  orders,
  status,
  changeStatusOrder,
}) => {
  const changeStatusModal = (id: number, toStatus: string) =>
    modals.openConfirmModal({
      title: toStatus != "CANCELLED"? <b>Xác nhận đơn hàng</b>: <b>Hủy đơn hàng</b>,
      children: toStatus != "CANCELLED"? "Bạn có chắc chắn muốn xác nhận đơn hàng":"Bạn có chắc chắn muốn hủy đơn hàng",
      centered: true,
      confirmProps: { color: "blue" },
      labels: { confirm: "Xác nhận", cancel: "Hủy" },
      onCancel: () => {},
      onConfirm: () => changeStatusOrder({ id: id , toStatus: toStatus!="CANCELLED"?toStatus:null }),
    });
  const formattedDate = (date: Date) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  const [opened, { open, close }] = useDisclosure(false);
  const [detailOrder, setDetailOrder] = useState<OrderItem>();
  const rows = orders?.map((element, index) => (
    <tr key={index}>
      <td>{startIndex + index + 1}</td>
      <td>{element.customer}</td>
      <td>{formattedDate(new Date(element.orderTime))}</td>
      <td>{element.total}</td>
      <td style={{ width: "10px" }}>
        <Flex align="center">
          <Button
            m={5}
            size="xs"
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
              open();
              setDetailOrder(element);
            }}
          >
            Xem chi tiết
          </Button>
          {(status == "PENDING" ||
            status == "CONFIRMED" ||
            status == "SHIPPING") && (
            <>
              <Button
                m={5}
                size="xs"
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
                onClick={() => changeStatusModal(element.id, status)}
              >
                Xác nhận
              </Button>
              <Button m={5} color="red" size="xs" onClick={() => changeStatusModal(element.id, "CANCELLED")}>
                Hủy đơn
              </Button>
            </>
          )}
        </Flex>
      </td>
    </tr>
  ));

  return (
    <Table horizontalSpacing="xl" striped highlightOnHover withBorder>
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên khách hàng</th>
          <th>
            <Flex justify="space-between">
              {time}
              <Center>
                {sortBy !== "order_time" ? (
                  <IconSelector
                    size="1rem"
                    // onClick={() => handleSortData('importPrice')}
                  />
                ) : order === "asc" ? (
                  <IconChevronUp
                    size="1rem"
                    // onClick={() => handleSortData('importPrice')}
                  />
                ) : (
                  <IconChevronDown
                    size="1rem"
                    // onClick={() => handleSortData('importPrice')}
                  />
                )}
              </Center>
            </Flex>
          </th>
          <th>Tổng giá</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows}
        <Modal
          opened={opened}
          onClose={() => {
            close();
          }}
          size="60"
          centered
          m={20}
          title={"Chi tiết sản phẩm"}
          styles={() => ({
            title: {
              fontWeight: "bold",
            },
          })}
        >
          <OrderDetailModal
            onClose={() => {
              close();
            }}
            detailOrder={detailOrder}
            status={status}
          />
        </Modal>
      </tbody>
    </Table>
  );
};

export default OrderTable;
