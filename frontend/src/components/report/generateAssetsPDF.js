import { jsPDF } from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";

const calculateCenter = (doc, text) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(text);
  const x = (pageWidth - textWidth) / 2;
  return x;
};

const generateResponsiblesPDF = (asset) => {
  const doc = new jsPDF();

  // El titulo
  doc.setFont("helvetica", "bold");
  doc.text(
    "Historial de mantenimientos",
    calculateCenter(doc, "Historial de mantenimientos"),
    20
  );

  // La parte del encabezado del responsable
  doc.setFontSize(10);
  // text, x, y
  doc.setFont("helvetica", "bold");
  doc.text("Código de ingreso:", 10, 30);
  doc.setFont("helvetica", "normal");
  doc.text(asset?.income.cod_inc, 43, 30);
  doc.setFont("helvetica", "bold");
  doc.text("Código de activo:", 10, 40);
  doc.setFont("helvetica", "normal");
  doc.text(asset?.cod_ass, 42, 40);
  doc.setFont("helvetica", "bold");
  doc.text("Número de seríe:", 10, 50); // no hay
  doc.setFont("helvetica", "normal");
  doc.text(asset?.ser_num_ass, 40, 50);

  if (asset?.maintenances?.length === 0) {
    // Si no hay datos
    doc.setFont("helvetica", "normal");
    doc.text(
      "No se encontraron registros de mantenimientos para este activo.",
      calculateCenter(
        doc,
        "No se encontraron registros de mantenimientos para este activo."
      ),
      60
    );
  } else {
    const columns = [
      "Fecha",
      "Código",
      "Tipo",
      "Cédula del responsable", // hice una busqueda pero toca modificar el back para que me lo de
      "Tareas realizadas",
      "Observaciones",
      "Componentes reemplazados",
    ];

    const rows = asset?.maintenances?.map((result) => [
      // Fechas formateadas
      `${
        dayjs.utc(result.created_at).isValid()
          ? dayjs(result.created_at).format("MM-DD-YYYY")
          : "N/A"
      } - ${
        dayjs.utc(result.ended_at).isValid()
          ? dayjs(result.ended_at).format("MM-DD-YYYY")
          : "N/A"
      }`,

      // Otros campos con fallback a "N/A"
      result?.cod_main || "N/A",
      result?.type || "N/A",
      result?.dni_res_main || "N/A",

      // Actividades, observaciones y componentes reemplazados
      (result?.asset?.activities || [])
        .map((a) => `- ${a.act_main}`)
        .join("\n") || "",

      (result?.asset?.observations || [])
        .map((o) => `- ${o.des_obs}`)
        .join("\n") || "",

      (result?.asset?.replaced_components || [])
        .map((c) => `- ${c.nam_com}: ${c.des_rep_com}`)
        .join("\n.") || "",
    ]);

    // Generar la tabla
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 60,
      theme: "grid",
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
    });
  }

  doc.save("reporte.pdf");
};

export default generateResponsiblesPDF;
