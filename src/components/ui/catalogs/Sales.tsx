import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

// Local imports
import { useIntl } from "react-intl";

import SaleTable from "../../tables/BasicTables/SaleTable";
import PageBreadcrumb from "../../common/PageBreadCrumb";


export default function Sales() {   
    
    const intl = useIntl();     
    
    return (
        <div className="flex-1">
            <div className="flex justify-start mb-4"> 
                <PageBreadcrumb pageTitle={intl.formatMessage({ id: "transactions" }, { count: 2 })} />
            </div>
            
            <SaleTable />
        </div>
    );
}