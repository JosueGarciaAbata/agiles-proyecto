import { useState, useEffect } from "react";
import Filters from "./Filters";
import axiosInstance from "../../utils/api";
import { useDataContext } from "../../provider/DataContext";

const MaintanceFilters = ({
  onFilterChange,
  clearFilters,
  setClearFilters,
}) => {
  const { data } = useDataContext();
  const [responsibles, setResponsible] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [responsibles, assets] = await Promise.all([
        axiosInstance.get("/responsibles"),
        axiosInstance.get("/maintenance-detail"),
      ]);
      setResponsible(responsibles.data.results);
      setAssets(assets.data.results);
    };

    fetchAll();
  }, []);

  const resultsTypeMaintances =
    data?.typesMaintenances.length > 0
      ? data?.typesMaintenances.map((type) => ({
          key: type.id,
          label: type.typ_main,
        }))
      : [{ key: "", label: "No se han encontrado tipos de mantenimiento" }];

  const resultsResponsibles =
    responsibles.length > 0
      ? responsibles.map((responsible) => ({
          key: `${responsible.dni_res}`,
          label: `${responsible.dni_res} - ${responsible.nam_res}`,
        }))
      : [{ key: "", label: "No se han encontrado responsables" }];

  const resultsAssets =
    assets.length > 0
      ? assets.map((item) => ({
          key: item.asset.id,
          label: item.asset.cod_ass,
        }))
      : [{ key: "", label: "No se han encontrado activos en mantenimientos." }];

  const formattedData = [
    {
      key: "types",
      label: "Tipos de mantenimiento",
      options: resultsTypeMaintances,
    },
    {
      key: "responsibles",
      label: "Responsables",
      options: resultsResponsibles,
    },
    {
      key: "assets",
      label: "Activos en mantenimientos",
      options: resultsAssets,
    },
  ];

  return (
    <Filters
      data={formattedData}
      onFilterChange={onFilterChange}
      clearFilters={clearFilters}
      setClearFilters={setClearFilters}
    />
  );
};

export default MaintanceFilters;
