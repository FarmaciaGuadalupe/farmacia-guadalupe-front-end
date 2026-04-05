// src/components/features/employee/EmployeeTable.tsx
import { ServerDataTable } from "../../ui/table/ServerDataTable";
import { useMedicineColumns, useSupplierTypesColumns } from "../../ui/table/ColumnsDefinitions";
import { GET_MEDICINE_QUERY, GET_SUPPLIER_TYPES_QUERY } from "../../ui/table/QuerysDefinitions";


export default function MedicineTable() {

  const query = GET_MEDICINE_QUERY();
  const columns = useMedicineColumns();

  return (
      <ServerDataTable
        columns={columns}
        query={query}
        queryKeyName="medicines"
      />
  );
}
