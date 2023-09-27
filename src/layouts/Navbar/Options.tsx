import type { ReactElement } from 'react'
import { IconListDetails } from '@tabler/icons-react'

interface Option {
  icon: ReactElement
  url: string
  label: string
}

export const options: Option[] = [
  {
    icon: <IconListDetails size="1rem"></IconListDetails>,
    url: 'store-management',
    label: 'Quản lý kho',
  },
]