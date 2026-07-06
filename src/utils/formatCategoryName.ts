
export const formatCategoryName = (name: string) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/^./, (char) => char.toUpperCase());
};