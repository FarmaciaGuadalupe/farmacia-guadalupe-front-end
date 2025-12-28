// src/components/features/employee/EmployeeTable.tsx
import { useMemo } from "react";
import { useIntl } from "react-intl";
import { ColumnDef } from "@tanstack/react-table";
import { ServerDataTable } from "../../ui/table/ServerDataTable";
import Badge from "../../ui/badge/Badge";
import { Avatar } from "@mui/material";
import { stringAvatar } from "../../../utils/AvatarUtils";

// 1. Agregamos $order a la query y al input de employees
const GET_EMPLOYEES_QUERY = `
  query GetEmployees($first: Int, $after: String, $order: [EmployeeSortInput!]) {
    employees(first: $first, after: $after, order: $order) {
      nodes {
        employeeId
        names
        lastnames
        user
        email
        roleName: employeeRole { name } 
        statusName: employeeStatus { name }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export default function EmployeeTable() {
  const intl = useIntl();

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      header: intl.formatMessage({ id: 'names' }),
      accessorFn: (row) => `${row.names} ${row.lastnames}`,
      
      // IMPORTANTE: El 'id' debe ser el nombre real del campo en BD para ordenar
      // Si quieres ordenar por "names", pon id: "names".
      id: "names", 
      
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
           <Avatar {...stringAvatar({ name: row.original.names, size: 30 })} />
           <span>{row.original.names} {row.original.lastnames}</span>
        </div>
      ),
    },
    {
      header: intl.formatMessage({ id: 'email' }),
      accessorKey: "email",
      id: "email", // Habilita sort por email
    },
    {
      header: intl.formatMessage({ id: 'user' }),
      accessorKey: "user",
      id: "user", // Habilita sort por usuario
    },
    {
      header: intl.formatMessage({ id: 'role' }),
      accessorKey: "roleName.name",
      enableSorting: true, // Deshabilitamos sort aquí si es complejo (relación foránea)
    },
    {
      header: intl.formatMessage({ id: 'statuses' }),
      accessorKey: "statusName.name",
      enableSorting: false, 
      cell: ({ getValue }) => <Badge>{getValue() as string}</Badge>,
    },
  ], [intl]);

  return (
    <div>      
      <ServerDataTable
        columns={columns}
        query={GET_EMPLOYEES_QUERY}
        queryKeyName="employees"
      />
    </div>
  );
}