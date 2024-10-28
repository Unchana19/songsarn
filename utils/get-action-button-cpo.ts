export const getActionButtonCPO = (status: string) => {
    switch (status) {
      case "PAID":
        return "Process"
      case "PROCESSING":
        return "Finished"
      case "READY_TO_DELIVERY":
        return "Delivery"
      default:
        return "Unknown";
    }
  };