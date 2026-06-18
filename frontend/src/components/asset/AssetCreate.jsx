import AssetBaseCreate from "./AssetBaseCreate";
import Loader from "../Loader";
import { useDataContext } from "../../provider/DataContext";

const AssetCreate = () => {
  const { data, isReady } = useDataContext();
  const resultsLocations =
    data?.locations.length > 0
      ? data?.locations.map((location) => ({
          value: location.id,
          label: location.nam_loc,
        }))
      : [{ value: "", label: "No se han encontrado ubicaciones..." }];

  const resultsIncomes =
    data?.incomes.length > 0
      ? data?.incomes.map((income) => ({
          value: income.id,
          label: income.cod_inc,
        }))
      : [{ value: "", label: "No se han encontrado ingresos..." }];

  const resultsCategories =
    data?.categories.length > 0
      ? data?.categories.map((category) => ({
          value: category.id,
          label: category.nom_dis,
        }))
      : [{ value: "", label: "No se han encontrado categorias..." }];

  const defaultState = {
    cod_ass: "",
    ser_num_ass: "",
    id_loc_ass: "",
    id_inc_ass: "",
    id_cat_ass: "",
    components: [],
  };

  const fields = [
    { key: "cod_ass", label: "Código", type: "text" },
    { key: "ser_num_ass", label: "Número de serie", type: "text" },
    {
      key: "id_loc_ass",
      label: "Ubicación",
      type: "select",
      options: resultsLocations,
    },
    {
      key: "id_inc_ass",
      label: "Ingreso",
      type: "select",
      options: resultsIncomes,
    },
    {
      key: "id_cat_ass",
      label: "Dispositivo",
      type: "select",
      options: resultsCategories,
    },
  ];

  const columns = [
    { key: "id", label: "Codigo", showInTable: false },
    { key: "nam_com", label: "Nombre", showInTable: true },
    { key: "des_com", label: "Descripción", showInTable: true },
  ];

  if (!isReady) {
    return <Loader />;
  }

  return (
    <AssetBaseCreate
      fields={fields}
      columns={columns}
      defaultState={defaultState}
    />
  );
};

export default AssetCreate;
