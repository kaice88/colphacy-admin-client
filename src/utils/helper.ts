export const transformSelectData = (data: { id: number; name: string }[]) => {
  return data.map((item) => ({ value: item.id.toString(), label: item.name }));
};
