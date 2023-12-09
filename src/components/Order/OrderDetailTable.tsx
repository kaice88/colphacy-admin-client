import { FC } from "react";
import { Table } from "@mantine/core";
import { ProductOrderItem } from "./type";

interface OrderTableProps {
  startIndex: number;
  products: ProductOrderItem[]
}
const OrderDetailTable: FC<OrderTableProps> = ({ startIndex, products }) => {
  const rows = products.map((element, index) => (
    <tr key={index}>
      <td>{startIndex + index + 1}</td>
      <td width={"40%"}>{element.product.name}</td>
      <td>{element.unit.name}</td>
      <td>{element.quantity}</td>
      <td>{element.price.toLocaleString('vi-VN') + ' đ'}</td>
      <td>{(element.quantity * element.price).toLocaleString('vi-VN') + ' đ'}</td>
    </tr>
  ));

  return (
    <Table horizontalSpacing="xl" striped highlightOnHover withBorder>
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên sản phẩm</th>
          <th>ĐVT</th>
          <th>Số lượng</th>
          <th>Giá bán</th>
          <th>Tổng tiền</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default OrderDetailTable;
