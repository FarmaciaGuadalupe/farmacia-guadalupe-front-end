import "dayjs/locale/es";
import dayjs from "dayjs";
import { CalendarIcon } from "@heroicons/react/24/outline";

dayjs.locale("es");

const TransactionDate = ({ row }: any) => {
  const date = dayjs(row.original.saleDate);

  return (
    <div className="flex flex-row items-center gap-2">
      <CalendarIcon className="size-4" />
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {date.format("DD/MM/YYYY")}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {date.format("hh:mm A")}
      </span>
    </div>
  );
};

export default TransactionDate;
