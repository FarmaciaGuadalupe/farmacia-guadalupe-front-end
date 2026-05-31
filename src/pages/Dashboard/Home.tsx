import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { DownloadIcon } from "../../icons";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
	const printRef = useRef<HTMLDivElement>(null);
	const [isExporting, setIsExporting] = useState(false);
	const { user } = useAuth();

	const handleExportPDF = async () => {
		if (!printRef.current) return;

		try {
			setIsExporting(true);
			const element = printRef.current;

			// 1. Capturar el elemento HTML usando html2canvas
			// scale: 2 aumenta la resolución interna del canvas, lo que da un PDF más nítido
			const canvas = await html2canvas(element, {
				scale: 2,
				useCORS: true, // Útil si hay imágenes externas
			});

			// Convertimos el canvas a una URL de imagen base64 (PNG)
			const imgData = canvas.toDataURL("image/png");

			// 2. Inicializar el documento PDF
			// Formato: A4, unidad: milímetros, orientación: horizontal ('l' para landscape)
			const pdf = new jsPDF("l", "mm", "a4");

			// 3. Cálculos matemáticos para ajustar la imagen al PDF (A4 Horizontal) con padding y centrado
			const pdfWidth = pdf.internal.pageSize.getWidth(); // Ancho de A4 horizontal (~297mm)
			const pdfHeight = pdf.internal.pageSize.getHeight(); // Alto de A4 horizontal (~210mm)

			// Definimos un padding interno en milímetros para evitar que pegue en los bordes
			const padding = 15;

			// Dimensiones máximas disponibles para la imagen
			const maxImgWidth = pdfWidth - padding * 2;
			const maxImgHeight = pdfHeight - padding * 2;

			// Calculamos la proporción (ratio) de la imagen generada por html2canvas
			const imgRatio = canvas.width / canvas.height;

			// Intentamos primero ajustar la imagen al ancho máximo disponible
			let finalImgWidth = maxImgWidth;
			let finalImgHeight = finalImgWidth / imgRatio;

			// Si el alto calculado supera el alto disponible en la página,
			// reajustamos todo basándonos en el alto máximo para que no se corte
			if (finalImgHeight > maxImgHeight) {
				finalImgHeight = maxImgHeight;
				finalImgWidth = finalImgHeight * imgRatio;
			}

			// Calculamos las coordenadas X e Y exactas para centrar la imagen en la hoja
			const x = (pdfWidth - finalImgWidth) / 2;
			const y = (pdfHeight - finalImgHeight) / 2;

			// 4. Añadimos la imagen al documento
			// Insertamos la imagen en las coordenadas (x, y) calculadas
			pdf.addImage(imgData, "PNG", x, y, finalImgWidth, finalImgHeight);

			// 5. Descargar el archivo
			pdf.save("reporte_home.pdf");
		} catch (error) {
			console.error("Error al exportar a PDF:", error);
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div className="space-y-4">
			<PageMeta
				title="Dashboard"
				description="Panel de control de Farmacia Guadalupe"
			/>

			{/* Botón para disparar la exportación a PDF */}
			{user?.roleId !== 2 && (
				<div className="flex justify-end mb-4">
					<Button
						variant="outline"
						size="md"
						startIcon={<DownloadIcon />}
						onClick={handleExportPDF}
						disabled={isExporting}
					>
						{isExporting ? "Generando PDF..." : "Exportar a PDF"}
					</Button>
				</div>
			)}

			{/* Contenedor referenciado que será convertido en PDF sin fondo extra */}
			<div ref={printRef} className="space-y-4">
				<MonthlySalesChart />
				<EcommerceMetrics />
			</div>
		</div>
	);
}
