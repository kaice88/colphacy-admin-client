import { Button, Flex, Modal, Title, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import ProductForm from '../components/Product/ProductForm';

export default function Product() {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

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
    </div>
  );
}
