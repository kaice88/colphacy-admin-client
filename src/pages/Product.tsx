import {
  Button,
  Flex,
  Modal,
  Pagination,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import ProductForm from '../components/Product/ProductForm';
import ProductTable from '../components/Product/ProductTable';
import useProduct from '../hooks/useProduct';
import { useState } from 'react';

const LIMIT = 10;

export default function Product() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [keyword, setKeyWord] = useState<string>('');
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const { productData, loading } = useProduct(
    (currentPage - 1) * LIMIT,
    keyword,
  );

  return (
    <div>
      <Title size="h5" color={theme.colors.cobaltBlue[0]}>
        Danh sách sản phẩm
      </Title>
      <Flex justify="flex-end">
        <Modal
          size="70%"
          opened={opened}
          onClose={close}
          centered
          m="20"
          title={'Thêm sản phẩm'}
          styles={() => ({
            title: {
              fontWeight: 'bold',
            },
          })}
        >
          <ProductForm onClose={close} />
        </Modal>
        <Button
          leftIcon={<IconPlus size="15px" />}
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
          onClick={() => {
            open();
          }}
        >
          Thêm sản phẩm
        </Button>
      </Flex>
      <ProductTable
        data={productData?.items}
        startIndex={productData?.offset}
      />
      {!loading && (
        <Flex justify="space-between" align="center" py="lg">
          <div>
            {productData?.totalItems === 0 ? (
              <div>Không tìm thấy kết quả nào.</div>
            ) : productData?.totalItems === 1 ? (
              <div>Tìm thấy 1 kết quả.</div>
            ) : (
              <div>
                Hiển thị {productData?.items.length} kết quả từ{' '}
                {productData?.offset + 1} -{' '}
                {productData?.offset + productData?.items.length} trong tổng{' '}
                {productData?.totalItems} kết quả
              </div>
            )}
          </div>
          <Pagination
            value={currentPage}
            total={productData?.numPages}
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
    </div>
  );
}
