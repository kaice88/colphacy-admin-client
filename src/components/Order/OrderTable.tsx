import { FC, useState } from "react";
import { Button, Center, Flex, Modal, Table, Text } from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from "@tabler/icons-react";
import { OrderItem } from "./type";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import OrderDetailModal from "./OrderDetailModal";
interface OrderTableProps {
  startIndex: number;
  sortBy: "TIME" | "TOTAL" | null;
  order: "desc" | "asc" | null;
  orders: OrderItem[] | undefined;
  status: string;
  handleSortData: (sortBy: "TIME" | "TOTAL" | null) => void;
  changeStatusOrder: (data: { id: number; toStatus: string | null }) => void;
  changeResolveType: (data: { id: number; accepted: boolean }) => void;
}

function convertCancelBy(cancelBy: string | undefined) {
  if (cancelBy === "EMPLOYEE") return "Đã hủy bởi cửa hàng";
  if (cancelBy === "CUSTOMER") return "Đã hủy bởi khách hàng";
  if (cancelBy === "UNPAID") return "Quá hạn thanh toán";
  return "";
}

function convertResolveType(resolveType: string | undefined) {
  if (resolveType === "PENDING") return "Chưa giải quyết";
  if (resolveType === "REFUSED") return "Đã từ chối";
  if (resolveType === "RETURN") return "Đã chấp nhận";
  if (resolveType === "REFUND") return "Đã chấp nhận";
  return "";
}

