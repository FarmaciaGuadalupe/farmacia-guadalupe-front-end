// src/components/features/employee/EmployeeTable.tsx
import { ServerDataTable } from "../../ui/table/ServerDataTable";
import { useBrandColumns } from "../../ui/table/ColumnsDefinitions";
import { GET_BRANDS_QUERY } from "../../ui/table/QuerysDefinitions";

// 1. Agregamos $order a la;

export default function BrandsTable() {
  const query = GET_BRANDS_QUERY();
  const columns = useBrandColumns();

  return (
    <div>      
      <ServerDataTable
        columns={columns}
        query={query}
        queryKeyName="brands"
      />
    </div>
  );
}