import type { ReactElement } from "react";
import { IconListDetails, IconMapPins } from "@tabler/icons-react";

interface Option {
  icon: ReactElement;
  url: string;
  label: string;
}

export const options: Option[] = [
  {
    icon: <IconListDetails size="1rem"></IconListDetails>,
    url: "store-management",
    label: "Quản lý kho",
  },
  {
    icon: <IconMapPins size="1rem"></IconMapPins>,
    url: "branch-management",
    label: "Quản lý chi nhánh",
  },
];
