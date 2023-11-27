import { Container, Flex, Space, Text, Title } from "@mantine/core";
import { OrderItem } from "./type";
import OrderDetailTable from "./OrderDetailTable";

const OrderDetailModal: React.FC<{
  onClose: () => void;
  detailOrder: OrderItem | undefined;
  status: string
}> = ({ onClose, detailOrder, status }) => {
  return (
    <Flex direction="column">
      <Flex w="60vw" p="lg">
        <Flex direction="column" w="50%">
          <Text fz="md">Tên khách hàng</Text>
          <Text>{detailOrder?.customer}</Text>
        </Flex>
        <Flex direction="column">
          <Text fz="md">Địa chỉ nhận hàng</Text>
          <Text>Tên người nhân</Text>
          <Text>Sđt</Text>
          <Text>Địa chỉ</Text>
        </Flex>
      </Flex>
      <OrderDetailTable startIndex={0}/>
      <Flex w="60vw" p="lg">
        <Flex direction="column" w="50%">
          <Text>Thời gian đặt hàng :{detailOrder?.orderTime.toString()}</Text>
          {status=="CONFIRMED" && <Text>Thời gian xác nhận đơn hàng:{detailOrder?.confirmTime.toString()}</Text>}
          {status=="SHIPPING" && <Text>Thời gian giao hàng :{detailOrder?.shipTime.toString()}</Text>}
          {status=="DELIVERED" && <Text>Thời gian nhận hàng :{detailOrder?.shipTime.toString()}</Text>}
          {status=="CANCELLED" && <Text>Thời gian hủy :{detailOrder?.cancelTime.toString()}</Text>}
        </Flex>
        <Flex w='50%'>
          <Text fz="md">Tổng tièn hàng</Text>
          <Text ml='auto'p={3}>{1000}</Text>
        </Flex> 
      </Flex>
    </Flex>
  );
};

export default OrderDetailModal;
