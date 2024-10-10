const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "in process":
      return "warning";
    case "completed":
      return "success";
    case "waiting":
      return "primary";
    case "received":
      return "success";
    default:
      return "default";
  }
};
