import clsx from "clsx";
import { Button } from "@mui/material";
import { useState, Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { EllipsisHorizontalIcon, PencilSquareIcon, UserMinusIcon } from "@heroicons/react/24/outline";

import CellWithDrawer from "../CellWithDrawer";
import SimpleModal from "../../../ui/utils/SimpleModal";



const EditUserDrawer = ({ row, onClose }: any) => {

    const intl = useIntl()

    return <CellWithDrawer
        isOpen={true}
        onClose={onClose}

        title={intl.formatMessage({ id: 'edit_user' })}>

        <h1>test</h1>
    </CellWithDrawer>

}

const DeactivateUserModal = ({ row, onClose }: any) => {
    const intl = useIntl();
    return <SimpleModal
        isOpen={true}
        onClose={onClose}
        title={intl.formatMessage({ id: "confirm_action_message" })}
    >
        {/* aqui se puede poner cualquier componente dentro, por ejemplo un formulario o un mensaje de confirmación */}

        <p><FormattedMessage id="employee.confirm_save" /></p>

        <div className="mt-6 flex justify-end gap-3">
            {/* <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button> */}
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
                <FormattedMessage id="save" />
            </button>
        </div>
    </SimpleModal>
}

export const EmployeeCellActions = ({ row }: any) => {

    const [activeItem, setActiveItem] = useState<any>(null)

    const items = [
        {
            showWhen: true,
            label: <><PencilSquareIcon className='size-4.5 stroke-1' /><span><FormattedMessage id='edit' /></span></>,
            drawer: EditUserDrawer,
        },
        {
            showWhen: true,
            label: <><UserMinusIcon className='size-4.5 stroke-1' /><span><FormattedMessage id='deactivate_user' /></span></>,
            drawer: DeactivateUserModal,    
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