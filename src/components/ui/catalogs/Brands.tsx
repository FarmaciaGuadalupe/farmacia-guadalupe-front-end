import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useIntl, FormattedMessage } from "react-intl";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import clsx from "clsx";
import { useState } from "react";

import BrandsTable from "../../tables/BasicTables/BrandsTable";
import SimpleModal from "../utils/SimpleModal";

const TOGGLE_BRAND_STATUS_MUTATION = gql`
  mutation ToggleBrandStatus($id_brand: Int!) {
    toggleBrandStatus(id_brand: $id_brand) {
      id_brand
      name
      is_active
    }
  }
`;

const ToggleActivatedModal = ({ onClose }: any) => {
    const intl = useIntl();
    // Asegurarse de extraer id_brand
    // const { id_brand, is_active, name } = row.original;

    // 3. CONFIGURAR EL HOOK useMutation
    const [toggleStatus, { loading, error }] = useMutation(TOGGLE_BRAND_STATUS_MUTATION, {
        onCompleted: () => {
            // Cierra el modal cuando la operación termina con éxito
            onClose(); 
        },
        onError: (err: any) => {
            console.error("Error al cambiar estado:", err);
            // Aquí podrías agregar una notificación tipo Toast
        }
    });

    // const handleConfirm = () => {
    //     toggleStatus({
    //         variables: {
    //             id_brand: parseInt(id_brand) // Asegurar que sea entero según tu schema
    //         }
    //     });
    // };

    return (
        <SimpleModal
            isOpen={true}
            onClose={onClose}
            title={intl.formatMessage({ id: 'create' })}
        >
            <p>{intl.formatMessage({ id: 'confirm_action_message' })}</p>

            {error && <p className="text-red-500 text-sm mt-2">Error: {error.message}</p>}

            <div className="mt-6 flex justify-end gap-3">
                <button 
                    onClick={onClose} 
                    className="px-4 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                    disabled={loading}
                >
                    <FormattedMessage id="cancel" defaultMessage="Cancelar" />
                </button>
                
                <button 
                    // onClick={handleConfirm}
                    disabled={loading}
                    className={clsx(
                        "px-4 py-2 text-white rounded transition-colors flex items-center gap-2",
                        "bg-green-600 hover:bg-green-700",
                        loading && "opacity-70 cursor-not-allowed"
                    )}
                >
                    {loading ? (
                        <span>Processing...</span> // Puedes poner un spinner aquí
                    ) : (
                        <FormattedMessage id="save" />
                    )}
                </button>
            </div>
        </SimpleModal>
    );
}

export default function Brands() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    return (
        <div className="flex-1">
            {/* 1. Envolvemos el botón en un div con 'flex' y 'justify-end' */}
            <div className="flex justify-end mb-4"> 
                <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 text-white rounded-xl transition-colors flex items-center gap-2 bg-brand-500">
                    <PlusCircleIcon className="h-5 w-5" />
                    Add New Brand
                </button>
            </div>
            
            <BrandsTable />

            {isCreateModalOpen && (
                <ToggleActivatedModal 
                onClose={() => setIsCreateModalOpen(false)}/>
            )}
        </div>
    );
}