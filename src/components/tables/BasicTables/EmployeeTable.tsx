// src/components/tables/BasicTables/BasicTableOne.tsx

import { useState, useEffect } from "react"; // IMPORTANTE
import TableDefinition from "../../ui/table/TableDefinition";
import type { ColumnDef } from "../../ui/table/TableDefinition";
import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";

// --- Interfaces de la API (definidas arriba) ---
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
  // Agregamos 'id' para que coincida con la prop 'id' de TableDefinition
  id: number; 
}

interface ApiResponse {
  success: boolean;
  message: string | null;
  data: Omit<Employee, 'id'>[]; // La data original no tiene 'id'
}

// --- Funciones de manejo (sin cambios) ---
const handleModificar = (id: number) => {
  alert(`Modificar usuario con ID ${id}`);
};
const handleDesactivar = (id: number) => {
  alert(`Desactivar usuario con ID ${id}`);
};

// --- Definición de Columnas (MODIFICADA) ---
// La adaptamos para que use los campos de la API (Employee)
const columns: ColumnDef<Employee>[] = [
  {
    header: "NOMBRES",
    id: "nombres",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            // Usamos url_photo, y un placeholder si está vacía
            src={row.url_photo || "/images/user/user-placeholder.jpg"}
            alt={row.names}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        </div>
        <span>{row.names}</span> {/* Usamos .names */}
      </div>
    ),
  },
  {
    header: "APELLIDOS",
    accessorKey: "lastnames", // Usamos .lastnames
  },
  {
    header: "CORREO",
    accessorKey: "email", // Usamos .email
  },
  {
    header: "CARGO",
    accessorKey: "roleName", // Usamos .roleName
  },
  {
    header: "ESTADO",
    accessorKey: "statusName", // Usamos .statusName
    cell: ({ row }) => (
      <Badge
        size="sm"
        color={
          row.statusName === "Activo"
            ? "success"
            : row.statusName === "Inactivo"
            ? "error"
            : "warning"
        }
      >
        {row.statusName}
      </Badge>
    ),
  },
  {
    header: "OPCIONES",
    id: "opciones",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          onClick={() => handleModificar(row.employeeId)} // Usamos .employeeId
          variant="outline"
          size="sm"
          className="text-yellow-600..."
        >
          Modificar
        </Button>
        <Button
          onClick={() => handleDesactivar(row.employeeId)} // Usamos .employeeId
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

  useEffect(() => {
    // Definimos la función de fetching dentro de useEffect
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://localhost:44361/api/Employee/getAllEmployees');
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (result.success) {
          // Mapeamos los datos para añadir una prop 'id' (ej: id: emp.employeeId), 
          // ya que 'TablaGenerica' la usa como 'key' única para cada fila en React.
          const dataWithId = result.data.map(emp => ({
            ...emp,
            id: emp.employeeId 
          }));
          setEmployees(dataWithId);
        } else {
          setError(result.message || "Error al obtener los datos");
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Error al llamar la API:", err);
      } finally {
        setLoading(false);
      }
    };

    // Llamamos a la función
    fetchEmployees();

  }, []); // El array vacío [] significa que esto se ejecuta 1 vez al montar el componente

  const handleAgregarUsuario = () => {
    alert("Agregar nuevo usuario");
  };

  // --- Renderizado Condicional ---
  
  if (loading) {
    return <div className="text-center p-10">Cargando empleados...</div>;
  }
  
  if (error) {
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;
  }

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

      {/* TABLA GENÉRICA CON DATOS DE LA API */}
      <TableDefinition columns={columns} data={employees} />
    </div>
  );
}