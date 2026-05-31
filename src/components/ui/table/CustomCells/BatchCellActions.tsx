import clsx from "clsx";
import { Button } from "@mui/material";
import { useState, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { EllipsisHorizontalIcon, InboxStackIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

import SimpleModal from "../../../ui/utils/SimpleModal";
import BatchTable from "../../../tables/BasicTables/BatchTable";
import AddNewBatch from "../CustomModels/AddNewBatch";

const showAllBatches = ({ row, onClose }: any) => {
  const { product, name } = row.original ?? [];


    return <SimpleModal
        isOpen={true}
        onClose={onClose}
        title={name}
        widthClass="w-[75%] h-[75%]"
        custom="h-200">
            <BatchTable productId={product?.product_id} />
    </SimpleModal>

}

const AddBatchModal = ({ row, onClose }: any) => {
    const { product } = row.original ?? {};
    return <SimpleModal
        isOpen={true}
        onClose={onClose}
        title="Agregar Nuevo Lote"
        widthClass="w-[50%] h-[75%]">

        <AddNewBatch productId={product?.product_id} onClose={onClose}/>
    
    </SimpleModal>
}

export const BatchCellActions = ({ row }: any) => {

    const [activeItem, setActiveItem] = useState<any>(null)

    const items = [
        {
            showWhen: true,
            label: <><InboxStackIcon className='size-4.5 stroke-1' /><span><FormattedMessage id='batch' values={{count: 2}} /></span></>,
            drawer: showAllBatches,
        },
        {
            showWhen: true,
            label: <><PlusCircleIcon className='size-4.5 stroke-1' /><span><FormattedMessage id='batch.add' /></span></>,
            drawer: AddBatchModal,    
        }
    ]

    const renderItems = items.filter(i => i.showWhen)
    if (renderItems.length === 0)
        return null


    // return <EllipsisHorizontalIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" />;

    return (
        <Fragment>
            <div className='flex justify-center overflow-visible z-[110]'>
                <Menu as='div' className='relative inline-block text-left'>
                    <MenuButton as={Button} className='size-7 rounded-full'>
                        <EllipsisHorizontalIcon className='size-4.5' />
                    </MenuButton>
                    <Transition
                        as={MenuItems}
                        enter="transition ease-out"
                        enterFrom="opacity-0 translate-y-2"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-2"
                        className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0">
                        {
                            renderItems.map((item, index) => (
                                <MenuItem as="div" key={index}>
                                    {({ focus }) => (
                                        <button
                                            className={clsx("flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ", focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100")}
                                            onClick={() => setActiveItem(item)} >
                                            {item.label}
                                        </button>
                                    )}
                                </MenuItem>
                            ))
                        }
                    </Transition>
                </Menu>
            </div>
            {
                activeItem &&
                <activeItem.drawer
                    row={row}
                    onClose={() => setActiveItem(null)} />
            }
        </Fragment>
    )

}