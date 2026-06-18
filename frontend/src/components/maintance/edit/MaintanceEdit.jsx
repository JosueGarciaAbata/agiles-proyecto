import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import MaintanceBaseEdit from "./MaintanceBaseEdit";
import axiosInstance from "../../../utils/api";
import Loader from "../../Loader";
import { useDataContext } from "../../../provider/DataContext";
import { useAssetsContext } from "../../../provider/AssetsContext";

const MaintanceEdit = () => {
  const { id } = useParams();
  const { data } = useDataContext();
  const { visibleAssets } = useAssetsContext();
  const [maintance, setMaintance] = useState();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await axiosInstance.get(`/maintenances/${id}`);
        console.log("que ta", response.data);
        setMaintance(response.data.results);
      } catch (error) {
        toast.error("No se ha podido obtener los datos.");
      }
    };
    fetchAllData();
  }, [id]);

  const resultsTypes =
    data?.typesMaintenances.length > 0
      ? data?.typesMaintenances.map((type) => ({
          value: type.id,
          label: type.typ_main,
        }))
      : [{ key: "", label: "No se han encontrado tipos de mantenimiento..." }];

  const resultsResponsibles =
    data?.responsibles.length > 0
      ? data?.responsibles.map((responsible) => ({
          value: responsible.dni_res,
          label: `${responsible.dni_res} - ${responsible.nam_res} (${responsible.is_ext === "Y" ? "Interno" : "Externo"})`,
        }))
      : [{ key: "", label: "No se han encontrado responsables..." }];

  const fields = [
    { key: "cod_main", label: "Código", type: "text" },
    {
      key: "id_typ_main",
      label: "Tipo de mantenimiento",
      type: "select",
      options: resultsTypes,
    },
    {
      key: "created_at",
      label: "Fecha de inicio",
      type: "date",
    },
    {
      key: "ended_at",
      label: "Fecha fin",
      type: "date",
    },
    {
      key: "dni_res_main",
      label: "Responsable",
      type: "select",
      options: resultsResponsibles,
    },
  ];

  if (!maintance || !data) {
    return <Loader />;
  }

  const formattedMaintance = {
    cod_main: maintance.cod_main,
    created_at: maintance.created_at,
    dni_res_main: maintance.dni_res_main,
    ended_at: maintance.ended_at,
    id_main: maintance.id_main,
    id_typ_main: maintance.id_typ_main,
    is_ext: maintance.is_ext,
    responsible_name: maintance.responsible_name,
    typ_main_name: maintance.typ_main_name,
    vis_main: maintance.vis_main,
    assets: maintance.details,
  };

  return (
    <MaintanceBaseEdit
      maintance={formattedMaintance}
      fields={fields}
      assets={visibleAssets}
    />
  );
};

export default MaintanceEdit;
