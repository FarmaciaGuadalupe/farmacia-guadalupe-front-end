import { useQuery } from "@apollo/client/react";
import { FormattedMessage, FormattedNumber } from "react-intl";

import Badge from "../ui/badge/Badge";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import { GET_DASHBOARD_DAY_METRICS } from "../ui/table/QuerysDefinitions";
import { Form } from "react-router";

export default function EcommerceMetrics() {
  const today = new Date().toISOString().split("T")[0] + "T00:00:00Z";

  const { data, loading, error } = useQuery(GET_DASHBOARD_DAY_METRICS, {
    variables: { date: today },
    fetchPolicy: "network-only",
  });

  if (loading) return <p>Loading metrics...</p>;
  if (error) return <p>Error loading metrics: {error.message}</p>;

  const totalSales = data?.totalSalesByDay;
  const numberOfSales = data?.numberOfSalesByDay;

  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
      space-y-2
    >
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 pr-4">
          <FormattedMessage id="sales.daily" />
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {/* <!-- Metric Item Start --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                <FormattedMessage id="sales.total" />
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                <FormattedNumber
					style="currency"
					currency="NIO"
					value={totalSales?.total}
					currencyDisplay="symbol"
					locale="es-NI"
                />
              </h4>
            </div>
            <Badge color={totalSales?.percentage >= 0 ? "success" : "error"}>
              {totalSales?.percentage >= 0 ? (
                <ArrowUpIcon />
              ) : (
                <ArrowDownIcon />
              )}
              {Math.abs(totalSales?.percentage)}%
            </Badge>
          </div>
        </div>
        {/* <!-- Metric Item End --> */}

        {/* <!-- Metric Item Start --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                <FormattedMessage id="sales.number" />
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {numberOfSales?.total}
              </h4>
            </div>

            <Badge color={numberOfSales?.percentage >= 0 ? "success" : "error"}>
              {numberOfSales?.percentage >= 0 ? (
                <ArrowUpIcon />
              ) : (
                <ArrowDownIcon />
              )}
              {Math.abs(numberOfSales?.percentage)}%
            </Badge>
          </div>
        </div>
        {/* <!-- Metric Item End --> */}
      </div>
    </div>
  );
}
