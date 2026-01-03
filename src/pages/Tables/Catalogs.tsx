// src/pages/Tables/BasicTables.tsx

import { Fragment } from "react";
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { FormattedMessage, useIntl } from "react-intl";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// ComponentCard y PageMeta no se estaban usando en el snippet original, 
// pero los dejo por si los necesitas.
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import EmployeeTable from "../../components/tables/BasicTables/EmployeeTable";
import BrandsTable from "../../components/tables/BasicTables/BrandsTable";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Catalogs() {
  const intl = useIntl();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Definición de los datos
  const items = [
    { label: <FormattedMessage id="brands" values={{ count: 2 }}/>, content: <BrandsTable/> },
    { label: <FormattedMessage id="employees" values={{ count: 1 }}/>, content: <EmployeeTable/> },
    { label: <FormattedMessage id="categories" values={{ count: 1 }}/>, content: 'Contenido del Item Three' },
    { label: <FormattedMessage id="categories" values={{ count: 1 }}/>, content: 'Contenido del Item Three' },
    { label: <FormattedMessage id="categories" values={{ count: 1 }}/>, content: 'Contenido del Item Three' },
    { label: <FormattedMessage id="categories" values={{ count: 1 }}/>, content: 'Contenido del Item Three' },
    { label: <FormattedMessage id="categories" values={{ count: 1 }}/>, content: 'Contenido del Item Three' },
    { label: 'Item Three', content: 'Contenido del Item Three' },
    // Puedes agregar más items aquí fácilmente
  ];

  return (
    <Fragment>
      <PageBreadcrumb pageTitle={intl.formatMessage({ id: "catalogs" }, { count: 2 })} />

      <div
        className={`rounded-2xl border border-gray-200 bg-slate-50 dark:border-gray-800 dark:bg-white/[0.03] p-4`}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            {/* Renderizado dinámico de las Pestañas (Tabs) */}
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              aria-label="scrollable auto tabs example">
              {items.map((item, index) => (
                <Tab
                  key={index}
                  label={item.label}
                  {...a11yProps(index)}
                />
              ))}
            </Tabs>
          </Box>

          {/* Renderizado dinámico del Contenido (Panels) */}
          {items.map((item, index) => (
            <CustomTabPanel key={index} value={value} index={index}>
              {item.content}
            </CustomTabPanel>
          ))}
        </Box>
      </div>
    </Fragment>
  );
}