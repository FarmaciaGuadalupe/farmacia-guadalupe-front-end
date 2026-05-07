import { useState } from "react";
import Chart from "react-apexcharts";
import { useIntl, FormattedMessage } from "react-intl";

import { ApexOptions } from "apexcharts";
import ChartTab, { ChartTabOption } from "../common/ChartTab";
import { useQuery } from "@apollo/client/react";
import { GET_DASHBOARD_SALE_SUMMARY } from "../ui/table/QuerysDefinitions";


export default function MonthlySalesChart() {

  const intl = useIntl(); 
  const [chartType, setChartType] = useState<ChartTabOption>("DAILY");

  const { data, loading, error } = useQuery(GET_DASHBOARD_SALE_SUMMARY, {
    variables: {
      startDate: "2026-01-01T00:00:00Z", // Ampliamos un poco el rango para que YEARLY/MONTHLY tengan sentido
      endDate: "2026-12-31T23:59:59Z",
      type: chartType
    }
  });

  const chartLabels = data?.salesStats?.map((stat: any) => stat.label) || [];
  const chartValues = data?.salesStats?.map((stat: any) => stat.value) || [];

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "15%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chartLabels,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
  const series = [
    {
      name: intl.formatMessage({id: "sales"}, {count: 2}),
      data: chartValues,
    },
  ];

  if (loading) return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 h-[250px] flex flex-col">
       <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          <FormattedMessage id='sales.summary'/>
        </h3>
        <ChartTab selected={chartType} onSelect={setChartType} />
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-500">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 h-[250px] flex flex-col">
       <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          <FormattedMessage id='sales.summary'/>
        </h3>
        <ChartTab selected={chartType} onSelect={setChartType} />
      </div>
      <div className="flex-1 flex items-center justify-center text-error-500">Error loading sales data</div>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          <FormattedMessage id='sales.summary'/>
        </h3>
        <div className="relative inline-block">
          <ChartTab selected={chartType} onSelect={setChartType} />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
