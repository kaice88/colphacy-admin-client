import type { ReactElement } from 'react';
import { IconBrandAppgallery, IconBuildingStore, IconListDetails, IconMapPins } from '@tabler/icons-react';

export interface Option {
  icon: ReactElement;
  url: string;
  label: string;
  links: { url: string; label: string }[];
}

export const options: Option[] = [
  {
    icon: <IconListDetails size="1rem"></IconListDetails>,
    url: 'store-management',
    label: 'Quản lý kho',
    links: [],
  },
  {
    icon: <IconBuildingStore size="1rem"></IconBuildingStore>,
    url: 'branch-management',
    label: 'Quản lý chi nhánh',
    links: [],
  },
  {
    icon: <IconBrandAppgallery size="1rem"></IconBrandAppgallery>,
    url: '',
    label: 'Quản lý sản phẩm',
    links: [
      {
        url: 'unit-management',
        label: 'Đơn vị',
      },
      {
        url: 'product-management',
        label: 'Sản phẩm',
      },
    ],
  },
];
