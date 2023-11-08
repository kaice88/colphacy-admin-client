import type { ReactElement } from 'react';
import { IconListDetails, IconMapPins } from '@tabler/icons-react';

export interface Option {
  icon: ReactElement;
  url: string;
  label: string;
  links: { icon: ReactElement; url: string; label: string }[];
}

export const options: Option[] = [
  {
    icon: <IconListDetails size="1rem"></IconListDetails>,
    url: 'store-management',
    label: 'Quản lý kho',
    links: [],
  },
  {
    icon: <IconMapPins size="1rem"></IconMapPins>,
    url: 'branch-management',
    label: 'Quản lý chi nhánh',
    links: [],
  },
  {
    icon: <IconMapPins size="1rem"></IconMapPins>,
    url: '',
    label: 'Quản lý sản phẩm',
    links: [
      {
        icon: <IconMapPins size="1rem"></IconMapPins>,
        url: 'unit-management',
        label: 'Đơn vị',
      },
      {
        icon: <IconMapPins size="1rem"></IconMapPins>,
        url: 'product-management',
        label: 'Sản phẩm',
      },
    ],
  },
];
