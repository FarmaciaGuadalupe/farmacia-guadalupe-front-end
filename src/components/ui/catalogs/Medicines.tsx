import { useState } from "react";
import { useIntl } from "react-intl";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

import SimpleModal from "../utils/SimpleModal";
import MedicineTable from "../../tables/BasicTables/MedicineTable";
import AddNewMedicine from "../table/CustomDrawers/AddNewMedicine";


const AddNewBrandDrawer = ({ onClose }: any) => {

    const intl = useIntl()

    return <SimpleModal
        isOpen={true}
        onClose={onClose}
        title={intl.formatMessage({ id: 'brand_add' })}
        widthClass="w-[75%]"
        disableOutsideClick={true}
        >
            <div>
                <AddNewMedicine />
            </div>
    </SimpleModal>

}

export default function Medicines() {   
    
    const [showDrawer, setShowDrawer] = useState<boolean>(false)
    
    
    return (
        <div className="flex-1">
            <div className="flex justify-end mb-4"> 
                <button onClick={() => setShowDrawer(true)} className="px-4 py-2 text-white rounded-xl transition-colors flex items-center gap-2 bg-brand-500">
                    <PlusCircleIcon className="h-5 w-5" />
                    Add New Medicine
                </button>
            </div>
            
            <MedicineTable />

            { showDrawer &&
                <AddNewBrandDrawer 
                    onClose={() => setShowDrawer(false)}
                />
        }
        </div>
    );
}