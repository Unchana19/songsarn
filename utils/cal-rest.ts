import { calDeposit } from "./cal-deposit";

export const calRest = (total: number) => {
  return total - calDeposit(total);
};
