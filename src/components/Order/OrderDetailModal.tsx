import { Flex, Text } from "@mantine/core";
import OrderDetailTable from "./OrderDetailTable";
import { useDetailOrder } from "../../hooks/useOrder";
import { useEffect, useState } from "react";
import { handleGlobalException } from "../../utils/error";
import { DetailOrderItem } from "./type";

const OrderDetailModal: React.FC<{
  senderName: string | undefined;
  status: string,
  idDetailOrder: number | undefined
  total: number
}> = ({ senderName, status, idDetailOrder, total }) => {
  const formattedDate = (date) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  const [detailOrder, setDetailOrder] = useState<DetailOrderItem>()
  const [totalPrice, setTotalPrice] = useState(0)
  const { fetchDetailOrder } = useDetailOrder(idDetailOrder)
  useEffect(() => {
    if (idDetailOrder) {
      async function fetchDetailBranch() {
        const data = await fetchDetailOrder.refetch();
        if (data.isSuccess) {
          setDetailOrder(data.data.data);
          if(detailOrder){
            let total = 0
            detailOrder.orderItems.map(order => {total = total + order.price*order.quantity})
            setTotalPrice(total)
          }
        } else if (data.isError) {
          const error = data.error;
          handleGlobalException(error, () => { });
        }
      }
      fetchDetailBranch();
    }

  }, []);
  // console.log(detailOrder?.orderTime);
  return (
    detailOrder && (<Flex direction="column">
      <Flex w="60vw" p="lg">
        <Flex direction="column" w="50%">
          <Text fz="md">Tên khách hàng</Text>
          <Text>{senderName}</Text>
        </Flex>
        <Flex direction="column">
          <Text fz="md">Địa chỉ nhận hàng</Text>
          <Text>Tên người nhận: {detailOrder?.receiver.name}</Text>
          <Text>Sđt: {detailOrder?.receiver.phone}</Text>
          <Text>Địa chỉ: {detailOrder?.receiver.address.streetAddress + ", " + detailOrder?.receiver.address.ward + ", " + detailOrder?.receiver.address.district + ", " + detailOrder.receiver.address.province}</Text>
        </Flex>
      </Flex>
      <OrderDetailTable startIndex={0} products={detailOrder.orderItems} />
      <Flex w="60vw" p="lg">
        <Flex direction="column" w="50%">
          <Text>Thời gian đặt hàng :{formattedDate(new Date(detailOrder?.orderTime))}</Text>
          {status == "CONFIRMED" && <Text>Thời gian xác nhận đơn hàng:{formattedDate(new Date(detailOrder?.confirmTime))}</Text>}
          {status == "SHIPPING" && <Text>Thời gian giao hàng :{formattedDate(new Date(detailOrder?.shipTime))}</Text>}
          {status == "DELIVERED" && <Text>Thời gian nhận hàng :{formattedDate(new Date(detailOrder?.deliverTime))}</Text>}
          {status == "CANCELLED" && <Text>Thời gian hủy :{formattedDate(new Date(detailOrder?.cancelTime))}</Text>}
        </Flex>
        <Flex w='50%'>
          <Text fz="md">Tổng tiền hàng</Text>
          <Text ml='auto' p={3}>{total}</Text>
        </Flex>
      </Flex>
    </Flex>)
  );
};

export default OrderDetailModal;
