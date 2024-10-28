export const getDateLabelCPO = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
      return "Created at";
    case "paid":
      return "Paid at";
    case "processing":
      return "Process at";
    case "finished process":
      return "Finished process at";
    case "on delivery":
      return "Delivery at";
    case "completed":
      return "Completed at";
    default:
      return "unknown";
  }
};