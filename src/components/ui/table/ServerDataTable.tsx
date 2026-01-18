// src/components/ui/table/ServerDataTable.tsx
import { useEffect, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    ColumnDef,
    flexRender,
    SortingState, // Importamos el tipo para el estado de orden
} from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Table, TableBody, TableCell, TableHeader, TableRow } from ".";
import { useGraphQLPagination } from "../../../hooks/useGraphQLPagination";
import CursorPaginationControl from "./CursorPaginationControl";

interface ServerDataTableProps<TData> {
    columns: ColumnDef<TData, any>[];
    query: string;
    queryKeyName: string;
}

export function ServerDataTable<TData>({
    columns,
    query,
    queryKeyName,
    initialPageSize = 10 // Puedes aceptar una prop opcional para el default
}: ServerDataTableProps<TData> & { initialPageSize?: number }) {

    // 1. Estado para el Ordenamiento
    const [sorting, setSorting] = useState<SortingState>([]);

    // Estado de Datos y Carga
    const [data, setData] = useState<TData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null });

    // Hook de Paginación
    // 1. Usamos el hook con el tamaño inicial
    const {
        pageSize,
        setPageSize, // Obtenemos el setter
        currentCursor,
        onNextPage,
        onPreviousPage,
        hasPreviousPage,
        resetPagination
    } = useGraphQLPagination(initialPageSize);

    // 2. Creamos un handler intermedio para resetear al cambiar tamaño
    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);    // Actualiza el estado del tamaño
        resetPagination();       // Vuelve a la página 1 (cursor null)
    };

    // El useEffect ya depende de [pageSize, currentCursor], 
    // así que al cambiar estos valores, el fetch se disparará solo.
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCursor, pageSize, sorting]);

    // 3. Función auxiliar para convertir el formato de TanStack a GraphQL
    // TanStack: [{ id: 'names', desc: false }]
    // GraphQL (ejemplo genérico): { names: 'ASC' } o { names: 'DESC' }
    const getSortVariables = () => {
        if (sorting.length === 0) return null;
        const sortRule = sorting[0];
        return {
            [sortRule.id]: sortRule.desc ? "DESC" : "ASC"
        };
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("http://localhost:5036/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: query,
                    variables: {
                        first: pageSize,
                        after: currentCursor,
                        order: getSortVariables() // <--- Enviamos el orden aquí
                    },
                }),
            });

            const json = await response.json();

            if (json.errors) throw new Error(json.errors[0].message);

            const result = json.data[queryKeyName];
            setData(result.nodes);
            setPageInfo(result.pageInfo);

        } catch (err: any) {
            console.error("GraphQL Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 4. Efecto principal: Cargar datos cuando cambia cursor o sorting
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCursor, pageSize, sorting]);

    // Configuración de la Tabla
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting, // <--- Conectamos el estado
        },
        onSortingChange: setSorting, // <--- Conectamos el setter
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true, // Importante: Decirle a TanStack que el server ordena
    });

    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

    return (
        <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableCell
                                            key={header.id}
                                            isHeader
                                            className="px-5 py-3 text-start font-medium text-gray-500"
                                        >
                                            {/* Lógica de UI para Header Clickeable */}
                                            <div
                                                className={header.column.getCanSort() ? "cursor-pointer select-none flex items-center gap-1" : ""}
                                                onClick={header.column.getToggleSortingHandler()} // Handler de Click
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}

                                                {/* Iconos de Ordenamiento */}
                                                <span>
                                                    {{
                                                        asc: <ChevronUpIcon className="w-4 h-4 text-gray-600" />,
                                                        desc: <ChevronDownIcon className="w-4 h-4 text-gray-600" />,
                                                    }[header.column.getIsSorted() as string] ??
                                                        (header.column.getCanSort() ? <ChevronUpDownIcon className="w-4 h-4 text-gray-300" /> : null)
                                                    }
                                                </span>
                                            </div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody className={loading ? "opacity-50 pointer-events-none" : ""}>
                            {/* ... (Mismo renderizado de filas que tenías) ... */}
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="px-5 py-3 text-gray-800 dark:text-white">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell className="text-center py-4" isHeader={false}>
                                        {loading ? "Cargando..." : "No hay datos"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <CursorPaginationControl
                hasNextPage={pageInfo.hasNextPage}
                hasPreviousPage={hasPreviousPage}
                onNext={() => pageInfo.endCursor && onNextPage(pageInfo.endCursor)}
                onPrevious={onPreviousPage}
                loading={loading}
                pageSize={pageSize}
                setPageSize={handlePageSizeChange}
            />
        </div>
    );
}