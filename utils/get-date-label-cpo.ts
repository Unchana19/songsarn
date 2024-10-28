export const getDateLabelCPO = (status: string) => {
  switch (status) {
    case "PAID":
      return "Payment date";
    case "PROCESSING":
      return "Processing date";
    case "READY_TO_DELIVERY":
      return "Ready date";
    case "SHIPPING":
      return "Shipping date";
    case "DELIVERED":
      return "Delivery date";
    default:
      return "Update date";
  }
};