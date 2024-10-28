export interface Transaction {
  id: string;
  po_id: string;
  amount: number;
  create_date_time: Date;
  payment_method: string;
  type: "cpo" | "mpo";
}
