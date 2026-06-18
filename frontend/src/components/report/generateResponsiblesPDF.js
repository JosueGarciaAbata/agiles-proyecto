import { jsPDF } from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";

const calculateCenter = (doc, text) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(text);
  const x = (pageWidth - textWidth) / 2;
  return x;
};

const generateResponsiblesPDF = (responsibleData, results, inicio, fin) => {
  console.log("repuesta back", results);

  const doc = new jsPDF();
  console.log("en inicio", inicio);
  console.log("fin", fin);

  // Título
  doc.setFont("helvetica", "bold");
  doc.text(
    "Historial de mantenimientos",
    calculateCenter(doc, "Historial de mantenimientos"),
    20
  );

  // Información del encabezado general
  const responsable = `${responsibleData.nam_res} ${responsibleData.las_res}`;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Cédula:", 10, 30);
  doc.setFont("helvetica", "normal");
  doc.text(responsibleData.dni_res, 25, 30);
  doc.setFont("helvetica", "bold");
  doc.text("Nombre y apellidos:", 10, 40);
  doc.setFont("helvetica", "normal");
  doc.text(responsable, 48, 40);
  doc.setFont("helvetica", "bold");
  doc.text("Mantenimientos desde", 10, 50);
  doc.setFont("helvetica", "normal");
  doc.text(inicio, 50, 50);
  doc.setFont("helvetica", "bold");
  doc.text("hasta", 70, 50);
  doc.setFont("helvetica", "normal");
  doc.text(fin, 83, 50);

  if (results.length === 0) {
    // Mensaje si no hay datos
    doc.setFont("helvetica", "normal");
    doc.text(
      "No se encontraron registros de mantenimientos realizados por este responsable en el período seleccionado.",
      calculateCenter(
        doc,
        "No se encontraron registros de mantenimientos realizados por este responsable en el período seleccionado."
      ),
      60
    );
  } else {
    let currentY = 55;

    results.forEach((result) => {
      // Si el espacio restante es menor que el necesario, agregar una nueva página
      const spaceLeft = doc.internal.pageSize.height - currentY - 20; // Espacio disponible en la página
      if (spaceLeft < 40) {
        // Si el espacio es muy pequeño
        doc.addPage(); // Agrega una nueva página
        currentY = 15; // Reinicia el margen superior en la nueva página
      }

      // Cada encabezado del mantenimiento
      const maintenanceCode = result.cod_main || "N/A";
      doc.setFont("helvetica", "bold");
      doc.text(
        maintenanceCode,
        calculateCenter(doc, maintenanceCode),
        (currentY += 10)
      );

      const maintenanceDate = `${dayjs
        .utc(result.created_at)
        .format(
          "MM-DD-YYYY"
        )} - ${dayjs.utc(result.ended_at).format("MM-DD-YYYY")}`;
      doc.setFont("helvetica", "bold");
      doc.text("Periodo de realización:", 10, (currentY += 10));
      doc.setFont("helvetica", "normal");
      doc.text(maintenanceDate, 60, currentY);
      console.log("fecha de manteminiento", maintenanceDate);

      const maintenanceType = result.type || "N/A";
      doc.setFont("helvetica", "bold");
      doc.text("Tipo de mantenimiento:", 10, (currentY += 10));
      doc.setFont("helvetica", "normal");
      doc.text(maintenanceType, 60, currentY);

      // Columnas del mantenimiento
      const columns = [
        "Código activo",
        "Tareas realizadas",
        "Observaciones",
        "Componentes reemplazados",
      ];

      // Las filas del mantenimiento
      const rows = (result.details || []).map((detail) => [
        detail.asset?.cod_ass || "N/A",
        // Tareas realizadas con viñetas
        (detail.asset?.activities || [])
          .map((a) => `- ${a.act_main}`)
          .join("\n") || "",
        // Observaciones con viñetas
        (detail.asset?.observations || [])
          .map((o) => `- ${o.des_obs}`)
          .join("\n") || "",
        // Componentes reemplazados con viñetas
        (detail.asset?.replaced_components || [])
          .map((c) => `- ${c.nam_com}: ${c.des_rep_com}`)
          .join("\n") || "",
      ]);

      doc.autoTable({
        head: [columns],
        body: rows,
        startY: currentY + 10,
        theme: "grid",
        headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      });

      currentY = doc.lastAutoTable.finalY + 5;
    });
  }

  // Guardar el archivo PDF
  doc.save("reporte.pdf");
};

export default generateResponsiblesPDF;
