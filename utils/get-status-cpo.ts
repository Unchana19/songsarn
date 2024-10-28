export const getStatusCpo = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
      return "Waiting for payment";
    case "paid":
      return "Paid";
    case "processing":
      return "In process";
    case "finished process":
      return "Ready to delivery";
    case "on delivery":
      return "On delivery";
    case "completed":
      return "Completed";
    default:
      return "unknown";
  }
};
