import MaintanceBaseCreate from "./MaintanceBaseCreate";
import Loader from "../../Loader";
import { useDataContext } from "../../../provider/DataContext";
import { useAssetsContext } from "../../../provider/AssetsContext";

const MaintanceCreate = () => {
  const { data, isReady } = useDataContext();
  const { visibleAssets } = useAssetsContext();

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

  const columns = [
    { key: "id", label: "Codigo", showInTable: false },
    { key: "nam_com", label: "Nombre", showInTable: true },
    { key: "des_com", label: "Descripción", showInTable: true },
  ];

  const defaultState = {
    dni_res_main: "",
    cod_main: "",
    id_typ_main: "",
    vis_main: "V",
    created_at: "",
    ended_at: "",
  };

  if (!isReady) {
    return <Loader />;
  }

  return (
    <MaintanceBaseCreate
      fields={fields}
      columns={columns}
      defaultState={defaultState}
      assets={visibleAssets}
    />
  );
};

export default MaintanceCreate;
