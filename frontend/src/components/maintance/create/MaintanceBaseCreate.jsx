import React, { useState } from "react";
import {
  Box,
  Grid2,
  Typography,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import ClearIcon from "@mui/icons-material/Clear";

import {
  validateField,
  validateFields,
  handleErrors,
} from "../../../utils/validations";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/api";
import tableStyles from "../../../generic/styles/TableStyles";
import DynamicField from "../../../generic/DynamicField";
import AssetSelector from "./AssetSelector";
import ActivitiesModal from "./ActivitiesModal";
import ObservationsModal from "./ObservationsModal";
import ComponentsModal from "./ComponentsModal";
import CreateStyles from "../../../generic/styles/CreateStyles";
import { useNavigate } from "react-router-dom";
import { useMaintenancesContext } from "../../../provider/MaintenancesContext";
import GenericTable from "../../GenericTable";

const MaintanceBaseCreate = ({ fields, columns, defaultState, assets }) => {
  const { addMaintenance } = useMaintenancesContext();
  const [entity, setEntity] = useState(defaultState);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [assetsTable, setAssetsTable] = useState([]);
  const [activitiesCatalog, setActivitiesCatalog] = useState([]);
  const [componentsCatalog, setComponentsCatalog] = useState([]);
  const [openActivities, setOpenActivities] = useState(false);
  const [openObservations, setOpenObservations] = useState(false);
  const [openComponents, setOpenComponents] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDelete, setIsDelete] = useState(false);
  const navigate = useNavigate();

  const handleFieldChange = (key, value) => {
    setEntity((prev) => ({ ...prev, [key]: value }));

    if (
      key === "id_typ_main" &&
      value !== entity.id_typ_main &&
      assetsTable.length > 0
    ) {
      setAssetsTable([]);
      setActivitiesCatalog([]);
      setComponentsCatalog([]);
      toast.info(
        "Lista de activos reiniciada debido al cambio de tipo de mantenimiento."
      );
    }

    const errorMessage = validateField(key, value);
    setErrors((prevErrors) => ({ ...prevErrors, [key]: errorMessage }));
  };

  const handleAddAsset = (asset) => {
    // Tiene que haber seleccionado un tipo de mantenimiento antes de añadir algun activo.
    if (!entity.id_typ_main) {
      toast.info(
        "Debe seleccionar un tipo de mantenimiento antes de añadir un activo."
      );
      return;
    }

    if (assetsTable.some((row) => row.id === asset.id)) {
      toast.info("El activo ya ha sido agregado a la tabla.");
      return;
    }

    const updatedAsset = {
      ...asset,
      activities: [],
      observations: [],
      replaced_components: [],
      isAdded: true,
    };

    setAssetsTable((prev) => [...prev, updatedAsset]);
  };

  // Actividades
  const onOpenActivities = async (assetId) => {
    // Si ya añadio un tipo de mantenimiento, cargar las actividades de ese mantenimiento.
    try {
      const id = entity.id_typ_main;
      const response = await axiosInstance.get(`/type-maintenance/${id}`);
      setActivitiesCatalog(response.data.results.activities);
      const asset = assetsTable.find((item) => item.id === assetId);
      setCurrentAsset(asset);
      setOpenActivities(true);
    } catch (error) {
      toast.error("No se ha podido obtener las actividades.");
    }
  };

  const onSaveActivities = (activityList) => {
    setAssetsTable((prev) =>
      prev.map((asset) =>
        asset.id === currentAsset.id
          ? { ...asset, activities: activityList }
          : asset
      )
    );
    setOpenActivities(false);
  };

  // Observaciones
  const onOpenObservations = (assetId) => {
    const asset = assetsTable.find((item) => item.id === assetId);
    setCurrentAsset(asset);
    setOpenObservations(true);
  };

  const onSaveObservations = (observationsList) => {
    setAssetsTable((prev) =>
      prev.map((asset) =>
        asset.id === currentAsset.id
          ? { ...asset, observations: observationsList }
          : asset
      )
    );
    setOpenObservations(false);
  };

  // Componentes
  const onOpenComponents = async (id) => {
    // Cargar los datos del catalogo de activo seleccionado.
    try {
      const response = await axiosInstance.get(
        `/assets/showForMaintenances/${id}`
      );
      setComponentsCatalog(response.data.components);
      const asset = assetsTable.find((item) => item.id === id);
      setCurrentAsset(asset);
      setOpenComponents(true);
    } catch (error) {
      toast.error("No se ha podido obtener los componentes.");
    }
  };

  const onSaveComponents = (componentsList) => {
    setAssetsTable((prev) =>
      prev.map((asset) =>
        asset.id === currentAsset.id
          ? { ...asset, replaced_components: componentsList }
          : asset
      )
    );

    setOpenComponents(false);
  };

  // Eliminar el activo de la tabla.
  const deleteRow = (id) => {
    setAssetsTable((prev) => prev.filter((asset) => asset.id !== id));
  };

  // Botones de cerrar
  const onCloseActivities = () => setOpenActivities(false);
  const onCloseObservations = () => setOpenObservations(false);
  const onCloseComponents = () => setOpenComponents(false);

  // Acciones para la api
  const handleReturn = () => {
    navigate("/dashboard/maintance");
  };

  const validateAll = () => {
    const validationErrors = validateFields(entity, fields);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleCreate = async () => {
    if (assetsTable.length === 0) {
      toast.error("Debe agregar al menos un activo");
    }

    if (validateAll()) {
      const hasMissingActivities = assetsTable.some(
        (asset) => asset.activities.length === 0
      );

      if (hasMissingActivities) {
        toast.error(
          "Todos los activos deben tener al menos una actividad asignada."
        );
        return;
      }

      try {
        const formatted = assetsTable.map((item) => ({
          ...item,
          activities: item.activities.map((activity) => activity.id),
        }));

        console.log("que se envia", formatted);

        const dataToSend = {
          ...entity,
          assets: formatted,
        };
        addMaintenance(dataToSend);
        navigate("/dashboard/maintance");
      } catch (error) {
        if (error.response.data.errors) {
          const message = handleErrors(error.response.data.errors).join("\n");
          toast.error(message);
        } else {
          toast.error("Ha ocurrido un error inesperado");
        }
      }
    }
  };

  const handleFetch = (key, value) => {};

  return (
    <>
      <Typography
        variant="h6"
        color="#6068A5"
        marginBottom="20px"
        marginTop="20px"
        fontWeight="bold"
      >
        Crear mantenimiento
      </Typography>
      <Box p={3} border="1px solid #ddd" width="90%" borderRadius={2}>
        <Grid2 container spacing={3}>
          {fields.map((field) => (
            <Grid2 item size={{ xs: 12, sm: 6, md: 6 }} key={field.key}>
              {/* Título del campo */}
              <Typography
                variant="subtitle1"
                width="100%"
                color="#6068A5"
                fontWeight="bold"
              >
                {field.label}
              </Typography>
              {/* Campo dinámico */}
              <DynamicField
                key={field.key}
                field={field}
                value={entity[field.key]}
                onChange={handleFieldChange}
                onFetch={handleFetch}
                error={errors[field.key]}
                helperText={errors[field.key]}
                readOnly={false}
              />
            </Grid2>
          ))}
          <Grid2 item size={{ xs: 12, sm: 6, md: 6 }} key="assetsSelector">
            <AssetSelector data={assets} onAdd={handleAddAsset} />
          </Grid2>
        </Grid2>

        <Box marginTop="30px">
          {assetsTable.length > 0 ? (
            <>
              <GenericTable
                data={assetsTable}
                dataCount={assetsTable.length}
                setIsDelete={setIsDelete}
                isDelete={isDelete}
              >
                {(currentPageData) => (
                  <>
                    <TableHead sx={tableStyles.tableHead}>
                      <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>Número de serie</TableCell>
                        <TableCell>Actividades</TableCell>
                        <TableCell>Observaciones</TableCell>
                        <TableCell>Componenes a reemplazar</TableCell>
                        <TableCell>{""}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentPageData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.cod_ass}</TableCell>
                          <TableCell>{row.ser_num_ass}</TableCell>
                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                              fontSize: "0.875rem",
                            }}
                          >
                            {row.activities.length}{" "}
                            {row.activities.length === 1
                              ? "Actividad"
                              : "Actividades"}
                            <IconButton
                              onClick={() => onOpenActivities(row.id)}
                              arial-label="abrir"
                            >
                              <PlaylistAddIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                              fontSize: "0.875rem",
                            }}
                          >
                            {row.observations.length}{" "}
                            {row.observations.length === 1
                              ? "Observación"
                              : "Observaciones"}
                            <IconButton
                              onClick={() => onOpenObservations(row.id)}
                              arial-label="abrir"
                            >
                              <PlaylistAddIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                              fontSize: "0.875rem",
                            }}
                          >
                            {row.replaced_components.length}{" "}
                            {row.replaced_components.length === 1
                              ? "Componente"
                              : "Componentes"}
                            <IconButton
                              onClick={() => onOpenComponents(row.id)}
                              arial-label="abrir"
                            >
                              <PlaylistAddIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={() => deleteRow(row.id)}>
                              <ClearIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </>
                )}
              </GenericTable>
            </>
          ) : null}
        </Box>
      </Box>

      <Box
        width="90%"
        marginTop="20px"
        display="flex"
        justifyContent="flex-end"
      >
        <Button
          color="primary"
          sx={CreateStyles.buttonStyle2}
          onClick={handleReturn}
        >
          Cancelar
        </Button>
        <Button
          color="primary"
          sx={CreateStyles.buttonStyle2}
          onClick={handleCreate}
        >
          Guardar
        </Button>
      </Box>

      <ActivitiesModal
        open={openActivities}
        onSave={onSaveActivities}
        onClose={onCloseActivities}
        catalog={activitiesCatalog}
        currentActivities={currentAsset?.activities || []}
      />

      <ObservationsModal
        open={openObservations}
        onSave={onSaveObservations}
        onClose={onCloseObservations}
        currentObservations={currentAsset?.observations || []}
      />

      <ComponentsModal
        open={openComponents}
        onSave={onSaveComponents}
        onClose={onCloseComponents}
        catalog={componentsCatalog}
        currentComponents={currentAsset?.replaced_components || []}
      />
    </>
  );
};

export default MaintanceBaseCreate;
