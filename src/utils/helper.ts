export const transformSelectData = (
  data: { id: number; name: string }[],
  isBranch: boolean = false
) => {
  return isBranch
    ? data.map((item) => ({ value: item.id.toString(), label: item.address }))
    : data.map((item) => ({ value: item.id.toString(), label: item.name }));
};

export const transformSelectCustomerData = (
  data: { fullName: string; phone: string; id: number }[]
) => {
  return data.map((item) => ({
    value: item.id.toString(),
    label: item.fullName,
  }));
};

export const transformSelectUnitData = (
  data: { unitName: string; salePrice: number; unitId: number }[]
) => {
  return data.map((item) => ({
    value: item.unitId.toString(),
    label: item.unitName,
  }));
};
export function convertDateTime(dateTimeStr: string) {
  const date = new Date(dateTimeStr);
  const formattedDate = `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")} ${date
    .getDate()
    .toString()
    .padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;

  return formattedDate;
}