export interface MPOGetAll {
  id: string;
  supplier: string;
  status: string;
  create_date_time: Date;
  receive_date_time?: Date;
  total_amount?: number;
}