import React, { useState, useEffect } from "react";
import Filters from "./Filters";
import axiosInstance from "../../utils/api";
import { getDecodedToken } from "../../utils/authService";

const AssetFilters = ({ onFilterChange }) => {
  const [locations, setLocations] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [devices, setDevices] = useState([]);
  const role = getDecodedToken()?.role;

  useEffect(() => {
    const fetchAll = async () => {
      const [locations, incomes, categories, devices] = await Promise.all([
        axiosInstance.get("/locations"),
        axiosInstance.get("/incomes"),
        axiosInstance.get("/categories/types"),
        axiosInstance.get("/categories/names"),
      ]);

      setLocations(locations.data.results);
      setIncomes(incomes.data.results);
      setCategories(categories.data);
      setDevices(devices.data);
    };

    fetchAll();
  }, []);

  const resultsLocations =
    locations.length > 0
      ? locations.map((location) => ({
          key: location.id,
          label: location.nam_loc,
        }))
      : [{ key: "", label: "No se han encontrado ubicaciones." }];

  const resultsIncomes =
    incomes.length > 0
      ? incomes.map((income) => ({
          key: income.id,
          label: income.cod_inc,
        }))
      : [{ key: "", label: "No se han encontrado ingresos." }];
  const resultsCategories =
    categories.length > 0
      ? categories.map((category) => ({
          key: category,
          label: category,
        }))
      : [{ key: "", label: "No se han encontrado categorias." }];

  const resultsDevices =
    devices.length > 0
      ? devices.map((element) => ({ key: element, label: element }))
      : [{ key: "", label: "No se han encontrado dispositivos." }];

  const optionsStatus = [
    { key: "V", label: "Activos" },
    { key: "H", label: "Ocultos" },
  ];

  const data = [
    { key: "locations", label: "Ubicaciones", options: resultsLocations },
    { key: "incomes", label: "Ingresos", options: resultsIncomes },
    { key: "categories", label: "Categorias", options: resultsCategories },
    { key: "devices", label: "Dispositivos", options: resultsDevices },
    ...(role === "admin"
      ? [{ key: "status", label: "Estado", options: optionsStatus }]
      : []),
  ];

  return (
    <Filters
      data={data}
      onFilterChange={onFilterChange}
      clearFilters={false}
      setClearFilters={() => {}}
    />
  );
};

export default AssetFilters;
