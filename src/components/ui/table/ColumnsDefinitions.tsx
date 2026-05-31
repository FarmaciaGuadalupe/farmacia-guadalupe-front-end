import { useMemo } from "react";
import { Avatar } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { FormattedMessage, useIntl } from "react-intl";

import Stock from "./CustomCells/Stock";
import Badge from "../../ui/badge/Badge";
import Status from "./CustomCells/Status";
import MedicineName from "./CustomCells/MedicineName";
import { BatchStock } from "./CustomCells/BatchStock";
import { stringAvatar } from "../../../utils/AvatarUtils";
import BatchExpiration from "./CustomCells/ExpirationDate";
import { BrandCellActions } from "./CustomCells/BrandCellActions";
import { BatchCellActions } from "./CustomCells/BatchCellActions";
import MedicineClasification from "./CustomCells/MedicineClasification";
import { EmployeeCellActions } from "../table/CustomCells/EmployeeCellActions";
import MedicineActiveIngredients from "./CustomCells/MedicineActiveIngredients";
import TransactionDate from "./CustomCells/TransactionDate";
import TransactionPay from "./CustomCells/TransactionPay";
import TransactionMedicine from "./CustomCells/TransactionMedicine";
import TransactionEmployee from "./CustomCells/TransactionEmployee";

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
						<Avatar
							{...stringAvatar({
								name: row.original.names,
								size: 30,
							})}
						/>
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
				accessorKey: "employeeStatusId",
				enableSorting: false,
				cell: ({ row }) => {
					const isActive = row.original.employeeStatusId === 1;
					return <Status status={isActive} />;
				},
			},
			{
				header: intl.formatMessage({ id: "actions" }),
				id: "actions",
				cell: ({ row }) => <EmployeeCellActions row={row} />,
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
				header: intl.formatMessage({ id: "statuses" }),
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
				cell: ({ getValue }) => (
					<Status status={getValue() ? true : false} />
				),
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
				cell: ({ getValue }) => (
					<Status status={getValue() ? true : false} />
				),
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
				cell: ({ getValue }) => (
					<Status status={getValue() ? true : false} />
				),
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
				cell: ({ getValue }) => (
					<Status status={getValue() ? true : false} />
				),
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

export const useMedicineColumns = () => {
	const intl = useIntl();
	const columns = useMemo<ColumnDef<any>[]>(
		() => [
			{
				header: intl.formatMessage({ id: "name" }),
				id: "name",
				cell: ({ row }) => <MedicineName row={row} />,
			},
			{
				header: intl.formatMessage(
					{ id: "clasification" },
					{ count: 1 },
				),
				id: "medicineClasification",
				cell: ({ row }) => <MedicineClasification row={row} />,
			},
			{
				header: intl.formatMessage(
					{ id: "active_ingredients" },
					{ count: 1 },
				),
				id: "medicineActiveIngredients",
				cell: ({ row }) => <MedicineActiveIngredients row={row} />,
			},
			{
				header: intl.formatMessage({ id: "stock" }),
				id: "product",
				cell: ({ row }) => <Stock row={row} />,
			},
			{
				header: intl.formatMessage({ id: "description" }),
				accessorKey: "description",
				id: "description",
			},
			{
				header: intl.formatMessage({ id: "actions" }),
				id: "actions",
				cell: ({ row }) => <BatchCellActions row={row} />,
			},
		],
		[intl],
	);

	return columns;
};

export const useBatchColumns = () => {
	const intl = useIntl();
	const columns = useMemo<ColumnDef<any>[]>(
		() => [
			{
				header: intl.formatMessage({ id: "code" }),
				accessorKey: "batch_code",
				id: "batch_code",
			},
			{
				header: intl.formatMessage({ id: "exp_date" }),
				accessorKey: "expiration_date",
				id: "expiration_date",
				cell: ({ row }) => (
					<BatchExpiration
						expirationDate={row.original.expiration_date}
					/>
				),
			},
			{
				header: intl.formatMessage({ id: "stock" }),
				// id: "product",
				cell: ({ row }) => (
					<BatchStock
						current={row.original.current_quantity_units ?? 0}
						initial={row.original.initial_quantity_units ?? 0}
					/>
				),
			},
		],
		[intl],
	);
	return columns;
};

export const useSaleColumns = () => {
	const intl = useIntl();
	const columns = useMemo<ColumnDef<any>[]>(
		() => [
			{
				header: intl.formatMessage({ id: "date" }),
				accessorKey: "saleDate",
				id: "saleDate",
				cell: ({ row }) => <TransactionDate row={row} />,
			},
			{
				header: intl.formatMessage({ id: "sales.assintant" }),
				id: "employee",
				cell: ({ row }) => <TransactionEmployee row={row} />,
			},
			{
				header: intl.formatMessage({ id: "products" }, { count: 2 }),
				id: "saleDetails",
				cell: ({ row }) => <TransactionMedicine row={row} />,
			},
			{
				header: intl.formatMessage({ id: "paymentMean" }),
				id: "payment",
				cell: ({ row }) => <TransactionPay row={row} />,
			},
		],
		[intl],
	);
	return columns;
};
