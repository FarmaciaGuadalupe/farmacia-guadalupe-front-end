// src/components/features/employee/EmployeeTable.tsx
import { ServerDataTable } from "../../ui/table/ServerDataTable";
import { GET_MEDICINE_QUERY } from "../../ui/table/QuerysDefinitions";
import { useMedicineColumns } from "../../ui/table/ColumnsDefinitions";


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
