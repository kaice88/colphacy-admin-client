export const transformSelectData = (
  data: { id: number; name: string }[],
  isBranch: boolean = false,
) => {
  return isBranch
    ? data.map((item) => ({ value: item.id.toString(), label: item.address }))
    : data.map((item) => ({ value: item.id.toString(), label: item.name }));
};
