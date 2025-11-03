import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";

interface User {
  id: number;
  image: string;
  nombres: string;
  apellidos: string;
  correo: string;
  cargo: string;
  telefono: string;
  usr: string;
  password: string;
  estado: string;
}
const usersData: User[] = [
  {
    id: 1,
    image: "/images/user/user-17.jpg",
    nombres: "Juan",
    apellidos: "Pérez",
    correo: "juan.perez@gmail.com",
    cargo: "Administrador",
    telefono: "987654321",
    usr: "juanp",
    password: "1234",
    estado: "Activo",
  },
  {
    id: 2,
    image: "/images/user/user-20.jpg",
    nombres: "María",
    apellidos: "González",
    correo: "maria.gonzalez@gmail.com",
    cargo: "Cajera",
    telefono: "912345678",
    usr: "mariag",
    password: "abcd",
    estado: "Inactivo",
  },
  {
    id: 3,
    image: "/images/user/user-19.jpg",
    nombres: "Luis",
    apellidos: "Ramírez",
    correo: "luis.ramirez@gmail.com",
    cargo: "Vendedor",
    telefono: "945612378",
    usr: "luisr",
    password: "xyz",
    estado: "Activo",
  },
];

export default function BasicTableOne() {
  const handleAgregarUsuario = () => {
    alert("Agregar nuevo usuario");
  };

  const handleModificar = (id: number) => {
    alert(`Modificar usuario con ID ${id}`);
  };

  const handleDesactivar = (id: number) => {
    alert(`Desactivar usuario con ID ${id}`);
  };

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

      {/* TABLA */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* ENCABEZADO */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs">
                  NOMBRES
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs">
                  APELLIDOS
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs">
                  CORREO
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs">
                  CARGO
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs">
                  TELÉFONO
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs">
                  USUARIO
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs">
                  CONTRASEÑA
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs">
                  ESTADO
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs">
                  OPCIONES
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* CUERPO */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {usersData.map((user) => (
                <TableRow key={user.id}>
                  {/* FOTO DENTRO DE NOMBRE */}
                  <TableCell className="px-5 py-3 text-start text-gray-800 dark:text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          src={user.image}
                          alt={user.nombres}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <span>{user.nombres}</span>
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-3 text-gray-800 dark:text-white">
                    {user.apellidos}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-gray-500 dark:text-gray-400">
                    {user.correo}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-gray-500 dark:text-gray-400">
                    {user.cargo}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-gray-500 dark:text-gray-400">
                    {user.telefono}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-gray-500 dark:text-gray-400">
                    {user.usr}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-gray-500 dark:text-gray-400">
                    {user.password}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-start">
                    <Badge
                      size="sm"
                      color={
                        user.estado === "Activo"
                          ? "success"
                          : user.estado === "Inactivo"
                          ? "error"
                          : "warning"
                      }
                    >
                      {user.estado}
                    </Badge>
                  </TableCell>

                  {/* BOTONES */}
                  <TableCell className="px-5 py-3 text-start">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleModificar(user.id)}
                        variant="outline"
                        size="sm"
                        className="text-yellow-600 ring-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-600/10"
                      >
                        Modificar
                      </Button>

                      <Button
                        onClick={() => handleDesactivar(user.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 ring-red-400 hover:bg-red-50 dark:hover:bg-red-600/10"
                      >
                        Desactivar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}