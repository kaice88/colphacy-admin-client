import { Flex, Text } from "@mantine/core";
import OrderDetailTable from "./OrderDetailTable";
import { useDetailOrder } from "../../hooks/useOrder";
import { useEffect, useState } from "react";
import { handleGlobalException } from "../../utils/error";
import { DetailOrderItem } from "./type";

function convertPaymentMethod(paymentMethod: string | undefined) {
  if (paymentMethod === "ON_DELIVERY") return "Thanh toán khi nhận hàng";
  if (paymentMethod === "ONLINE") return "Thanh toán điện tử";
  return "";
}

const OrderDetailModal: React.FC<{
  senderName: string | undefined;
  status: string;
  idDetailOrder: number | undefined;
  total: string;
  cancelBy: string;
  resolveType: string;
}> = ({ senderName, status, idDetailOrder, cancelBy, total, resolveType }) => {
  const formattedDate = (date) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  const [detailOrder, setDetailOrder] = useState<DetailOrderItem>();
  const { fetchDetailOrder } = useDetailOrder(idDetailOrder);
  useEffect(() => {
    if (idDetailOrder) {
      async function fetchDetailBranch() {
        const data = await fetchDetailOrder.refetch();
        if (data.isSuccess) {
          setDetailOrder(data.data.data);
        } else if (data.isError) {
          const error = data.error;
          handleGlobalException(error, () => {});
        }
      }
      fetchDetailBranch();
    }
  }, []);

  return (
    detailOrder && (
      <Flex direction="column">
        <Flex w="80vw" p="lg">
          <Flex direction="column" w="30vw">
            <Text py={8} fw={500}>
              Tên khách hàng
            </Text>
            <Text py={2}>{senderName}</Text>
          </Flex>
          <Flex direction="column" w="50%">
            <Text py={8} fw={500}>
              Địa chỉ nhận hàng
            </Text>
            <Text py={2}>Tên người nhận: {detailOrder?.receiver.name}</Text>
            <Text py={2}>Sđt: {detailOrder?.receiver.phone}</Text>
            <Text py={2}>
              Địa chỉ:{" "}
              {detailOrder?.receiver.address.streetAddress +
                ", " +
                detailOrder?.receiver.address.ward +
                ", " +
                detailOrder?.receiver.address.district +
                ", " +
                detailOrder.receiver.address.province}
            </Text>
          </Flex>
        </Flex>
        <OrderDetailTable startIndex={0} products={detailOrder.orderItems} />
        <Flex p="lg">
          <Flex direction="column" w="30vw">
            <Text py={8}>
              <span style={{ fontWeight: "500" }}>Thời gian đặt hàng: </span>
              {formattedDate(new Date(detailOrder?.orderTime))}
            </Text>
            {detailOrder?.confirmTime && (
              <Text py={8}>
                <span style={{ fontWeight: "500" }}>
                  Thời gian xác nhận đơn hàng:{" "}
                </span>
                {formattedDate(new Date(detailOrder?.confirmTime))}
              </Text>
            )}
            {detailOrder?.shipTime && (
              <Text py={8}>
                <span style={{ fontWeight: "500" }}>Thời gian giao hàng: </span>
                {formattedDate(new Date(detailOrder?.shipTime))}
              </Text>
            )}
            {detailOrder?.deliverTime && (
              <Text py={8}>
                <span style={{ fontWeight: "500" }}>Thời gian nhận hàng: </span>
                {formattedDate(new Date(detailOrder?.deliverTime))}
              </Text>
            )}
            {detailOrder?.cancelTime && (
              <Text py={8}>
                <span style={{ fontWeight: "500" }}>Thời gian hủy: </span>
                {formattedDate(new Date(detailOrder?.cancelTime))}
              </Text>
            )}
            {detailOrder?.requestReturnTime && (
              <Text py={8}>
                <span style={{ fontWeight: "500" }}>
                  Thời gian yêu câù hoàn tiền:{" "}
                </span>
                {formattedDate(new Date(detailOrder?.requestReturnTime))}
              </Text>
            )}
          </Flex>
          <Flex direction="column" w="30vw">
            <Text py={8}>
              <span style={{ fontWeight: "500" }}>Tổng tiền hàng: </span>
              <span style={{ fontWeight: "600", color: "#00439C" }}>
                {" "}
                {total} đ
              </span>
            </Text>
            <Text py={8}>
              <span style={{ fontWeight: "500" }}>Hình thức thanh toán: </span>
              <span> {convertPaymentMethod(detailOrder.paymentMethod)}</span>
            </Text>
            {cancelBy && (
              <Text py={8}>
                <span style={{ fontWeight: "500" }}>Lý do hủy đơn hàng: </span>
                <span>{cancelBy}</span>
              </Text>
            )}
            {resolveType && (
              <Text py={8}>
                <span style={{ fontWeight: "500" }}>
                  Trạng thái giải quyết đơn hàng:{" "}
                </span>
                <span>{resolveType}</span>
              </Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    )
  );
};

export default OrderDetailModal;
