const convertUtcToLocalDate = (date: Date) => {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
export default convertUtcToLocalDate;
