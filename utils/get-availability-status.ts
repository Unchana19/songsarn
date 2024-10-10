export const getAvailabilityStatus = (
  quantity: number,
  threshold: number
): { label: string; color: "danger" | "warning" | "success" } => {
  if (quantity === 0) return { label: "Out of stock", color: "danger" };
  if (quantity <= threshold) return { label: "Low stock", color: "warning" };
  return { label: "In-stock", color: "success" };
};
