import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/api";

// Crea el contexto
const DataContext = createContext();

// Proveedor de datos (DataProvider)
export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    locations: [],
    incomes: [],
    categories: [],
    typesMaintenances: [],
    responsibles: [],
  });
  const [isReady, setIsReady] = useState(false);

  const fetchLocations = async () => {
    const response = await axiosInstance.get("/locations");
    setData((prev) => ({ ...prev, locations: response.data.results }));
  };

  // Este fetch solo trae los incomes abiertos
  const fetchIncomes = async () => {
    const response = await axiosInstance.get("/assets/incomes/create");
    setData((prev) => ({ ...prev, incomes: response.data }));
  };

  const fetchDevices = async () => {
    const response = await axiosInstance.get("/categories");
    setData((prev) => ({ ...prev, categories: response.data.results }));
  };

  const fetchTypeMaintenances = async () => {
    const response = await axiosInstance.get("/type-maintenance");
    setData((prev) => ({ ...prev, typesMaintenances: response.data.results }));
  };

  const fetchResponsibles = async () => {
    const response = await axiosInstance.get("/responsibles");
    setData((prev) => ({ ...prev, responsibles: response.data.results }));
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          fetchLocations(),
          fetchIncomes(),
          fetchDevices(),
          fetchTypeMaintenances(),
          fetchResponsibles(),
        ]);
        setIsReady(true);
        console.log("ya trajo todo");
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <DataContext.Provider value={{ data, isReady }}>
      {children}
    </DataContext.Provider>
  );
};

// Hook para acceder al contexto
export const useDataContext = () => useContext(DataContext);
