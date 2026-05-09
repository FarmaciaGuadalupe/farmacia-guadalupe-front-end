import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

// Local imports
import { useIntl } from "react-intl";

import SaleTable from "../../tables/BasicTables/SaleTable";
import PageBreadcrumb from "../../common/PageBreadCrumb";
import SalesExportButton from "./SalesExportButton";


export default function Sales() {   
    
    const intl = useIntl();     
    
    return (
        <div className="flex-1">
            <div className="flex items-center justify-between mb-4"> 
                <PageBreadcrumb pageTitle={intl.formatMessage({ id: "transactions" }, { count: 2 })} />
                <div className="mb-6">
                    <SalesExportButton />
                </div>
            </div>
            
            <SaleTable />
        </div>
    );
}