import React from 'react';
import Button from '../ui/button/Button';
import { DownloadIcon } from '../../icons';
import { exportSalesToExcel, SaleNode } from '../../utils/excelUtils';

interface ExportSalesButtonProps {
  sales: SaleNode[];
  loading?: boolean;
}

/**
 * Componente de botón para exportar ventas a Excel.
 * 
 * @param sales Array de ventas obtenidas de la query
 * @param loading Estado de carga (opcional)
 */
const ExportSalesButton: React.FC<ExportSalesButtonProps> = ({ sales, loading = false }) => {
  const handleExport = () => {
    if (sales && sales.length > 0) {
      exportSalesToExcel(sales);
    }
  };

  return (
    <Button
      variant="outline"
      size="md"
      startIcon={<DownloadIcon />}
      onClick={handleExport}
      disabled={loading || !sales || sales.length === 0}
    >
      Exportar a Excel
    </Button>
  );
};

export default ExportSalesButton;
