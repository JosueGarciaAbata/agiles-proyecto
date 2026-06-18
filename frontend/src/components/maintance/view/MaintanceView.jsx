import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MaintanceBaseView from "./MaintanceBaseView";
import { toast } from "react-toastify";
import { CircularProgress, Typography } from "@mui/material";
import axiosInstance from "../../../utils/api";
import dayjs from "dayjs";

const MaintanceView = () => {
  const [maintance, setMaintance] = useState({});
  const [isReady, setIsReady] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/maintenances/${id}`);
      console.log("MANTENIMIENTO", response.data.results);
      setMaintance(response.data.results);
      setIsReady(true);
    } catch (error) {
      toast.error("Error al cargar el mantenimiento");
    }
  };

  const fields = [
    { key: "cod_main", label: "Código" },
    {
      key: "typ_main",
      label: "Tipo de mantenimiento",
    },
    {
      key: "created_at",
      label: "Fecha de inicio",
    },
    {
      key: "ended_at",
      label: "Fecha fin",
    },
    {
      key: "dni_res_main",
      label: "Responsable",
    },
  ];

  const columns = [
    { key: "id", label: "Codigo", showInTable: false },
    { key: "nam_com", label: "Nombre", showInTable: true },
    { key: "des_com", label: "Descripción", showInTable: true },
  ];

  if (!isReady) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
        <Typography variant="subtitle1" sx={{ marginTop: "10px" }}>
          Cargando datos, por favor espera...
        </Typography>
      </div>
    );
  }

  const formattedData = {
    cod_main: maintance.cod_main || "N/A",
    typ_main: maintance?.typ_main_name || "Tipo no definido",
    created_at:
      dayjs(maintance.created_at).utc().format("MM-DD-YYYY") || "Sin fecha",
    ended_at:
      dayjs(maintance.ended_at).utc().format("MM-DD-YYYY") || "Sin fecha",
    dni_res_main:
      maintance.dni_res_main +
        " - " +
        maintance.responsible_name +
        " (" +
        maintance.is_ext +
        ")" || "Sin responsable",
    assets: maintance?.details || [],
  };

  return (
    <MaintanceBaseView data={formattedData} fields={fields} columns={columns} />
  );
};

export default MaintanceView;