const OrderTable: FC<OrderTableProps> = ({
  startIndex,
  sortBy,
  order,
  orders,
  status,
  changeStatusOrder,
  changeResolveType,
  handleSortData,
}) => {
  const changeStatusModal = (id: number, toStatus: string) =>
    modals.openConfirmModal({
      title:
        toStatus != "CANCELLED" ? (
          <b>Xác nhận đơn hàng</b>
        ) : (
          <b>Hủy đơn hàng</b>
        ),
      children:
        toStatus != "CANCELLED"
          ? "Bạn có chắc chắn muốn xác nhận đơn hàng"
          : "Bạn có chắc chắn muốn hủy đơn hàng",
      centered: true,
      confirmProps: { color: "red" },
      labels: { confirm: "Xác nhận", cancel: "Hủy" },
      onCancel: () => {},
      onConfirm: () => changeStatusOrder({ id: id, toStatus: toStatus }),
    });
  const changeResolveTypeModal = (id: number, accepted: boolean) =>
    modals.openConfirmModal({
      title:
        accepted == true ? <b>Chấp nhận yêu cầu</b> : <b>Từ chối yêu cầu</b>,
      children:
        accepted == true
          ? "Bạn có chắc chắn muốn chấp nhận yêu cầu trả hàng/ hoàn tiền"
          : "Bạn có chắc chắn muốn từ chối yêu cầu trả hàng/ hoàn tiền",
      centered: true,
      confirmProps: { color: "red" },
      labels:
        accepted == true
          ? { confirm: "Chấp nhận", cancel: "Hủy" }
          : { confirm: "Từ chối", cancel: "Hủy" },
      onCancel: () => {},
      onConfirm: () => changeResolveType({ id: id, accepted: accepted }),
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
  const [sender, setSender] = useState("");
  const [total, setTotal] = useState(0);
  const [idDetailOrder, setIdDetailOrder] = useState<number>();
  const rows = orders?.map((element, index) => (
    <tr key={index}>
      <td>{startIndex + index + 1}</td>
      <td>{element.id}</td>
      <td>{element.customer}</td>
      <td>
        {status == "PENDING" && formattedDate(new Date(element?.orderTime))}
        {status == "CONFIRMED" && formattedDate(new Date(element?.confirmTime))}
        {status == "SHIPPING" && formattedDate(new Date(element?.shipTime))}
        {status == "DELIVERED" && formattedDate(new Date(element?.deliverTime))}
        {status == "CANCELLED" && formattedDate(new Date(element?.cancelTime))}
        {status == "RETURNED" &&
          formattedDate(new Date(element?.requestReturnTime))}
      </td>
      <td>{element.total.toLocaleString("vi-VN")}</td>
      {status == "CANCELLED" && <td>{convertCancelBy(element.cancelBy)}</td>}
      {status == "RETURNED" && (
        <td>{convertResolveType(element.resolveType)}</td>
      )}
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
              setIdDetailOrder(element.id);
              setSender(element.customer);
              setTotal(element.total);
              open();
            }}
          >
            Xem chi tiết
          </Button>
          {(status == "PENDING" || status == "CONFIRMED") && (
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
            </>
          )}
          {status == "SHIPPING" && (
            <>
              {element.adminConfirmDeliver ? (
                <Button
                  m={5}
                  size="xs"
                  variant="light"
                  styles={(theme) => ({
                    root: {
                      color: theme.colors.munsellBlue[0],
                    },
                  })}
                >
                  Đã xác nhận
                </Button>
              ) : (
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
              )}
            </>
          )}
          {status == "PENDING" && (
            <>
              <Button
                m={5}
                color="red"
                size="xs"
                onClick={() => changeStatusModal(element.id, "CANCELLED")}
              >
                Hủy đơn
              </Button>
            </>
          )}
          {status == "RETURNED" && element.resolveType == "PENDING" && (
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
                onClick={() => changeResolveTypeModal(element.id, true)}
              >
                Chấp nhận
              </Button>
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
                onClick={() => changeResolveTypeModal(element.id, false)}
              >
                Từ chối
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
          <th>Mã đơn hàng</th>
          <th>Tên khách hàng</th>
          <th>
            <Flex justify="space-between">
              {status == "PENDING" && <Text>Thời gian đặt hàng</Text>}
              {status == "CONFIRMED" && <Text>Thời gian xác nhận</Text>}
              {status == "SHIPPING" && <Text>Thời gian giao hàng</Text>}
              {status == "DELIVERED" && <Text>Thời gian nhận hàng</Text>}
              {status == "CANCELLED" && <Text>Thời gian hủy</Text>}
              {status == "RETURNED" && <Text>Thời gian yêu cầu hoàn tiền</Text>}
              <Center>
                {sortBy !== "TIME" ? (
                  <IconSelector
                    size="1rem"
                    onClick={() => handleSortData("TIME")}
                  />
                ) : order === "asc" ? (
                  <IconChevronUp
                    size="1rem"
                    onClick={() => handleSortData("TIME")}
                  />
                ) : (
                  <IconChevronDown
                    size="1rem"
                    onClick={() => handleSortData("TIME")}
                  />
                )}
              </Center>
            </Flex>
          </th>
          <th>
            <Flex justify="space-between">
              Tổng giá{" "}
              <Center>
                {sortBy !== "TOTAL" ? (
                  <IconSelector
                    size="1rem"
                    onClick={() => {
                      handleSortData("TOTAL");
                    }}
                  />
                ) : order === "asc" ? (
                  <IconChevronUp
                    size="1rem"
                    onClick={() => handleSortData("TOTAL")}
                  />
                ) : (
                  <IconChevronDown
                    size="1rem"
                    onClick={() => handleSortData("TOTAL")}
                  />
                )}
              </Center>
            </Flex>
          </th>
          {status == "CANCELLED" && <th>Lý do hủy</th>}
          {status == "RETURNED" && <th>Trạng thái giải quyết đơn hàng</th>}
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
          title={"Chi tiết đơn hàng"}
          styles={() => ({
            title: {
              fontWeight: "bold",
            },
          })}
        >
          <OrderDetailModal
            senderName={sender}
            status={status}
            idDetailOrder={idDetailOrder}
            total={total.toLocaleString("vi-VN")}
          />
        </Modal>
      </tbody>
    </Table>
  );
};

export default OrderTable;
