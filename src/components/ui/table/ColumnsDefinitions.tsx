import { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar } from "@mui/material";
import Badge from "../../ui/badge/Badge";
import { stringAvatar } from "../../../utils/AvatarUtils";
import { EmployeeCellActions } from "../table/CustomCells/EmployeeCellActions";
import { BrandCellActions } from "./CustomCells/BrandCellActions";
import Status from "./CustomCells/Status";

export const useEmployeeColumns = () => {
  const intl = useIntl();

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        // Usamos intl.formatMessage para obtener un string puro,
        // lo cual evita errores de tipo en 'header'
        header: intl.formatMessage({ id: "names" }, { count: 2 }),
        accessorFn: (row) => `${row.names} ${row.lastnames}`,
        id: "names",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar {...stringAvatar({ name: row.original.names, size: 30 })} />
            <span>
              {row.original.names} {row.original.lastnames}
            </span>
          </div>
        ),
      },
      {
        header: intl.formatMessage({ id: "email" }),
        accessorKey: "email",
        id: "email",
      },
      {
        header: intl.formatMessage({ id: "user" }),
        accessorKey: "user",
        id: "user",
      },
      {
        header: intl.formatMessage({ id: "role" }),
        accessorKey: "roleName.name",
        enableSorting: true,
      },
      {
        header: intl.formatMessage({ id: "statuses" }),
        accessorKey: "statusName.name",
        enableSorting: false,
        cell: ({ getValue }) => <Badge>{getValue() as string}</Badge>,
      },
      {
        header: intl.formatMessage({ id: "actions" }),
        id: "actions",
        cell: ({ row }) => <EmployeeCellActions row={row.original} />,
      },
    ],
    [intl],
  ); // intl es la dependencia

  return columns;
};

export const useBrandColumns = () => {
  const intl = useIntl();
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: intl.formatMessage({ id: "name" }),
        accessorKey: "name",
        id: "name",
      },
      {
        header: intl.formatMessage({ id: "logo" }),
        accessorKey: "logo_url",
        id: "logo_url",
        cell: ({ getValue }) => (
          <img
            src={getValue() as string}
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
        ),
      },
      {
        header: intl.formatMessage({ id: "contact_phone" }),
        accessorKey: "contact_phone",
        id: "contact_phone",
      },
      {
        header: intl.formatMessage({ id: "contact_email" }),
        accessorKey: "contact_email",
        id: "contact_email",
      },
      {
        header: intl.formatMessage({ id: "name" }),
        accessorKey: "is_active",
        cell: ({ getValue }) => (
          <Badge color={getValue() ? "success" : "error"}>
            {getValue() ? (
              <FormattedMessage
                id="active"
                values={{
                  gender: "female",
                }}
              />
            ) : (
              <FormattedMessage
                id="inactive"
                values={{
                  gender: "female",
                }}
              />
            )}
          </Badge>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => <BrandCellActions row={row} />,
      },
    ],
    [intl],
  ); // intl es la dependencia

  return columns;
};

export const useCategoryColumns = () => {
  const intl = useIntl();
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: intl.formatMessage({ id: "name" }),
        accessorKey: "name",
        id: "name",
      },
      {
        header: intl.formatMessage({ id: "description" }),
        accessorKey: "description",
        id: "description",
      },
      {
        header: intl.formatMessage({ id: "status" }),
        accessorKey: "is_active",
        cell: ({ getValue }) => <Status status={getValue() ? true : false} />,
      },
      {
        id: "actions",
        cell: ({ row }) => <BrandCellActions row={row} />,
      },
    ],
    [intl],
  );

  return columns;
};

export const useActiveIngredientsColumns = () => {
  const intl = useIntl();
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: intl.formatMessage({ id: "name" }),
        accessorKey: "name",
        id: "name",
      },
      {
        header: intl.formatMessage({ id: "description" }),
        accessorKey: "description",
        id: "description",
      },
      {
        header: intl.formatMessage({ id: "status" }),
        accessorKey: "is_active",
        cell: ({ getValue }) => <Status status={getValue() ? true : false} />,
      },
      {
        id: "actions",
        cell: ({ row }) => <BrandCellActions row={row} />,
      },
    ],
    [intl],
  );

  return columns;
};

export const useAdministrationRoutesColumns = () => {
  const intl = useIntl();
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: intl.formatMessage({ id: "name" }),
        accessorKey: "name",
        id: "name",
      },
      {
        header: intl.formatMessage({ id: "description" }),
        accessorKey: "description",
        id: "description",
      },
      {
        header: intl.formatMessage({ id: "status" }),
        accessorKey: "is_active",
        cell: ({ getValue }) => <Status status={getValue() ? true : false} />,
      },
      {
        id: "actions",
        cell: ({ row }) => <BrandCellActions row={row} />,
      },
    ],
    [intl],
  );

  return columns;
};

export const useSupplierTypesColumns = () => {
  const intl = useIntl();
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: intl.formatMessage({ id: "name" }),
        accessorKey: "type_name",
        id: "type_name",
      },
      {
        header: intl.formatMessage({ id: "description" }),
        accessorKey: "description",
        id: "description",
      },
      {
        id: "actions",
        cell: ({ row }) => <BrandCellActions row={row} />,
      },
    ],
    [intl],
  );

  return columns;
};

export const useSupplierColumns = () => {
  const intl = useIntl();
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: intl.formatMessage({ id: "name" }),
        accessorKey: "company_name",
        id: "company_name",
      },
      {
        header: intl.formatMessage({ id: "RUC" }),
        accessorKey: "tax_id",
        id: "tax_id",
      },
      {
        header: intl.formatMessage({ id: "contact_name" }),
        accessorKey: "contact_name",
        id: "contact_name",
      },
      {
        header: intl.formatMessage({ id: "phone" }),
        accessorKey: "phone",
        id: "phone",
      },
      {
        header: intl.formatMessage({ id: "address" }),
        accessorKey: "address",
        id: "address",
      },
      {
        header: intl.formatMessage({ id: "email" }),
        accessorKey: "email",
        id: "email",
      },
      {
        header: intl.formatMessage({ id: "website" }),
        accessorKey: "website",
        id: "website",
      },
      {
        header: intl.formatMessage({ id: "website" }),
        accessorKey: "type.type_name",
        id: "type.type_name",
      },
      {
        header: intl.formatMessage({ id: "status" }),
        accessorKey: "is_active",
        cell: ({ getValue }) => <Status status={getValue() ? true : false} />,
      },
      {
        id: "actions",
        cell: ({ row }) => <BrandCellActions row={row} />,
      },
    ],
    [intl],
  );

  return columns;
};
