export const getStatusCpo = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
      return "Waiting for payment";
    case "received":
      return "Received";
    default:
      return "unknown";
  }
};
