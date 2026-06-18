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
  TablePagination,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import tableStyles from "../../../generic/styles/TableStyles";
import ActivitiesViewModal from "./ActivitiesViewModal";
import ObservationsViewModal from "./ObservationsViewModal";
import ComponentsViewModal from "./ComponentsViewModal";
import CreateStyles from "../../../generic/styles/CreateStyles";
import CustomTablePaginationActions from "../../../generic/CustomTablePaginationActions";
import { useNavigate } from "react-router-dom";
import GenericTable from "../../GenericTable";

const MaintanceBaseView = ({ data, fields, columns }) => {
  const [currentAsset, setCurrentAsset] = useState(null);
  const [assetsTable, setAssetsTable] = useState(data?.assets || []);
  const [openActivities, setOpenActivities] = useState(false);
  const [openObservations, setOpenObservations] = useState(false);
  const [openComponents, setOpenComponents] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => setCurrentPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  // Actividades
  const onOpenActivities = async (assetId) => {
    const asset = assetsTable.find((item) => item.asset.id === assetId);
    setCurrentAsset(asset.asset);
    setOpenActivities(true);
  };

  // Observaciones
  const onOpenObservations = (assetId) => {
    const asset = assetsTable.find((item) => item.asset.id === assetId);
    setCurrentAsset(asset.asset);
    setOpenObservations(true);
  };

  // Componentes
  const onOpenComponents = async (id) => {
    const asset = assetsTable.find((item) => item.asset.id === id);
    setCurrentAsset(asset.asset);
    setOpenComponents(true);
  };

  // Botones de cerrar
  const onCloseActivities = () => setOpenActivities(false);
  const onCloseObservations = () => setOpenObservations(false);
  const onCloseComponents = () => setOpenComponents(false);

  // Acciones para la api
  const handleReturn = () => {
    navigate("/dashboard/maintance");
  };

  return (
    <>
      <Typography
        variant="h6"
        color="#6068A5"
        marginBottom="20px"
        marginTop="20px"
        fontWeight="bold"
      >
        Ver mantenimiento
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
              <TextField
                value={data[field.key] || "No disponible"}
                InputProps={{ readOnly: true }}
                fullWidth
                sx={{ marginTop: "15px" }}
              />
            </Grid2>
          ))}
        </Grid2>

        <Box marginTop="30px">
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentPageData.map((row) => (
                    <TableRow key={row.asset.id}>
                      <TableCell>{row.asset.cod_ass}</TableCell>
                      <TableCell>{row.asset.ser_num_ass}</TableCell>
                      <TableCell>
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
                      <TableCell>
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
                      <TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}
          </GenericTable>
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
          Regresar
        </Button>
      </Box>

      <ActivitiesViewModal
        open={openActivities}
        onClose={onCloseActivities}
        currentActivities={currentAsset?.activities || []}
      />

      <ObservationsViewModal
        open={openObservations}
        onClose={onCloseObservations}
        currentObservations={currentAsset?.observations || []}
      />

      <ComponentsViewModal
        open={openComponents}
        onClose={onCloseComponents}
        currentComponents={currentAsset?.replaced_components || []}
      />
    </>
  );
};

export default MaintanceBaseView;
