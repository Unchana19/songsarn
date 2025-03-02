import type { OrderLine } from "@/interfaces/order-line.interface";

export const calDeposit = (orderLines: OrderLine[]) => {
  return Math.ceil(
    orderLines.reduce(
      (total, orderLine) => total + orderLine.price * orderLine.quantity,
      0
    ) * 0.2
  );
};
