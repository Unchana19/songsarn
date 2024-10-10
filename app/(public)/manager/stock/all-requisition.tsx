import { Requisition } from "@/interfaces/requisition.interface";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";

interface Props {
  requisitions: Requisition[];
}

export default function AllRequisition({ requisitions }: Props) {
  return (
    <Table
      selectionMode="multiple"
      aria-label="Requisition management table"
      className="w-full"
    >
      <TableHeader>
        <TableColumn>Material</TableColumn>
        <TableColumn>Requested quantity</TableColumn>
        <TableColumn>Requisition date and time</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No requisitions to display."}>
        {requisitions.map((requisition) => (
          <TableRow key={requisition.id}>
            <TableCell>{requisition.material}</TableCell>
            <TableCell>{`${requisition.quantity} ${requisition.unit}`}</TableCell>
            <TableCell>{requisition.createDate.toISOString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
