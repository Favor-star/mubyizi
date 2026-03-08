import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@workspace/ui/components/checkbox";

type AttendanceData = {
  id: string;
  name: string;
  wage: string;
};
const attendanceColumns: ColumnDef<AttendanceData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    )
  },
  {
    accessorKey: "name"
  }
];
