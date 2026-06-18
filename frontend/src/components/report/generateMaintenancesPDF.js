import { jsPDF } from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";

const calculateX = (doc, text) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(text);
  const x = (pageWidth - textWidth) / 2;
  return x;
};

const generateMaintenancesPDF = (results) => {
  const doc = new jsPDF();

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(
    "Reporte de Cumplimiento de Mantenimientos Obligatorios",
    calculateX(doc, "Reporte de Cumplimiento de Mantenimientos Obligatorios"),
    20
  );

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");

  let startY = 30; // Punto inicial para el contenido

  doc.text("Cumplidos", 10, startY);
  // Sección de cumplidos
  if (results.cumplidos.assets.length === 0) {
    startY += 10;
    doc.setFont("helvetica", "normal");
    doc.text("No se encontraron activos para evaluar", 10, startY);
    doc.setFont("helvetica", "bold");
  } else {
    startY += 10;

    results.cumplidos.assets.forEach((item) => {
      const date = dayjs.utc(item.fechaAdquisicion).format("MM/DD/YYYY");
      // Encabezado
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Fecha de Adquisición: ${date || "N/A"}`, 10, startY);
      doc.setFont("helvetica", "bold");
      startY += 5;

      // Tabla
      const añosHeader = Object.keys(item.mantenimientos);
      doc.autoTable({
        head: [["Código", "Número de serie", ...añosHeader]],
        body: [
          [
            item.codigo,
            item.serie,
            ...añosHeader.map((año) =>
              item.mantenimientos[año] === "Sí" ? "Realizado" : "Por realizar"
            ),
          ],
        ],
        startY: startY,
        theme: "grid",
        headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      });

      startY = doc.lastAutoTable?.finalY
        ? doc.lastAutoTable.finalY + 10
        : startY + 10;
    });
  }

  // Sección en proceso
  startY += 15; // Espaciado para separar secciones
  doc.text("En proceso", 10, startY);

  if (results.en_proceso.assets.length === 0) {
    startY += 10;
    doc.setFont("helvetica", "normal");
    doc.text("No se han encontrado activos en proceso", 10, startY);
    doc.setFont("helvetica", "bold");
  } else {
    startY += 13;

    results.en_proceso.assets.forEach((item) => {
      const date = dayjs.utc(item.fechaAdquisicion).format("MM/DD/YYYY");
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Fecha de Adquisición: ${date || "N/A"}`, 10, startY);
      doc.setFont("helvetica", "bold");
      startY += 5;

      const añosHeaders = Object.keys(item.mantenimientos);
      doc.autoTable({
        head: [["Código", "Número de serie", ...añosHeaders]],
        body: [
          [
            item.codigo,
            item.serie,
            ...añosHeaders.map((año) =>
              item.mantenimientos[año] === "Sí" ? "Realizado" : "Por realizar"
            ),
          ],
        ],
        startY: startY,
        theme: "grid",
        headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      });

      startY = doc.lastAutoTable?.finalY
        ? doc.lastAutoTable.finalY + 10
        : startY + 10;
    });
  }

  // Inconclusos
  startY += 10; // Espaciado para separar secciones
  doc.setFont("helvetica", "bold");
  doc.text("Inconclusos", 10, startY);

  if (results.inconclusos.assets.length === 0) {
    startY += 10;
    doc.setFont("helvetica", "normal");
    doc.text("No se han encontrado activos inconclusos", 10, startY);
    doc.setFont("helvetica", "bold");
  } else {
    startY += 13;

    results.inconclusos.assets.forEach((item) => {
      const date = dayjs.utc(item.fechaAdquisicion).format("MM/DD/YYYY");

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Fecha de Adquisición: ${date || "N/A"}`, 10, startY);
      doc.setFont("helvetica", "bold");

      startY += 5;

      const añosHeaders = Object.keys(item.mantenimientos);
      doc.autoTable({
        head: [["Código", "Número de serie", ...añosHeaders]],
        body: [
          [
            item.codigo,
            item.serie,
            ...añosHeaders.map((año) => {
              const estado = item.mantenimientos[año];
              if (estado === "Sí") return "Realizado";
              if (estado === "No") return "Por realizar";
              return "Sin realizar";
            }),
          ],
        ],
        startY: startY,
        theme: "grid",
        headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      });

      startY = doc.lastAutoTable?.finalY
        ? doc.lastAutoTable.finalY + 10
        : startY + 10;
    });
  }

  doc.save("reporte.pdf");
};

export default generateMaintenancesPDF;
