const sortDate = <T extends Record<string, any>>(
  list: T[],
  key: keyof T,
  order: "asc" | "desc"
) => {
  return [...list].sort((a, b) => {
    const aVal = new Date(a[key]).getTime();
    const bVal = new Date(b[key]).getTime();

    if (isNaN(aVal) && isNaN(bVal)) return 0;
    if (isNaN(aVal)) return 1;
    if (isNaN(bVal)) return -1;

    return order === "asc" ? aVal - bVal : bVal - aVal;
  });
};

export default sortDate;
