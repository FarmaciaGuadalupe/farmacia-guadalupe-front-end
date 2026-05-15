import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { nicaDate } from "./dateUtils";

export interface SaleSummaryItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
  presentation: string;
}

export interface SaleSummary {
  receiptNumber: string;
  receiptType: string;
  date: Date;
  customer: string;
  items: SaleSummaryItem[];
  subtotal: number;
  iva: number;
  grandTotal: number;
  totalPaid: number;
  changeDue: number;
}

export const generateSaleVoucherPDF = (saleData: SaleSummary, openInNewWindow: boolean = true) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text("Farmacia Guadalupe", 105, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.text(`Comprobante de Venta: ${saleData.receiptType}`, 105, 28, { align: "center" });
  
  doc.setFontSize(10);
  doc.text(`Nro: ${saleData.receiptNumber}`, 14, 40);
  doc.text(`Fecha: ${nicaDate(saleData.date).format("DD/MM/YYYY hh:mm A")}`, 14, 46);
  doc.text(`Cliente: ${saleData.customer}`, 14, 52);

  const tableColumn = ["Cant", "Descripción", "Presentación", "P.Unitario", "Total"];
  const tableRows: string[][] = [];

  saleData.items.forEach(item => {
    const itemData = [
      item.quantity.toString(),
      item.name,
      item.presentation,
      `C$ ${item.price.toFixed(2)}`,
      `C$ ${item.total.toFixed(2)}`
    ];
    tableRows.push(itemData);
  });

  autoTable(doc, {
    startY: 60,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 60;

  doc.setFontSize(10);
  doc.text(`Subtotal: C$ ${saleData.subtotal.toFixed(2)}`, 140, finalY + 10);
  doc.text(`IVA (15%): C$ ${saleData.iva.toFixed(2)}`, 140, finalY + 16);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total: C$ ${saleData.grandTotal.toFixed(2)}`, 140, finalY + 24);
  doc.setFont("helvetica", "normal");
  
  doc.setFontSize(10);
  doc.text(`Pagado: C$ ${saleData.totalPaid.toFixed(2)}`, 140, finalY + 32);
  doc.text(`Cambio: C$ ${Math.abs(saleData.changeDue).toFixed(2)}`, 140, finalY + 38);

  doc.text("¡Gracias por su compra!", 105, finalY + 50, { align: "center" });

  if (openInNewWindow) {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } else {
    doc.save(`voucher_${saleData.receiptNumber}.pdf`);
  }
};
