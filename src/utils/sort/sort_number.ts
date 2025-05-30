const sortNumber = <T extends Record<string, any>>(
  list: T[],
  key: keyof T,
  order: "asc" | "desc"
) => {
  return [...list].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    return order === "asc" ? aVal - bVal : bVal - aVal;
  });
};

export default sortNumber;
