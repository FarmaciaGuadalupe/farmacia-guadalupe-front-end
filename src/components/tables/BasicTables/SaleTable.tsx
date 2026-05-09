// src/components/features/employee/EmployeeTable.tsx
import { ServerDataTable } from "../../ui/table/ServerDataTable";
import { GET_ALL_SALES } from "../../ui/table/QuerysDefinitions";
import { useSaleColumns } from "../../ui/table/ColumnsDefinitions";


export default function SaleTable() {

  const query = GET_ALL_SALES();
  const columns = useSaleColumns();

  return (
      <ServerDataTable
        columns={columns}
        query={query}
        queryKeyName="sales"
      />
  );
}
