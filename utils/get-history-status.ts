interface StatusConfig {
  label: string;
  color: "success" | "primary" | "secondary" | "warning" | "danger";
}

export const getHistoryStatus = (
  status: string
): StatusConfig => {
  switch (status.toLowerCase()) {
    case "completed":
      return {
        label: "Completed",
        color: "success",
      };
    case "paid":
      return {
        label: "Deposit paid",
        color: "primary",
      };
    case "processing":
      return {
        label: "In process",
        color: "primary",
      };
    case "finished process":
      return {
        label: "Ready to delivery",
        color: "primary",
      };
    case "on delivery":
      return {
        label: "On delivery",
        color: "primary",
      };
    case "new":
      return {
        label: "Purchase",
        color: "primary",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        color: "danger",
      };
    case "created":
      return {
        label: "Purchase",
        color: "primary",
      };
    case "received":
      return {
        label: "Received",
        color: "success",
      };
    default:
      return {
        label: status,
        color: "primary",
      };
  }
};
