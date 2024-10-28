export interface History {
  id: string;
  po_id: string;
  status: string;
  date_time: Date;
  type: "CPO" | "MPO";
}
