// --- Importaciones de Componentes de librerias ---
import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  PaginationState
} from "@tanstack/react-table";
import { useIntl } from "react-intl";


// --- Importaciones de Componentes Locales ---
import TableDefinition from "../../ui/table/TableDefinition";
import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";



// --- Interfaces de la API ---
// Define la estructura de un objeto Empleado, tal como viene de la API.
interface Employee {
  employeeId: number;
  names: string;
  lastnames: string;
  phone: string;
  user: string;
  email: string;
  url_photo: string;
  hiring_date: string;
  employeeRoleId: number;
  employeeStatusId: number;
  roleName: string;
  statusName: string;
}

// Define la estructura de la respuesta completa de la API.
interface ApiResponse {
  success: boolean;
  message: string | null;
  data: Employee[];
}

// --- Handlers de Acciones (externos al componente) ---
// Funciones simples que no dependen de los hooks de React.
const handleModificar = (id: number) => {
  alert(`Modificar usuario con ID ${id}`);
};
const handleDesactivar = (id: number) => {
  alert(`Desactivar usuario con ID ${id}`);
};




// --- Componente Principal: EmployeeTable ---
// Este componente actúa como el "cerebro" de la tabla.
// Maneja el estado, la carga de datos y la configuración de la tabla.
export default function EmployeeTable() {
  // Hook para acceder a las traducciones de react-intl.
  const intl = useIntl();

  // --- Estados del Componente ---
  // Almacena los datos de empleados recibidos de la API.
  const [employees, setEmployees] = useState<Employee[]>([]);
  // Estado para mostrar un indicador de carga.
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para almacenar mensajes de error.
  const [error, setError] = useState<string | null>(null);

  // --- Estados Específicos de TanStack Table ---
  // Almacena el estado actual del ordenamiento (ej: { id: 'names', desc: false }).
  const [sorting, setSorting] = useState<SortingState>([]);
  // Almacena el texto de búsqueda del filtro global.
  const [globalFilter, setGlobalFilter] = useState<string>('');
  // Almacena el estado de la paginación (página actual e ítems por página).
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // Página inicial (índice 0).
    pageSize: 10,  // Filas por página.
  });


  // --- Definición de Columnas (Memoizada) ---
  // `useMemo` optimiza el rendimiento.
  // Evita recalcular las columnas en cada render, solo si `intl` cambia.
  const columns = useMemo<ColumnDef<Employee>[]>(() => [
    {
      // `header` usa `intl` para la traducción.
      header: intl.formatMessage({ id: 'names' }),
      id: "nombres",
      // `cell` define un renderizado personalizado para esta celda.
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={row.original.url_photo || "/images/user/user-placeholder.jpg"}
              alt={row.original.names}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <span>{row.original.names}</span>
        </div>
      ),
    },
    {
      header: intl.formatMessage({ id: 'lastnames' }),
      // `accessorKey` extrae datos directamente de la fila (ej: row.lastnames).
      accessorKey: "lastnames",
    },
    {
      header: intl.formatMessage({ id: 'email' }),
      accessorKey: "email",
    },
    {
      header: intl.formatMessage({ id: 'role' }),
      accessorKey: "roleName",
    },
    {
      header: intl.formatMessage({ id: 'statuses' }),
      accessorKey: "statusName",
      // Renderizado personalizado para el Badge de estado.
      cell: ({ row }) => (<Badge /* ... */ >{row.original.statusName}</Badge>),
    },
    {
      header: intl.formatMessage({ id: 'options' }),
      id: "opciones",
      // Renderizado personalizado para los botones de acción.
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button onClick={() => handleModificar(row.original.employeeId)} /* ... */ >
            {/* Texto del botón también traducido. */}
            {/* {intl.formatMessage({ id: 'button.modify' })} */}
            {'texto temporal'}
          </Button>
          <Button onClick={() => handleDesactivar(row.original.employeeId)} /* ... */ >
            {'texto temporal'}
            {/* {intl.formatMessage({ id: 'button.deactivate' })} */}
          </Button>
        </div>
      ),
    },
  ], [intl]); // `intl` es la única dependencia.

  // --- Carga de Datos (Efecto) ---
  // `useEffect` con `[]` se ejecuta una vez, cuando el componente se monta.
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Petición a la API.
        const response = await fetch('https://localhost:44361/api/Employee/getAllEmployees');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const result: ApiResponse = await response.json();
        if (result.success) {
          // Carga exitosa: guarda los datos en el estado.
          setEmployees(result.data);
        } else {
          // Error de API: guarda el mensaje.
          setError(result.message || "Error al obtener los datos");
        }
      } catch (err: any) {
        // Error de red/fetch: guarda el mensaje.
        setError(err.message);
      } finally {
        // Sea éxito o error, finaliza la carga.
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []); // El array vacío `[]` asegura que se ejecute solo una vez.

  // --- Instanciación de la Tabla ---
  // `useReactTable` es el hook principal que une todo.
  const table = useReactTable({
    data: employees, // Los datos de la API.
    columns,         // La definición de columnas memoizada.

    // --- Estado Controlado ---
    // Conecta los estados de React con la instancia de la tabla.
    state: {
      sorting,
      globalFilter,
      pagination
    },

    // --- Modelos (Pipelines) ---
    // Activa las diferentes funcionalidades (orden, filtro, paginación).
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    // --- Handlers (Actualizadores) ---
    // Conecta los eventos de la tabla (ej: clic en ordenar) a los `setters` de estado.
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
  });

  // Handler para el botón de agregar.
  const handleAgregarUsuario = () => {
    alert("Agregar nuevo usuario");
  };

  // --- Renderizado Condicional (Carga/Error) ---
  // TODO: Mejorar con componentes visuales.
  if (loading) return <div className="text-center p-10">Cargando empleados...</div>;
  if (error) return <div className="text-center p-10 text-red-600">Error: {error}</div>;

  // --- Renderizado Principal ---
  return (
    <div className="flex flex-col gap-6">
      {/* Botón de Agregar Usuario */}
      <div className="flex justify-end">
        <Button
          onClick={handleAgregarUsuario}
          variant="primary"
          size="md"
          className="!bg-blue-600 hover:!bg-blue-700"
        >
          + Agregar Usuario
        </Button>
      </div>

      {/* Componente Visual de la Tabla */}
      {/* Pasa la instancia 'table' (el "cerebro") al componente 'TableDefinition' (el "renderizador"). */}
      <TableDefinition table={table} />
    </div>
  );
}