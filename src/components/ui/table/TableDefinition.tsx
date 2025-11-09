// src/components/ui/TableDefinition.tsx

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "."; // Ajusta esta ruta si es necesario

// --- Definición de Tipos ---

/**
 * Define la forma de un objeto de columna.
 * T es el tipo del objeto de datos de la fila (ej: User)
 */
export interface ColumnDef<T> {
  /**
   * El texto a mostrar en el encabezado de la columna.
   */
  header: string;
  
  /**
   * (Opcional) La clave del objeto de datos a mostrar en esta celda.
   * Ej: 'nombres', 'correo'
   * Usa esto para datos simples que no necesitan formato.
   */
  accessorKey?: keyof T; 
  
  /**
   * (Opcional) Un ID único para la columna.
   * Es buena práctica proveerlo, especialmente si no se usa un accessorKey
   * (ej: una columna de 'acciones').
   */
  id?: string;
  
  /**
   * (Opcional) Una función personalizada para renderizar el contenido de la celda.
   * Recibe el objeto de la fila completa.
   * Úsala cuando necesites formato especial, botones, o imágenes.
   */
  cell?: (props: { row: T }) => React.ReactNode; 
}

/**
 * Define las props que recibirá el componente TableDefinition.
 * T debe ser un objeto que tenga una propiedad 'id' para usar como key.
 */
interface TableDefinitionProps<T extends { id: number | string }> {
  /**
   * El array de objetos de datos a mostrar.
   */
  data: T[];
  
  /**
   * El array de definiciones de columnas.
   */
  columns: ColumnDef<T>[];
}

// --- El Componente ---

/**
 * Un componente genérico y reutilizable para renderizar tablas.
 * Recibe 'data' y 'columns' como props.
 */
export default function TableDefinition<T extends { id: number | string }>({
  data,
  columns,
}: TableDefinitionProps<T>) {

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* === ENCABEZADO === */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  // Usa el 'id' o el 'accessorKey' como key
                  key={column.id || (column.accessorKey as string)}
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                >
                  {column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          {/* === CUERPO === */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data.map((row) => (
              // Usa el 'id' de la fila como key
              <TableRow key={row.id}>
                
                {/* Mapea las columnas OTRA VEZ por cada fila */}
                {columns.map((column) => {
                  
                  // Lógica para determinar el contenido de la celda
                  let cellContent: React.ReactNode = null;
                  
                  if (column.cell) {
                    // 1. PRIORIDAD: Si existe una función 'cell', la usamos.
                    //    Esto es para contenido personalizado (botones, badges, imágenes).
                    cellContent = column.cell({ row });
                  } else if (column.accessorKey) {
                    // 2. Si no hay 'cell', usamos el 'accessorKey' para obtener el valor simple.
                    //    (ej: row['apellidos'])
                    cellContent = row[column.accessorKey] as React.ReactNode;
                  }
                  
                  // 3. Si no hay ni 'cell' ni 'accessorKey', la celda quedará vacía (null).

                  return (
                    <TableCell 
                      key={column.id || (column.accessorKey as string)}
                      // Estas clases son genéricas, podrías necesitar ajustarlas
                      className="px-5 py-3 text-start text-gray-800 dark:text-white" 
                    >
                      {cellContent}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}