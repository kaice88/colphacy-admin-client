import {
  Button,
  Flex,
  Modal,
  Pagination,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import ProductForm from '../components/Product/ProductForm';
import ProductTable from '../components/Product/ProductTable';
import useProduct from '../hooks/useProduct';
import { useRef, useState } from 'react';
import { notificationShow } from '../components/Notification';

const LIMIT = 10;

export default function Product() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productId, setProductId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [keyword, setKeyWord] = useState<string>('');
  const [sortBy, setSortBy] = useState<'salePrice' | 'importPrice' | null>(
    null,
  );
  const [order, setOrder] = useState<'desc' | 'asc' | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [mode, setMode] = useState<'ADD' | 'EDIT' | 'VIEW'>('EDIT');
  const theme = useMantineTheme();
  const { productData, loading, onSubmitDeleteProductForm, fetchProduct } =
    useProduct((currentPage - 1) * LIMIT, keyword, sortBy, order);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setKeyWord(keyword);
    setCurrentPage(1);
  };

  const handleEdit = (Id: number) => {
    setMode('EDIT');
    setProductId(Id);
    open();
  };

  const handleDelete = (Id: number) => {
    onSubmitDeleteProductForm(Id, () => {
      notificationShow('success', 'Success!', 'Xóa sản phẩm thành công!');
      fetchProduct.refetch();
    });
  };

  const handleView = (Id: number) => {
    setMode('VIEW');
    setProductId(Id);
    open();
  };
  const handleSortData = (sortBy: 'salePrice' | 'importPrice' | null) => {
    if (order !== 'asc') {
      setSortBy(sortBy);
    } else {
      setSortBy(null);
    }
    setOrder((prev) =>
      prev === 'desc' ? 'asc' : prev === 'asc' ? null : 'desc',
    );
  };
  const handleCloseModal = () => {
    close();
    fetchProduct.refetch();
  };

  return (
    <div className="branch-ctn">
      <Title size="h5" color={theme.colors.cobaltBlue[0]}>
        Danh sách sản phẩm
      </Title>
      <Flex justify="space-between" align="center" py="lg">
        <div className="search">
          <input
            ref={inputRef}
            value={keyword}
            placeholder="Tìm kiếm theo tên sản phẩm"
            spellCheck={false}
            onChange={handleChange}
          />
          <button
            className="search-btn"
            onMouseDown={(e) => e.preventDefault()}
          >
            <IconSearch size="1.3rem"></IconSearch>
          </button>
        </div>
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
            setProductId(null);
            setMode('ADD');
            open();
          }}
        >
          Thêm sản phẩm
        </Button>
      </Flex>
      <Modal
        size="70%"
        opened={opened}
        onClose={close}
        centered
        m="20"
        title={
          mode === 'ADD'
            ? 'Thêm sản phẩm'
            : mode === 'EDIT'
              ? 'Sửa sản phẩm'
              : 'Xem sản phẩm'
        }
        styles={() => ({
          title: {
            fontWeight: 'bold',
          },
        })}
      >
        <ProductForm
          onClose={handleCloseModal}
          mode={mode}
          productId={productId}
        />
      </Modal>
      <div className="branch-table">
        <ProductTable
          data={productData?.items}
          startIndex={productData?.offset}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleView={handleView}
          handleSortData={handleSortData}
          sortBy={sortBy}
          order={order}
        />
      </div>
      {!loading && productData && (
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
