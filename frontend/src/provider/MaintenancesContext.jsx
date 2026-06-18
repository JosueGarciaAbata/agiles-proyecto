// src/provider/MaintenancesContext.js
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { handleErrors } from "../utils/validations";
import axiosInstance from "../utils/api";

const MaintenancesContext = createContext();

export const MaintenancesProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [maintenances, setMaintenances] = useState([]);
  const [term, setTerm] = useState("");
  const [filters, setFilters] = useState({
    types: [],
    responsibles: [],
    assets: [],
    dates: { startDate: null, endDate: null },
  });

  console.log("mantenimientos", maintenances);
  useEffect(() => {
    fetchMaintenances();
    setIsReady(true);
  }, []);

  // Filtro para el search
  const filterMaintenancesByTerm = (searchTerm) => {
    setTerm(searchTerm);
  };

  // Establecer los filtros
  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredMaintenances = useMemo(() => {
    let filtered = [...maintenances];

    // Si no hay filtros mantenimientos y no hay termino de busqueda, devolver todos los mantenimientos originales
    if (
      Object.keys(filters).every((key) => filters[key].length === 0) &&
      !term
    ) {
      return maintenances;
    }

    // Filtrar por busqueda
    if (term) {
      const lowercasedTerm = term.toLocaleLowerCase();
      filtered = filtered.filter((maintenance) =>
        maintenance.cod_main.toLocaleLowerCase().includes(lowercasedTerm)
      );
    }

    // Filtrar por tipos
    if (filters?.types?.length > 0) {
      filtered = filtered.filter((maintenance) =>
        filters.types.includes(maintenance?.type_data.id)
      );
    }

    // Filtrar por responsables
    if (filters?.responsibles?.length > 0) {
      filtered = filtered.filter((maintenance) =>
        filters.responsibles.includes(maintenance?.responsable_data.dni_res)
      );
    }

    // Filtrar por activos
    if (filters?.assets?.length > 0) {
      filtered = filtered.filter((maintenance) =>
        maintenance.assets.some((id) => filters.assets.includes(id))
      );
    }

    // filtrar por fecha
    if (filters?.dates?.startDate && filters?.dates?.endDate) {
      const createdAtInput = filters.dates.startDate;
      const endedAtInput = filters.dates.endDate;

      // Extraemos únicamente la parte de la fecha en formato YYYY-MM-DD
      const startDate = new Date(createdAtInput).toISOString().split("T")[0];
      const endDate = new Date(endedAtInput).toISOString().split("T")[0];

      // Filtrar los mantenimientos
      filtered = filtered.filter((maintenance) => {
        console.log("Mantenimiento", maintenance.cod_main);

        // Extraemos las fechas de los mantenimientos en el mismo formato
        const maintenanceCreatedAt = new Date(maintenance.created_at)
          .toISOString()
          .split("T")[0];
        const maintenanceEndedAt = new Date(maintenance.ended_at)
          .toISOString()
          .split("T")[0];

        return (
          maintenanceCreatedAt >= startDate && maintenanceEndedAt <= endDate
        );
      });
    }
    return filtered;
  }, [maintenances, term, filters]);

  const fetchMaintenances = async () => {
    try {
      const response = await axiosInstance.get("/maintenances");
      setMaintenances(response.data.results);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  // Métodos CRUD para maintenances
  const addMaintenance = async (newMaintenance) => {
    console.log("Creandi", newMaintenance);
    try {
      const response = await axiosInstance.post(
        `/maintenance-detail`,
        newMaintenance
      );
      console.log("ese add", response.data);
      setMaintenances((prev) => [...prev, response.data.results]);
      toast.success("Mantenimiento creado con éxito");
    } catch (error) {
      if (error.response.data.errors) {
        const message = handleErrors(error.response.data.errors).join("\n");
        toast.error(message);
      } else {
        toast.error("Ha ocurrido un error inesperado");
      }
    }
  };

  const updateMaintenance = async (updateMaintenance) => {
    try {
      const response = await axiosInstance.put(
        `/maintenance-detail/${updateMaintenance.id_main}`,
        updateMaintenance
      );
      setMaintenances((prev) =>
        prev.map((maintenance) =>
          maintenance.id === updateMaintenance.id_main
            ? response.data.results
            : maintenance
        )
      );
      toast.success("Mantenimiento actualizado con éxito");
    } catch (error) {
      if (error.response.data.errors) {
        const message = handleErrors(error.response.data.errors).join("\n");
        toast.error(message);
      } else {
        toast.error("Ha ocurrido un error inesperado");
      }
    }
  };

  const deleteMaintenance = async (maintenanceId) => {
    try {
      await axiosInstance.delete(``);
      setMaintenances((prev) =>
        prev.filter((maintenance) => maintenance.id !== maintenanceId)
      );
      toast.success("Mantenimiento eliminado con éxito");
    } catch (error) {
      if (error.response.data.errors) {
        const message = handleErrors(error.response.data.errors).join("\n");
        toast.error(message);
      } else {
        toast.error("Ha ocurrido un error inesperado");
      }
    }
  };

  return (
    <MaintenancesContext.Provider
      value={{
        maintenances,
        filters,
        filterMaintenancesByTerm,
        updateFilters,
        filteredMaintenances,
        isReady,
        addMaintenance,
        updateMaintenance,
        deleteMaintenance,
      }}
    >
      {children}
    </MaintenancesContext.Provider>
  );
};

// Hook para acceder al contexto de assets
export const useMaintenancesContext = () => useContext(MaintenancesContext);
