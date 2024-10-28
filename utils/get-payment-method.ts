export const getPaymentMethod = (method: string) => {
  switch (method) {
    case "qr":
      return "Promptpay QR code";
    case "mobile":
      return "Mobile banking";
    case "cash":
      return "Cash";
    default:
      return "Unknown";
  }
};
