import { FC } from "react";
import { Table } from "@mantine/core";

interface OrderTableProps {
  startIndex: number;
}

const OrderDetailTable: FC<OrderTableProps> = ({ startIndex }) => {
  const rows = [1].map((element, index) => (
    <tr key={index}>
      <td>{startIndex + index + 1}</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
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
