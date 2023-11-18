import type { ReactElement } from 'react';
import {
  IconBrandAppgallery,
  IconBuildingStore,
  IconHomePlus,
} from '@tabler/icons-react';

export interface Option {
  icon: ReactElement;
  url: string;
  label: string;
  links: { url: string; label: string }[];
}

export const options: Option[] = [
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
      {
        url: 'category-management',
        label: 'Danh mục',
      },
      {
        url: 'provider-management',
        label: 'Nhà cung cấp',
      },
    ],
  },
  {
    icon: <IconHomePlus size="1rem"></IconHomePlus>,
    url: 'import-management',
    label: 'Quản lý nhập hàng',
    links: [],
  },
];
