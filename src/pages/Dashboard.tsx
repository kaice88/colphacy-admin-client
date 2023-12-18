import {
  ActionIcon,
  Flex,
  Grid,
  Paper,
  Title,
  Text,
  Badge,
  Image,
  Select,
  useMantineTheme,
  Center,
} from '@mantine/core';
import LineChart from '../components/Dashboard/LineChart';
import PieChart from '../components/Dashboard/PieChart';
import {
  IconBuildingStore,
  IconCalendar,
  IconTrendingDown,
  IconTrendingUp,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import useStatistics from '../hooks/useStatistics';
import { transformSelectData } from '../utils/helper';
import emptyBox from '../assets/images/emptyBox.svg';

export default function Dashboard() {
  const [searchBranch, setSearchBranch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString(),
  );
  const theme = useMantineTheme();

  const [branchDebounced] = useDebouncedValue(searchBranch, 100);
  const { statisticsData, yearData, branchData, statisticsProductData } =
    useStatistics(
      branchDebounced,
      Number(selectedBranch),
      Number(selectedMonth),
      Number(selectedYear),
    );
  console.log(statisticsProductData);

  return (
    statisticsData !== undefined &&
    yearData !== undefined &&
    branchData !== undefined &&
    statisticsProductData !== undefined && (
      <>
        <Title size="h5" color={theme.colors.cobaltBlue[0]}>
          Thống kê
        </Title>
        <Flex gap="md" my="lg">
          <Select
            radius="md"
            data={transformSelectData(branchData || [], true)}
            searchable
            onSearchChange={(value) => {
              setSearchBranch(value);
            }}
            onChange={(value) => setSelectedBranch(value)}
            w="100%"
            clearable
            placeholder="Chọn chi nhánh"
            icon={
              <ActionIcon color="indigo" variant="light">
                <IconBuildingStore size="1.125rem" />
              </ActionIcon>
            }
          />
          <Select
            radius="md"
            data={yearData?.data?.map((item) => item.toString())}
            w="100%"
            value={selectedYear}
            placeholder="Chọn năm"
            icon={
              <ActionIcon color="indigo" variant="light">
                <IconCalendar size="1.125rem" />
              </ActionIcon>
            }
            onChange={(value) => setSelectedYear(value)}
          />
          <Select
            radius="md"
            data={
              selectedYear
                ? [
                    { value: '1', label: 'Tháng 1' },
                    { value: '2', label: 'Tháng 2' },
                    { value: '3', label: 'Tháng 3' },
                    { value: '4', label: 'Tháng 4' },
                    { value: '5', label: 'Tháng 5' },
                    { value: '6', label: 'Tháng 6' },
                    { value: '7', label: 'Tháng 7' },
                    { value: '8', label: 'Tháng 8' },
                    { value: '9', label: 'Tháng 9' },
                    { value: '10', label: 'Tháng 10' },
                    { value: '11', label: 'Tháng 11' },
                    { value: '12', label: 'Tháng 12' },
                  ]
                : []
            }
            w="100%"
            placeholder="Chọn tháng"
            defaultValue={selectedMonth}
            clearable
            icon={
              <ActionIcon color="indigo" variant="light">
                <IconCalendar size="1.125rem" />
              </ActionIcon>
            }
            onChange={(value) => setSelectedMonth(value)}
          />
        </Flex>

        <Flex direction={'column'}>
          <Flex w="100%" justify="space-between" gap="lg">
            <Paper
              radius="md"
              p="md"
              w="100%"
              style={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}
            >
              <Text color="dimmed">Đơn hàng</Text>
              <Flex align="center" gap="xs">
                <Title order={3}>
                  {statisticsData.data.orders.totalNumOrders}
                </Title>
                {statisticsData.data.orders.orderChangePercent < 0 ? (
                  <IconTrendingDown size="1rem" color="red" />
                ) : (
                  <IconTrendingUp size="1rem" color="blue" />
                )}
                <Badge
                  radius="sm"
                  size="xs"
                  color={
                    statisticsData.data.orders.orderChangePercent < 0
                      ? 'red'
                      : 'blue'
                  }
                >
                  {statisticsData.data.orders.orderChangePercent} đơn hàng
                </Badge>
              </Flex>
            </Paper>
            <Paper
              radius="md"
              p="md"
              w="100%"
              style={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}
            >
              <Text color="dimmed">Sản phẩm đã bán</Text>
              <Flex align="center" gap="xs">
                <Title order={3}>
                  {statisticsData.data.orders.soldProducts}
                </Title>
                {statisticsData.data.orders.soldProductChangePercent < 0 ? (
                  <IconTrendingDown size="1rem" color="red" />
                ) : (
                  <IconTrendingUp size="1rem" color="blue" />
                )}
                <Badge
                  radius="sm"
                  size="xs"
                  color={
                    statisticsData.data.orders.soldProductChangePercent < 0
                      ? 'red'
                      : 'blue'
                  }
                >
                  {statisticsData.data.orders.soldProductChangePercent} sản phẩm
                </Badge>
              </Flex>
            </Paper>
            <Paper
              radius="md"
              p="md"
              w="100%"
              style={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}
            >
              <Text color="dimmed">Doanh thu</Text>
              <Flex align="center" gap="xs">
                <Title order={3}>
                  {statisticsData.data.orders.revenue.toLocaleString('vi-VN')} đ
                </Title>
                {statisticsData.data.orders.revenueChangePercent < 0 ? (
                  <IconTrendingDown size="1rem" color="red" />
                ) : (
                  <IconTrendingUp size="1rem" color="blue" />
                )}
                <Badge
                  radius="sm"
                  size="xs"
                  color={
                    statisticsData.data.orders.revenueChangePercent < 0
                      ? 'red'
                      : 'blue'
                  }
                >
                  {statisticsData.data.orders.revenueChangePercent.toLocaleString(
                    'vi-VN',
                  )}{' '}
                  đ
                </Badge>
              </Flex>
            </Paper>
          </Flex>
          <Grid mt="lg">
            <Grid.Col span={8}>
              <Paper
                radius="md"
                p="md"
                style={{
                  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                }}
                h="100%"
              >
                <LineChart lineData={statisticsData.data.pnl.points} />
              </Paper>
            </Grid.Col>
            <Grid.Col span={4}>
              <Paper
                radius="md"
                p="md"
                style={{
                  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                }}
                h="100%"
              >
                <PieChart pieData={statisticsData.data.orders.numOrdersMap} />
              </Paper>
            </Grid.Col>
          </Grid>
          <Grid mt="lg">
            <Grid.Col span={8}>
              <Paper
                radius="md"
                p="md"
                style={{
                  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                }}
                h="100%"
              >
                <Title order={3}>Top sản phẩm bán chạy</Title>
                {statisticsData.data.products.length === 0 && (
                  <Flex
                    w="30%"
                    style={{ margin: '2rem auto 0 auto' }}
                    direction="column"
                    align="center"
                  >
                    <Image src={emptyBox}></Image>
                    <Text>Không có sản phẩm</Text>
                  </Flex>
                )}
                <Flex direction={'column'} gap="xs" mt="lg">
                  {statisticsData.data.products.map((item, index) => (
                    <Grid key={index}>
                      <Grid.Col span={2}>
                        <Image width="80%" fit="contain" src={item.image} />
                      </Grid.Col>
                      <Grid.Col span={8}>
                        <Text>{item.name}</Text>
                      </Grid.Col>
                      <Grid.Col span={2}>
                        <Text>{item.sold}</Text>
                      </Grid.Col>
                    </Grid>
                  ))}
                </Flex>
              </Paper>
            </Grid.Col>
            <Grid.Col span={4}>
              <Flex direction={'column'} h="100%" gap="md">
                <Paper
                  radius="md"
                  p="md"
                  style={{
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                  }}
                  h="50%"
                  bg="indigo.1"
                >
                  <Flex direction={'column'} h="100%" justify="space-around">
                    <Title style={{ fontSize: '8rem' }} color="blue.5">
                      {statisticsProductData?.data.inStock}
                    </Title>
                    <Title order={4} style={{ fontWeight: 'normal' }}>
                      Sản phẩm tồn kho
                    </Title>
                  </Flex>
                </Paper>
                <Paper
                  bg="pink.1"
                  radius="md"
                  p="md"
                  style={{
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                  }}
                  h="50%"
                >
                  <Flex direction={'column'} h="100%" justify="space-around">
                    <Title style={{ fontSize: '8rem' }} color="pink.5">
                      {statisticsProductData?.data.nearDated}
                    </Title>
                    <Title order={4} style={{ fontWeight: 'normal' }}>
                      Lô sản phẩm cận date
                    </Title>
                  </Flex>
                </Paper>
              </Flex>
            </Grid.Col>
          </Grid>
        </Flex>
      </>
    )
  );
}
