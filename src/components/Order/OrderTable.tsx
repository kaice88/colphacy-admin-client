import { FC } from 'react';
import { Button, Center, Flex, Table } from '@mantine/core';
import {
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from '@tabler/icons-react';

interface OrderTableProps {
  startIndex: number;
  sortBy:
    | 'order_time'
    | 'confirm_time'
    | 'ship_time'
    | 'deliver_time'
    | 'cancel_time'
    | 'total';
  order: 'asc' | 'desc';
  time: string;
}

const OrderTable: FC<OrderTableProps> = ({
  startIndex,
  sortBy,
  order,
  time,
}) => {
  const rows = [1].map((element, index) => (
    <tr key={index}>
      <td>{startIndex + index + 1}</td>
      <td>{index}</td>
      <td>{index}</td>
      <td>{index}</td>
      <td style={{ width: '10px' }}>
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
                    0.1,
                  ),
                }),
              },
            })}
          >
            Xác nhận
          </Button>
          <Button m={5} color="red" size="xs">
            Hủy đơn
          </Button>
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
                {sortBy !== 'order_time' ? (
                  <IconSelector
                    size="1rem"
                    // onClick={() => handleSortData('importPrice')}
                  />
                ) : order === 'asc' ? (
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
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default OrderTable;
