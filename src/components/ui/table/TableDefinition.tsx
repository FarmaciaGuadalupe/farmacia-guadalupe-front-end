import { ChevronDownIcon, ChevronUpIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import {
  flexRender,
  Table as TanStackTable,
} from '@tanstack/react-table';
import { useIntl } from "react-intl";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from ".";
import PaginationControl from "./PaginationControl";



interface TableDefinitionProps<T> {
  table: TanStackTable<T>;
}

/**
 * Un componente genérico y reutilizable para renderizar tablas
 * impulsado por @tanstack/react-table.
 */
export default function TableDefinition<T>({ table }: TableDefinitionProps<T>) {
  const intl = useIntl();

  return (
    <div className="flex flex-col gap-5">
      <div>
        {/* TODO: Mejorar UI del input, usar mui o la plantilla */}
        <input
          type="text"
          value={table.getState().globalFilter ?? ''}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          placeholder={intl.formatMessage({ id: 'search' }) + '...'}
          className="w-full max-w-sm p-2 border border-gray-300 rounded-md dark:bg-white/[0.05] dark:border-white/[0.1] dark:text-white"
        />
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* === ENCABEZADO (renderizado por TanStack) === */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      isHeader
                      className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs">

                      <div
                        style={{
                          cursor: header.column.getCanSort() ? 'pointer' : 'default',
                          userSelect: 'none' // Evita que el texto se seleccione al hacer doble clic
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-1" // 'gap-1' para separar la flecha
                      >
                        {/* Renderiza el contenido del header */}
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {/* Indicador visual de ordenamiento */}
                        <span> {/* span para agrupar la flecha */}
                          {{
                            asc: <ChevronUpIcon className="w-4 h-4 text-gray-400" />,
                            desc: <ChevronDownIcon className="w-4 h-4 text-gray-400" />,
                            false: <ChevronUpDownIcon className="w-4 h-4 text-gray-400" />
                          }[header.column.getIsSorted() as string] ?? null}
                        </span>

                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            {/* === CUERPO (renderizado por TanStack) === */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {table.getRowModel().rows.map((row) => (
                // Ahora usamos row.id de TanStack como key
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-5 py-3 text-start text-gray-800 dark:text-white"
                    >
                      {/* Renderiza el contenido de la celda */}
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <PaginationControl table={table} />

    </div>
  );
}