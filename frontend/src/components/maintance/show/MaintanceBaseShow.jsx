import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getDecodedToken } from "../../../utils/authService";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import SearchBar from "../../../generic/SearchBar";
import AddIcon from "@mui/icons-material/Add";
import GenericStyles from "../../../generic/styles/GenericStyles";
import dayjs from "dayjs";
import ReusableDatePicker from "../../report/ReusableDatePicker";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import tableStyles from "../../../generic/styles/TableStyles";
import axiosInstance from "../../../utils/api";
import MaintanceFilters from "../../../generic/filters/MaintanceFilters";
import GenericTable from "../../GenericTable";
import { useMaintenancesContext } from "../../../provider/MaintenancesContext";
import Loader from "../../Loader";

const MaintanceBaseShow = ({ columns }) => {
  const navigate = useNavigate();
  const {
    filterMaintenancesByTerm,
    filters,
    updateFilters,
    filteredMaintenances,
    isReady,
  } = useMaintenancesContext();
  const [isDelete, setIsDelete] = useState(false);
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
  });
  const [errors, setErrors] = useState({
    startDate: false,
    endDate: false,
  });
  const [clearFilters, setClearFilters] = useState(false);

  useEffect(() => {
    return () => {
      filterMaintenancesByTerm("");
    };
  }, [navigate]);

  const onCreate = () => {
    navigate("/dashboard/maintance/create");
  };

  const onView = (id) => {
    navigate(`/dashboard/maintance/view/${id}`);
  };

  const onEdit = (id) => {
    navigate(`/dashboard/maintance/edit/${id}`);
  };

  const onFetch = (searchTerm) => {
    filterMaintenancesByTerm(searchTerm);
  };

  const handleFilterChange = async (updatedFilters) => {
    if (!updatedFilters || Object.keys(updatedFilters).length === 0) {
      updateFilters({
        types: [],
        responsibles: [],
        assets: [],
        dates: { startDate: null, endDate: null },
      });
      setFormData({ startDate: null, endDate: null });
      return;
    }

    // Procesar otros filtros (tipos, responsables, activos)
    const formattedData = buildFilterPayload(updatedFilters);

    if (!formData.startDate || !formData.endDate) {
      setFormData({ startDate: null, endDate: null });
    }

    // Si ambas fechas están definidas, agregar a los filtros
    if (formData.startDate && formData.endDate) {
      updateFilters({
        ...formattedData,
        dates: { startDate: formData.startDate, endDate: formData.endDate },
      });
    } else {
      // Si alguna fecha no está definida, incluir las fechas como null
      updateFilters({
        ...formattedData,
        dates: { startDate: null, endDate: null },
      });
    }
  };

  const buildFilterPayload = (updatedFilters) => {
    // Procesar los filtros y extraer solo los keys de cada array
    const processFilter = (filterArray) => {
      if (!filterArray || filterArray.length === 0) return [];
      return filterArray.map((item) => item.key); // Extraer los valores "key"
    };

    // Retornar un objeto con los filtros procesados
    return {
      types: processFilter(updatedFilters.types),
      responsibles: processFilter(updatedFilters.responsibles),
      assets: processFilter(updatedFilters.assets),
      dates: { startDate: null, endDate: null },
    };
  };

  const handleFilterDate = async () => {
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Obtener los filtros actuales
    const currentFilters = { ...filters };

    // Actualizar solo el filtro de fechas sin sobrescribir otros filtros
    const updatedFilters = {
      ...currentFilters,
      dates: formData, // solo actualizar las fechas
    };

    console.log("La fecha es", updatedFilters);

    updateFilters(updatedFilters);
  };

  const handleReset = () => {
    handleFilterChange({});
    setErrors({
      startDate: false,
      endDate: false,
    });
    setClearFilters(true);
    return;
  };
  const handleStartDate = (date) => {
    const transformedDate = transformDate(date);
    setFormData((prev) => ({ ...prev, startDate: transformedDate }));
    setErrors((prev) => ({ ...prev, startDate: "" }));
  };
  const handleEndDate = (date) => {
    const transformedDate = transformDate(date);
    setFormData((prev) => ({ ...prev, endDate: transformedDate }));
    setErrors((prev) => ({ ...prev, endDate: "" }));
  };

  const transformDate = (date) => {
    try {
      return date ? dayjs(date).utc().format("YYYY-MM-DDTHH:mm:ss[Z]") : null;
    } catch (error) {
      return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.startDate || formData.startDate.trim() === "") {
      newErrors.startDate = "Ingrese una fecha de inicio válida";
    }

    if (!formData.endDate || formData.endDate.trim() === "") {
      newErrors.endDate = "Ingrese una fecha de fin válida";
    }

    if (formData.startDate && formData.endDate) {
      const start = dayjs(formData.startDate);
      const end = dayjs(formData.endDate);

      if (start.isAfter(end)) {
        newErrors.startDate =
          "La fecha de inicio no puede ser mayor que la fecha de fin";
        newErrors.endDate =
          "La fecha de fin no puede ser menor que la fecha de inicio";
      }
    }

    return newErrors;
  };

  if (!isReady) {
    return <Loader />;
  }

  const formattedData = filteredMaintenances.map((maintance) => {
    return {
      id: maintance.id,
      cod_main: maintance.cod_main,
      created_at: dayjs(maintance.created_at).utc().format("MM-DD-YYYY"),
      ended_at: dayjs(maintance.ended_at).utc().format("MM-DD-YYYY"),
      responsable: maintance.responsable,
      type: maintance.type,
      vis_main: maintance.vis_main,
    };
  });

  return (
    <div
      className="flexColumnCenter"
      style={{ width: "90%", marginTop: "40px" }}
    >
      <Box className="flewColumnCenter">
        <Box
          className="flexRowCenterEnd"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {/* Fila 1 */}
          <Box
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <h2 style={{ marginRight: "20px" }}>Mantenimientos</h2>

            <Button
              onClick={onCreate}
              variant="contained"
              sx={GenericStyles.buttonStyle}
              startIcon={<AddIcon />}
            >
              Agregar mantenimiento
            </Button>
          </Box>

          {/* Fila 2 */}
          <Box
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: "16px",
            }}
          >
            <SearchBar placeholder={`Buscar por código`} onSearch={onFetch} />
            <MaintanceFilters
              onFilterChange={handleFilterChange}
              clearFilters={clearFilters}
              setClearFilters={setClearFilters}
            />
          </Box>

          <Box
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: "16px",
              marginTop: "1rem",
            }}
          >
            <ReusableDatePicker
              label="Fecha de inicio"
              value={formData["startDate"]}
              onChange={(date) => handleStartDate(date)}
              error={!!errors.startDate}
              helperText={errors.startDate}
            />
            <ReusableDatePicker
              label="Fecha fin"
              value={formData["endDate"]}
              onChange={(date) => handleEndDate(date)}
              error={!!errors.endDate}
              helperText={errors.endDate}
            />
            <Button variant="contained" onClick={handleFilterDate}>
              Aplicar filtro
            </Button>{" "}
            <Button variant="contained" onClick={handleReset}>
              Resetear filtros
            </Button>
          </Box>
        </Box>
      </Box>
      {/* Fin del box */}

      {isReady ? (
        <Box className="flexColumnCenter" paddingTop="20px">
          {formattedData?.length > 0 ? (
            <>
              <GenericTable
                data={formattedData}
                dataCount={formattedData.length}
                isDelete={isDelete}
                setIsDelete={setIsDelete}
              >
                {(currentPageData) => (
                  <>
                    <TableHead sx={tableStyles.tableHead}>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell key={column.key}>{column.label}</TableCell>
                        ))}
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentPageData.map((item) => (
                        <TableRow key={item.id}>
                          {columns.map((column) => (
                            <TableCell key={column.key}>
                              {item[column.key]}
                            </TableCell>
                          ))}
                          <TableCell align="center">
                            <IconButton
                              onClick={() => onView(item.id)}
                              color="primary"
                            >
                              <Tooltip title="Ver">
                                <VisibilityIcon />
                              </Tooltip>
                            </IconButton>

                            <IconButton
                              onClick={() => onEdit(item.id)}
                              color="primary"
                            >
                              <Tooltip title="Editar">
                                <EditIcon />
                              </Tooltip>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </>
                )}
              </GenericTable>
            </>
          ) : (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              No hay mantenimientos registrados.
            </div>
          )}
        </Box>
      ) : (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      )}

      {/* Fin table */}
    </div>
  );
};

export default MaintanceBaseShow;
