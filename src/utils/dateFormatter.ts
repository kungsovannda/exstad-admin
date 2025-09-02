export const dateFormatter = (date?: string | Date) => {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleString(navigator.language, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
