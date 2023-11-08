import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";

export const deleteModal = (
  title: string,
  name: string|undefined,
  onConfirm: () => void
) => {
  modals.openConfirmModal({
    title: "Xóa " + title,
    centered: true,
    children: <Text size="sm">Bạn có chắc chắn muốn xóa <b>{name}?</b></Text>,
    labels: { confirm: "Xóa", cancel: "Hủy" },
    confirmProps: { color: "red" },
    onConfirm: onConfirm,
  });
};

