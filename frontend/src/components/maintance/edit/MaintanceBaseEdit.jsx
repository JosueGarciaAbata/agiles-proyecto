import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Grid2,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import ClearIcon from "@mui/icons-material/Clear";
import tableStyles from "../../../generic/styles/TableStyles";
import CustomTablePaginationActions from "../../../generic/CustomTablePaginationActions";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  validateField,
  validateFields,
  handleErrors,
} from "../../../utils/validations";
import AssetSelector from "../create/AssetSelector";
import CreateStyles from "../../../generic/styles/CreateStyles";
import axiosInstance from "../../../utils/api";
import DynamicField from "../../../generic/DynamicField";
import ActivitiesModal from "../create/ActivitiesModal";
import ObservationsModal from "../create/ObservationsModal";
import ComponentsModal from "../create/ComponentsModal";
import { useMaintenancesContext } from "../../../provider/MaintenancesContext";
import GenericTable from "../../GenericTable";

const MaintanceBaseEdit = ({ maintance, fields, assets }) => {
  const { updateMaintenance } = useMaintenancesContext();
  const [maintanceEdited, setMaintanceEdited] = useState(maintance);
  const [assetsTable, setAssetsTable] = useState(maintance?.assets || []);
  const [activitiesCatalog, setActivitiesCatalog] = useState([]);
  const [componentsCatalog, setComponentsCatalog] = useState([]);
  const [openActivities, setOpenActivities] = useState(false);
  const [openObservations, setOpenObservations] = useState(false);
  const [openComponents, setOpenComponents] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  // Mensajes para el select del asset ya que es un componente separado al dynamic.
  const [errorAsset, setErrorAsset] = useState(false);
  const [helperTextAsset, setHelperTextAsset] = useState("");

  useEffect(() => {
    setMaintanceEdited(maintance);
  }, [maintance]);

  useEffect(() => {
    setMaintanceEdited((prev) => ({
      ...prev,
      assets: assetsTable,
    }));
  }, [assetsTable]);

  const handleFieldChange = (key, value) => {
    setMaintanceEdited((prev) => ({ ...prev, [key]: value }));

    if (
      key === "id_typ_main" &&
      value !== maintanceEdited.id_typ_main &&
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
    if (!maintanceEdited.id_typ_main) {
      toast.info(
        "Debe seleccionar un tipo de mantenimiento antes de añadir un activo."
      );
      return;
    }

    if (assetsTable.some((row) => row.asset.id === asset.id)) {
      toast.info("El activo ya ha sido agregado a la tabla.");
      return;
    }

    console.log("El objeto hasta este punto es", asset);

    setAssetsTable((prev) => [
      ...prev,
      {
        asset: {
          ...asset,
          activities: [],
          observations: [],
          replaced_components: [],
        },
      },
    ]);

    setErrorAsset(false);
    setHelperTextAsset("");
  };

  // Actividades
  const onOpenActivities = async (assetId) => {
    // Si ya añadio un tipo de mantenimiento, cargar las actividades de ese mantenimiento.
    try {
      const id = maintanceEdited.id_typ_main;
      const response = await axiosInstance.get(`/type-maintenance/${id}`);
      setActivitiesCatalog(response.data.results.activities);
      setOpenActivities(assetId);
    } catch (error) {
      toast.error("No se ha podido obtener las actividades.");
    }
  };

  const onSaveActivities = (activityList, assetId) => {
    setAssetsTable((prev) =>
      prev.map((item) =>
        item.asset.id === assetId
          ? { ...item, asset: { ...item.asset, activities: activityList } }
          : item
      )
    );
    setOpenActivities(false);
  };

  // Observaciones
  const onOpenObservations = (assetId) => {
    setOpenObservations(assetId);
  };

  const onSaveObservations = (observationsList, assetId) => {
    setAssetsTable((prev) =>
      prev.map((item) =>
        item.asset.id === assetId
          ? {
              ...item,
              asset: { ...item.asset, observations: observationsList },
            }
          : item
      )
    );
    setOpenObservations(false);
  };

  // Componentes
  const onOpenComponents = async (assetId) => {
    try {
      const response = await axiosInstance.get(
        `/assets/showForMaintenances/${assetId}`
      );
      setComponentsCatalog(response.data.components);
      setOpenComponents(assetId);
    } catch (error) {
      console.log(error.response.data);
      toast.error("No se ha podido obtener los componentes.");
    }
  };

  const onSaveComponents = (componentsList, assetId) => {
    setAssetsTable((prev) =>
      prev.map((item) =>
        item.asset.id === assetId
          ? {
              ...item,
              asset: { ...item.asset, replaced_components: componentsList },
            }
          : item
      )
    );

    setOpenComponents(false);
  };

  // Eliminar el activo de la tabla.
  const deleteRow = (id) => {
    setAssetsTable((prev) => prev.filter((item) => item.asset.id !== id));
  };

  // Acciones para la api
  const handleReturn = () => {
    navigate("/dashboard/maintance");
  };

  const validateAll = () => {
    const validationErrors = validateFields(maintanceEdited, fields);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleCreate = async () => {
    if (assetsTable.length === 0) {
      setErrorAsset(true);
      setHelperTextAsset("Debe agregar al menos un activo.");
    }

    if (validateAll()) {
      const hasMissingActivities = assetsTable.some(
        (item) => item.asset.activities.length === 0
      );

      if (hasMissingActivities) {
        toast.error(
          "Todos los activos deben tener al menos una actividad asignada."
        );
        return;
      }

      try {
        const dataToSend = {
          ...maintanceEdited,
          assets: maintanceEdited.assets.map((item) => ({
            cod_ass: item.asset.cod_ass,
            est_ass: item.asset.est_ass,
            ser_num_ass: item.asset.er_num_ass,
            id: item.asset.id,
            obs_add_ass: item.asset.obs_add_ass,
            observations: item.asset.observations,
            replaced_components: item.asset.replaced_components,
            activities: item.asset.activities.map((activity) => activity.id),
          })),
        };
        console.log("Envio esto", dataToSend);
        updateMaintenance(dataToSend);
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
        Editar mantenimiento
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
                value={maintanceEdited[field.key]}
                onChange={handleFieldChange}
                onFetch={handleFetch}
                error={errors[field.key]}
                helperText={errors[field.key]}
                readOnly={false}
              />
            </Grid2>
          ))}
          <Grid2 item size={{ xs: 12, sm: 6, md: 6 }} key="assetsSelector">
            <AssetSelector
              data={assets}
              onAdd={handleAddAsset}
              error={errorAsset}
              helperText={helperTextAsset}
              setErrorAsset={setErrorAsset}
              setHelperTextAsset={setHelperTextAsset}
            />
          </Grid2>
        </Grid2>

        <Box marginTop="30px">
          {/* Aqui esto debe cambiar, en teoria debo mostrar los activos que ya existen */}
          {assetsTable.length > 0 ? (
            <>
              <GenericTable
                data={assetsTable}
                dataCount={assetsTable.length}
                isDelete={false}
                setIsDelete={() => {}}
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
                        <TableRow key={row.asset.id}>
                          <TableCell>{row.asset.cod_ass}</TableCell>
                          <TableCell>{row.asset.ser_num_ass}</TableCell>
                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                              fontSize: "0.875rem",
                            }}
                          >
                            {row.asset.activities.length}{" "}
                            {row.asset.activities.length === 1
                              ? "Actividad"
                              : "Actividades"}
                            <IconButton
                              onClick={() => onOpenActivities(row.asset.id)}
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
                            {row.asset.observations.length}{" "}
                            {row.asset.observations.length === 1
                              ? "Observación"
                              : "Observaciones"}
                            <IconButton
                              onClick={() => onOpenObservations(row.asset.id)}
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
                            {row.asset.replaced_components.length}{" "}
                            {row.asset.replaced_components.length === 1
                              ? "Componente"
                              : "Componentes"}
                            <IconButton
                              onClick={() => onOpenComponents(row.asset.id)}
                              arial-label="abrir"
                            >
                              <PlaylistAddIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={() => deleteRow(row.asset.id)}>
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
        open={!!openActivities}
        onSave={(activityList) =>
          onSaveActivities(activityList, openActivities)
        }
        onClose={() => setOpenActivities(false)}
        catalog={activitiesCatalog}
        currentActivities={
          assetsTable.find((item) => item.asset.id === openActivities)?.asset
            .activities || []
        }
      />

      <ObservationsModal
        open={openObservations}
        onSave={(observationsList) =>
          onSaveObservations(observationsList, openObservations)
        }
        onClose={() => setOpenObservations(false)}
        currentObservations={
          assetsTable.find((asset) => asset.asset.id === openObservations)
            ?.asset.observations || []
        }
      />

      <ComponentsModal
        open={openComponents}
        onSave={(componentsList) =>
          onSaveComponents(componentsList, openComponents)
        }
        onClose={() => setOpenComponents(false)}
        catalog={componentsCatalog}
        currentComponents={
          assetsTable.find((asset) => asset.asset.id === openComponents)?.asset
            .replaced_components || []
        }
      />
    </>
  );
};
export default MaintanceBaseEdit;
