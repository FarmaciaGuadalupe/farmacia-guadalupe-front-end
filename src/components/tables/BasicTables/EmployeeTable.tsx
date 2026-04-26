// src/components/features/employee/EmployeeTable.tsx
import { ServerDataTable } from "../../ui/table/ServerDataTable";
import { useEmployeeColumns } from "../../ui/table/ColumnsDefinitions";
import { GET_EMPLOYEES_QUERY } from "../../ui/table/QuerysDefinitions";

// 1. Agregamos $order a la;

export default function BrandsTable() {
  const query = GET_EMPLOYEES_QUERY();
  const columns = useEmployeeColumns();

  return (
    <div>      
      <ServerDataTable
        columns={columns}
        query={query}
        queryKeyName="employees"
      />
    </div>
  );
}