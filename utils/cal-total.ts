import type { OrderLine } from "@/interfaces/order-line.interface";

export const calTotal = (orderLines?: OrderLine[]) => {
  return orderLines?.reduce(
    (total, orderLine) => total + orderLine.price * orderLine.quantity,
    0
  );
};
