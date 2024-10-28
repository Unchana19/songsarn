export const getStatusCpo = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
      return "Waiting for payment";
    case "paid":
      return "Paid";
    default:
      return "unknown";
  }
};
