// src/components/tables/BasicTables/BasicTableOne.tsx

import { useState, useEffect } from "react";
import TableDefinition from "../../ui/table/TableDefinition"; // (Este es el que vamos a modificar)
import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";

// --- NUEVO: Imports de TanStack Table ---
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,   
  ColumnDef,    
  SortingState, 
} from "@tanstack/react-table";

// --- Interfaces de la API (Sin cambios) ---
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

interface ApiResponse {
  success: boolean;
  message: string | null;
  data: Employee[]; // Ya no necesitamos 'id' extra
}

// --- Funciones de manejo (Sin cambios) ---
const handleModificar = (id: number) => {
  alert(`Modificar usuario con ID ${id}`);
};
const handleDesactivar = (id: number) => {
  alert(`Desactivar usuario con ID ${id}`);
};

// --- Definición de Columnas (MODIFICADA para TanStack) ---
// Usamos ColumnDef<Employee> de @tanstack/react-table
const columns: ColumnDef<Employee>[] = [
  {
    header: "NOMBRES",
    id: "nombres",
    // NUEVO: 'row' es un objeto de TanStack. Los datos están en 'row.original'
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
    header: "APELLIDOS",
    accessorKey: "lastnames", // Esto funciona igual
  },
  {
    header: "CORREO",
    accessorKey: "email",
  },
  {
    header: "CARGO",
    accessorKey: "roleName",
  },
  {
    header: "ESTADO",
    accessorKey: "statusName",
    cell: ({ row }) => (
      <Badge
        size="sm"
        color={
          row.original.statusName === "Activo"
            ? "success"
            : row.original.statusName === "Inactivo"
            ? "error"
            : "warning"
        }
      >
        {row.original.statusName}
      </Badge>
    ),
  },
  {
    header: "OPCIONES",
    id: "opciones",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          onClick={() => handleModificar(row.original.employeeId)}
          variant="outline"
          size="sm"
          className="text-yellow-600..."
        >
          Modificar
        </Button>
        <Button
          onClick={() => handleDesactivar(row.original.employeeId)}
          variant="outline"
          size="sm"
          className="text-red-600..."
        >
          Desactivar
        </Button>
      </div>
    ),
  },
];


// --- Componente Principal (MODIFICADO) ---
export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- NUEVO: Estado para el ordenamiento ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>(''); // <--- 2. AÑADE ESTADO PARA EL FILTRO

  // --- Fetch de datos (MODIFICADO) ---
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://localhost:44361/api/Employee/getAllEmployees');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const result: ApiResponse = await response.json();
        if (result.success) {
          // YA NO es necesario el .map() para añadir 'id'.
          setEmployees(result.data);
        } else {
          setError(result.message || "Error al obtener los datos");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // --- NUEVO: Creación de la instancia de la tabla ---
  const table = useReactTable({
    data: employees,  // Los datos del estado
    columns,          // Las columnas que definimos arriba
    
    // --- Lógica de Ordenamiento ---
    state: {
      sorting, // Pasamos el estado de ordenamiento
      globalFilter
    },
    
    // --- Pipelines (Modelos) ---
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // ¡Añadimos el modelo de ordenamiento!
    getFilteredRowModel: getFilteredRowModel(), // <--- 3. Añadimos el modelo de filtrado

    // --- Handlers ---
    onSortingChange: setSorting, // Le decimos cómo actualizar el estado
    onGlobalFilterChange: setGlobalFilter, // <--- 4. Handler para actualizar el filtro
  });

  const handleAgregarUsuario = () => {
    alert("Agregar nuevo usuario");
  };

  if (loading) return <div className="text-center p-10">Cargando empleados...</div>;
  if (error) return <div className="text-center p-10 text-red-600">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-6">
      {/* BOTÓN DE AGREGAR */}
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

      {/* NUEVO: Pasamos la instancia 'table' al componente visual */}
      <TableDefinition table={table} />
    </div>
  );
}