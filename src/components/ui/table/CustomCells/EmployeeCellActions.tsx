import clsx from "clsx";
import { gql } from "@apollo/client";
import { Button } from "@mui/material";
import { useState, Fragment } from "react";
import { useMutation } from "@apollo/client/react";
import { FormattedMessage, useIntl } from "react-intl";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { EllipsisHorizontalIcon, PencilSquareIcon, MinusCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

import EditEmployeeDrawer from "../CustomDrawers/EditEmployeeDrawer";
import SimpleModal from "../../../ui/utils/SimpleModal";

const TOGGLE_EMPLOYEE_STATUS_MUTATION = gql`
  mutation ToggleEmployeeStatus($employeeId: Int!) {
    toggleEmployeeStatus(employeeId: $employeeId) {        
      message
    }
  }
`;

const ToggleActivatedModal = ({ row, onClose }: any) => {
  const intl = useIntl();
  const { employeeId, employeeStatusId, names } = row.original;
  const isActive = employeeStatusId === 1;

  const [toggleStatus, { loading }] = useMutation(TOGGLE_EMPLOYEE_STATUS_MUTATION, {
    refetchQueries: ["GetEmployees"], 
    onCompleted: () => onClose(),
  });

  const handleConfirm = () => {
    toggleStatus({
      variables: {
        employeeId: parseInt(employeeId),
      },
    });
  };

  return (
    <SimpleModal
      isOpen={true}
      onClose={onClose}
      title={
        intl.formatMessage({ id: isActive ? "deactivate" : "activate" }) +
        ` ${names}`
      }
    >
      <p>{intl.formatMessage({ id: "confirm_action_message" })}</p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          disabled={loading}
        >
          <FormattedMessage id="cancel" />
        </button>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className={clsx(
            "px-4 py-2 text-white rounded transition-colors flex items-center gap-2",
            isActive
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700",
            loading && "opacity-70 cursor-not-allowed",
          )}
        >
          {loading ? (
            <span><FormattedMessage id="common.processing" /></span>
          ) : isActive ? (
            <FormattedMessage id="deactivate" />
          ) : (
            <FormattedMessage id="activate" />
          )}
        </button>
      </div>
    </SimpleModal>
  );
};

const SetStatusLevel = ({ isActive }: { isActive: boolean }) => {
  return isActive ? (
    <Fragment>
      <span className="text-red-600 flex items-center gap-2">
        <MinusCircleIcon className="size-4.5 stroke-1" />
        <FormattedMessage id="deactivate" />
      </span>
    </Fragment>
  ) : (
    <Fragment>
      <span className="text-green-600 flex items-center gap-2">
        <CheckCircleIcon className="size-4.5 stroke-1" />
        <FormattedMessage id="activate" />
      </span>
    </Fragment>
  );
};

export const EmployeeCellActions = ({ row }: any) => {
  const { original } = row;
  const { employeeStatusId } = original;
  const isActive = employeeStatusId === 1;
  const [activeItem, setActiveItem] = useState<any>(null);

  const items = [
    {
      showWhen: true,
      label: (
        <Fragment>
          <PencilSquareIcon className="size-4.5 stroke-1" />
          <span>
            <FormattedMessage id="edit" />
          </span>
        </Fragment>
      ),
      type: 'drawer',
    },
    {
      showWhen: true,
      label: <SetStatusLevel isActive={isActive} />,
      type: 'modal',
    },
  ];

  const renderItems = items.filter((i) => i.showWhen);
  if (renderItems.length === 0) return null;

  return (
    <Fragment>
      <div className="flex justify-center overflow-visible z-[110]">
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton as={Button} className="size-7 rounded-full">
            <EllipsisHorizontalIcon className="size-4.5" />
          </MenuButton>
          <Transition
            as={MenuItems}
            enter="transition ease-out"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
            className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0"
          >
            {renderItems.map((item, index) => (
              <MenuItem as="div" key={index}>
                {({ focus }) => (
                  <button
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                      focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                    onClick={() => setActiveItem(item)}
                  >
                    {item.label}
                  </button>
                )}
              </MenuItem>
            ))}
          </Transition>
        </Menu>
      </div>
      
      {activeItem?.type === 'drawer' && (
        <EditEmployeeDrawer 
          isOpen={true} 
          onClose={() => setActiveItem(null)} 
          row={row} 
        />
      )}

      {activeItem?.type === 'modal' && (
        <ToggleActivatedModal 
          row={row} 
          onClose={() => setActiveItem(null)} 
        />
      )}
    </Fragment>
  );
};
