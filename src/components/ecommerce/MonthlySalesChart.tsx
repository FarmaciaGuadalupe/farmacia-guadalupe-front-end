import flatpickr from "flatpickr";
import Chart from "react-apexcharts";
import "flatpickr/dist/flatpickr.css";
import { useState, useEffect, useRef } from "react";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import { useIntl, FormattedMessage } from "react-intl";

import { ApexOptions } from "apexcharts";
import { CalenderIcon } from "../../icons";
import { useQuery } from "@apollo/client/react";
import ChartTab, { ChartTabOption } from "../common/ChartTab";
import { GET_DASHBOARD_SALE_SUMMARY } from "../ui/table/QuerysDefinitions";


export default function MonthlySalesChart() {

  const intl = useIntl(); 
  const [chartType, setChartType] = useState<ChartTabOption>("DAILY");
  
  // Default range: last 7 days
  const [dateRange, setDateRange] = useState<{start: Date, end: Date}>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    return { start, end };
  });

  const { data, loading, error } = useQuery(GET_DASHBOARD_SALE_SUMMARY, {
    variables: {
      startDate: dateRange.start.toISOString().split('T')[0] + "T00:00:00Z",
      endDate: dateRange.end.toISOString().split('T')[0] + "T23:59:59Z",
      type: chartType
    },
    fetchPolicy: "network-only"
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

  const datePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!datePickerRef.current) return;

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      locale: Spanish,
      static: true,
      monthSelectorType: "static",
      dateFormat: "M d",
      defaultDate: [dateRange.start, dateRange.end],
      clickOpens: true,
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          setDateRange({
            start: selectedDates[0],
            end: selectedDates[1]
          });
        }
      },
      prevArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 15L7.5 10L12.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      nextArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    });

    return () => {
      if (!Array.isArray(fp)) {
        fp.destroy();
      }
    };
  }, []); 


  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between sm:items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          <FormattedMessage id='sales.summary'/>
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <ChartTab selected={chartType} onSelect={setChartType} />
          <div className="relative inline-flex items-center">
            <CalenderIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500 dark:text-gray-400 pointer-events-none z-10" />
            <input
              ref={datePickerRef}
              className="z-100 h-10 w-45 pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 cursor-pointer"
              placeholder="Select date range"
            />
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          {loading ? (
             <div className="flex items-center justify-center h-[180px] text-gray-500">Loading...</div>
          ) : error ? (
            <div className="flex items-center justify-center h-[180px] text-error-500">Error loading sales data</div>
          ) : (
            <Chart options={options} series={series} type="bar" height={180} />
          )}
        </div>
      </div>
    </div>
  );
}
