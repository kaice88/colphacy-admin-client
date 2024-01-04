import type { ReactElement } from 'react';
import {
  IconBrandAppgallery,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconLayoutDashboard,
  IconPackages,
  IconStar,
  IconTruckDelivery,
} from '@tabler/icons-react';

export interface Option {
  icon: ReactElement;
  url: string;
  label: string;
  links: { url: string; label: string }[];
}

export const options: Option[] = [
  {
    icon: <IconLayoutDashboard size="1rem"></IconLayoutDashboard>,
    url: 'dashboard',
    label: 'Thống kê',
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
        url: 'product-management',
        label: 'Sản phẩm',
      },
      {
        url: 'unit-management',
        label: 'Đơn vị',
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
    icon: <IconPackages size="1rem"></IconPackages>,
    url: 'import-management',
    label: 'Quản lý nhập hàng',
    links: [],
  },
  {
    icon: <IconTruckDelivery size="1rem"></IconTruckDelivery>,
    url: 'order-management?tab=pending',
    label: 'Quản lý đơn hàng',
    links: [],
  },
  {
    icon: <IconBuildingWarehouse size="1rem"></IconBuildingWarehouse>,
    url: 'stock-management',
    label: 'Quản lý tồn kho',
    links: [],
  },
  {
    icon: <IconStar size="1rem"></IconStar>,
    url: 'review-management',
    label: 'Quản lý đánh giá',
    links: [],
  },
 
];
