import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@mui/material"; 
import { FormattedMessage, useIntl } from "react-intl";


// --- Definición de Tipos ---

// Las props que este componente espera
interface AddEmployeeFormProps {
  onClose: () => void;      // Función para cerrar el drawer (ej: al cancelar)
  onSaveSuccess: () => void; // Función a llamar cuando se guarde con éxito
}

// El payload que espera la API
interface CreateEmployeePayload {
  names: string;
  lastnames: string;
  phone: string;
  user: string;
  password: string;
  email: string;
  url_photo: string;
}

// Estado inicial (vacío) para el formulario
const initialState: CreateEmployeePayload = {
  names: "",
  lastnames: "",
  phone: "",
  user: "",
  password: "",
  email: "",
  url_photo: "",
};

// --- El Componente ---
export default function AddEmployeeForm({ onClose, onSaveSuccess }: AddEmployeeFormProps) {
  const intl = useIntl();

  // --- Estados del Formulario ---
  // Un solo estado para todos los campos del formulario
  const [formData, setFormData] = useState<CreateEmployeePayload>(initialState);
  // Estado para deshabilitar el botón de guardar mientras se envía
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Estado para mostrar errores de la API
  const [error, setError] = useState<string | null>(null);

  // --- Handlers ---

  /**
   * Un solo handler que actualiza el estado 'formData'
   * para cualquier input con un atributo 'name'.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Se ejecuta al enviar el formulario.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    
    setIsSubmitting(true);
    setError(null);

    try {
      // --- Aquí está la llamada a la API ---
      // const response = await fetch('http://localhost:5036/api/Employee/createEmployee', {
      const response = await fetch('https://localhost:44361/api/Employee/createEmployee', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'text/plain',
        },
        body: JSON.stringify(formData), // Envía los datos del formulario
      });

      if (!response.ok) {
        // Si la API devuelve un error (ej: 400, 500)
        const errorText = await response.text();
        throw new Error(errorText || `Error del servidor: ${response.status}`);
      }
      
      // ¡Éxito!
      toast.success(intl.formatMessage({ id: 'employee.create.success' }));
      onSaveSuccess(); // Llama a la función de éxito (que cerrará el drawer y recargará)

    } catch (err: any) {
      // Si el 'fetch' falla (ej: red, CORS) o la API dio error
      setError(err.message);
      console.error("Error al crear empleado:", err);
      toast.error(intl.formatMessage({ id: 'employee.create.error' }));
    } finally {
      // Re-habilita el botón de guardar
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      
      <div className="flex-1 overflow-auto p-6 space-y-4">
        
        <div>
          <label htmlFor="names" className="block text-sm font-medium">
            <FormattedMessage id='names' />
          </label>
          <input
            type="text"
            id="names"
            name="names" // 'name' debe coincidir con la API
            value={formData.names} // Conecta al estado
            onChange={handleChange} // Conecta al handler
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="lastnames" className="block text-sm font-medium">
            <FormattedMessage id='lastnames' />
          </label>
          <input
            type="text"
            id="lastnames"
            name="lastnames"
            value={formData.lastnames}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            <FormattedMessage id='email' />
          </label>
          {/* TODO: Agregar mensajes de error: por ejemplo, email no deja pasar si no es uno valido */}
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="user" className="block text-sm font-medium">
            <FormattedMessage id='user' />
          </label>
          <input
            type="text"
            id="user"
            name="user"
            value={formData.user}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            <FormattedMessage id='password' />
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            <FormattedMessage id='phone' />
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* En la foto debe de subirse una imagen, guardarla en un blob y guardar la url */}
        {/* <div>
          <label htmlFor="url_photo" className="block text-sm font-medium">
            URL de Foto (Opcional)
          </label>
          <input
            type="text"
            id="url_photo"
            name="url_photo"
            value={formData.url_photo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div> */}

      </div>

      <div className="p-4 border-t border-gray-200">
        
        {/* Muestra de errores */}
        {error && (
          <div className="text-red-600 text-sm mb-2">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          {/* Botón de Cancelar (usa 'onClose') */}
          <Button type="button" onClick={onClose}>
            {intl.formatMessage({ id: 'cancel' })}
          </Button>
          {/* Botón de Guardar (usa 'type="submit"') */}
          <Button
            type="submit"
            disabled={isSubmitting} // Deshabilita mientras se envía
          >
            {isSubmitting 
              ? intl.formatMessage({ id: 'saving' }) // Ej: "Guardando..."
              : intl.formatMessage({ id: 'save' })   // Ej: "Guardar"
            }
          </Button>
        </div>
      </div>
    </form>
  );
}