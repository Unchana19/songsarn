export const getStatusMpo = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
      return "Waiting";
    case "received":
      return "Received";
    default:
      return "unknown";
  }
};
