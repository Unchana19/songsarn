export const getActionButtonCPO = (status: string) => {
    switch (status) {
      case "PAID":
        return "Process";
      case "PROCESSING":
        return "Finished process";
      case "FINISHED PROCESS":
        return "Delivery";
      case "ON DELIVERY":
        return "Completed";
      default:
        return "Unknown";
    }
  };