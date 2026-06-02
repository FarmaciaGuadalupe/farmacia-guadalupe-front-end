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
import { FaBox, FaBoxOpen } from "react-icons/fa6";

import {
	IdentificationIcon,
	UserIcon,
	PhoneIcon,
	EnvelopeIcon,
	GlobeAltIcon,
	MapPinIcon,
} from "@heroicons/react/24/outline";

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
				header: intl.formatMessage({ id: "supplier" }),
				id: "supplier_info",
				cell: ({ row }) => (
					<div className="flex flex-col">
						<span className="text-base font-semibold text-gray-800 dark:text-gray-100">
							{row.original.company_name}
						</span>
						<div className="flex items-center gap-2 mt-1">
							{row.original.tax_id && (
								<span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 font-medium">
									<IdentificationIcon className="size-3.5" />
									{row.original.tax_id}
								</span>
							)}
							{row.original.type?.type_name && (
								<span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10">
									{row.original.type.type_name}
								</span>
							)}
						</div>
					</div>
				),
			},
			{
				header: intl.formatMessage({ id: "contact" }),
				id: "contact_info",
				cell: ({ row }) => (
					<div className="flex flex-col gap-1">
						{row.original.contact_name && (
							<div className="flex items-center gap-2 text-base text-gray-800 dark:text-gray-200 font-semibold">
								<UserIcon className="size-4 text-gray-500" />
								{row.original.contact_name}
							</div>
						)}
						<div className="flex flex-col text-sm text-gray-700 dark:text-gray-300 font-medium">
							{row.original.phone && (
								<div className="flex items-center gap-2">
									<PhoneIcon className="size-3.5 text-gray-500" />
									{row.original.phone}
								</div>
							)}
							{row.original.email && (
								<div className="flex items-center gap-2 mt-0.5">
									<EnvelopeIcon className="size-3.5 text-gray-500" />
									<span
										className="truncate max-w-[150px]"
										data-tooltip-id="global-tooltip"
										data-tooltip-content={row.original.email}
									>
										{row.original.email}
									</span>
								</div>
							)}
						</div>
					</div>
				),
			},
			{
				header: intl.formatMessage({ id: "details" }),
				id: "location_info",
				cell: ({ row }) => (
					<div className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-300 font-medium">
						{row.original.address && (
							<div className="flex items-start gap-2">
								<MapPinIcon className="size-4 mt-0.5 text-gray-500 shrink-0" />
								<span
									className="line-clamp-2 max-w-[200px]"
									data-tooltip-id="global-tooltip"
									data-tooltip-content={row.original.address}
								>
									{row.original.address}
								</span>
							</div>
						)}
						{row.original.website && (
							<div className="flex items-center gap-2">
								<GlobeAltIcon className="size-4 text-gray-500 shrink-0" />
								<a
									href={
										row.original.website.startsWith("http")
											? row.original.website
											: `https://${row.original.website}`
									}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-700 dark:text-blue-400 hover:underline font-semibold truncate max-w-[150px]"
								>
									{row.original.website.replace(
										/^https?:\/\//,
										"",
									)}
								</a>
							</div>
						)}
					</div>
				),
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
				header: intl.formatMessage({ id: "prices" }),
				id: "prices",
				cell: ({ row }) => {
					const unitPrice = row.original.product?.price_per_unit || 0;
					const fullPrice = row.original.product?.price_full_presentation || 0;

					if (unitPrice > 0) {
						return (
							<div className="flex items-center gap-2">
								<span>C$ {unitPrice.toFixed(2)}</span>
								{fullPrice > 0 && (
									<div
										className="cursor-help text-orange-500 p-2 rounded-full bg-orange-100"
										data-tooltip-id="global-tooltip"
										data-tooltip-content={`${intl.formatMessage({ id: "price_full_presentation" })}: C$ ${fullPrice.toFixed(2)}`}
									>
										<FaBox className="size-3" />
									</div>
								)}
							</div>
						);
					}

					return <span>C$ {fullPrice.toFixed(2)}</span>;
				},
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
