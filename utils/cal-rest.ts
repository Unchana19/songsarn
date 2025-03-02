import type { OrderLine } from "@/interfaces/order-line.interface";
import { calTotal } from "./cal-total";
import { calDeposit } from "./cal-deposit";

export const calRest = (orderLines: OrderLine[]) => {
  return calTotal(orderLines) - calDeposit(orderLines);
};
