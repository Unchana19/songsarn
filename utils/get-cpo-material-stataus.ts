export const getCPOMaterialStatus = (
  status: string
): { label: string; color: "success" | "warning" | "danger" } => {
  switch (status) {
    case "sufficient_materials":
      return { label: "Sufficient", color: "success" };
    case "insufficient_materials":
      return { label: "Insufficient", color: "warning" };
    default:
      return { label: "Unknown", color: "danger" };
  }
};
