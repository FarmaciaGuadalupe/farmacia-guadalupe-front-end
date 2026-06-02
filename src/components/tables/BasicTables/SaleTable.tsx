// src/components/features/employee/EmployeeTable.tsx
import { useState, useMemo } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { ServerDataTable } from "../../ui/table/ServerDataTable";
import { GET_ALL_SALES } from "../../ui/table/QuerysDefinitions";
import { useSaleColumns } from "../../ui/table/ColumnsDefinitions";
import DatePicker from "../../form/date-picker";
import dayjs from "dayjs";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function SaleTable() {
	const intl = useIntl();
	const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
		start: "",
		end: "",
	});

	const query = GET_ALL_SALES();
	const columns = useSaleColumns();

	const filter = useMemo(() => {
		if (!dateRange.start || !dateRange.end) return null;

		return {
			saleDate: {
				gte: dayjs.utc(dateRange.start).startOf("day").toISOString(),
				lte: dayjs.utc(dateRange.end).endOf("day").toISOString(),
			},
		};
	}, [dateRange]);

	const handleDateChange = (selectedDates: Date[]) => {
		if (selectedDates.length === 2) {
			setDateRange({
				start: dayjs.utc(selectedDates[0]).format("YYYY-MM-DD"),
				end: dayjs.utc(selectedDates[1]).format("YYYY-MM-DD"),
			});
		} else if (selectedDates.length === 0) {
			setDateRange({ start: "", end: "" });
		}
	};

	const clearFilters = () => {
		setDateRange({ start: "", end: "" });
	};

	const isFiltered = !!dateRange.start || !!dateRange.end;

	return (
		<div className="space-y-4">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
					<FormattedMessage id="sales.summary" />
				</h3>
				<div className="flex items-center gap-2 w-full md:w-auto">
					{isFiltered && (
						<button
							onClick={clearFilters}
							className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400 transition-colors"
						>
							<XMarkIcon className="size-4" />
							<FormattedMessage id="cancel" />
						</button>
					)}
					<div className="w-full md:w-64">
						<DatePicker
							id="sale-date-filter"
							mode="range"
							placeholder={intl.formatMessage({
								id: "sales.select_date_range",
							})}
							value={isFiltered ? `${dateRange.start} to ${dateRange.end}` : ""}
							onChange={handleDateChange}
						/>
					</div>
				</div>
			</div>
			<ServerDataTable 
				columns={columns} 
				query={query} 
				queryKeyName="sales" 
				filter={filter}
			/>
		</div>
	);
}
