import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

// Local imports
import { useIntl } from "react-intl";
import CellWithDrawer from "../table/CellWithDrawer";
import AddNewBrand from "../table/CustomDrawers/AddNewBrand";
import SupplierTable from "../../tables/BasicTables/SupplierTable";


const AddNewBrandDrawer = ({ onClose }: any) => {

    const intl = useIntl()

    return <CellWithDrawer
        isOpen={true}
        onClose={onClose}
        title={intl.formatMessage({ id: 'supplier.add' })}
        widthClass="w-150"
        >
            <div>
                <AddNewBrand />
            </div>
    </CellWithDrawer>

}

export default function Suppliers() {   
    
    const [showDrawer, setShowDrawer] = useState<boolean>(false)
    const intl = useIntl()
    
    
    return (
        <div className="flex-1">
            <div className="flex justify-end mb-4"> 
                <button onClick={() => setShowDrawer(true)} className="px-4 py-2 text-white rounded-xl transition-colors flex items-center gap-2 bg-brand-500">
                    <PlusCircleIcon className="h-5 w-5" />
                    {intl.formatMessage({ id: 'supplier.add' })}
                </button>
            </div>
            
            <SupplierTable />

            { showDrawer &&
                <AddNewBrandDrawer 
                    onClose={() => setShowDrawer(false)}
                />
        }
        </div>
    );
}