import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import BatchModal from "./BatchModal";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/api";
import { useAssetsContext } from "../../../provider/AssetsContext";
import GenericTable from "../../GenericTable";
import tableStyles from "../../../generic/styles/TableStyles";

const AssetsByBatch = () => {
  const { addBatchAssets } = useAssetsContext();
  const [openBatchModal, setOpenBatchModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  console.log("existe", location?.state);

  const { assets = { valid_assets: [], invalid_assets: [] } } =
    location.state || {};

  useEffect(() => {
    if (assets.invalid_assets.length > 0) {
      setSnackbarOpen(true);
    }
  }, [assets.invalid_assets]);

  console.log("Que llego", assets.valid_assets);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleBack = () => {
    setOpenBatchModal(true);
  };

  const handleCancel = () => {
    navigate("/dashboard/assets");
  };

  const handleSave = async () => {
    try {
      const formatted = { assets: assets.valid_assets };
      const response = await axiosInstance.post(
        "/assets/storeBatch",
        formatted
      );

      addBatchAssets(response.data.asset_details);
      toast.success(response.data.message);
      navigate("/dashboard/assets");
    } catch (error) {
      toast.error("No se ha podido guardar por lote.");
    }
  };

  return (
    <>
      <Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
            onClick={handleOpenDialog}
          >
            Archivo con algunos errores
          </Alert>
        </Snackbar>

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>El archivo contuvo algunos errores</DialogTitle>
          <DialogContent>
            {assets?.invalid_assets?.map((error, index) => (
              <Box key={index} marginBottom={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {error.header}
                </Typography>
                <ul>
                  {Object.entries(error.errors).map(([field, messages], i) => (
                    <li key={i}>
                      <Typography>
                        <strong>{field}:</strong> {messages.join(", ")}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Typography
        variant="h6"
        color="#6068A5"
        marginBottom="20px"
        marginTop="20px"
        fontWeight="bold"
      >
        Activos por lote
      </Typography>

      {assets?.valid_assets.length > 0 ? (
        <GenericTable
          data={assets.valid_assets}
          dataCount={assets.valid_assets.length}
          isDelete={false}
          setIsDelete={() => {}}
        >
          {(currentPageData) =>
            currentPageData.map((asset, index) => (
              <Box
                key={index}
                p={3}
                border="1px solid #ddd"
                borderRadius={4}
                margin="2rem 2rem"
              >
                <Typography variant="title2" color="#6068A5" fontWeight="bold">
                  Activo
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      color="#6068A5"
                      fontWeight="bold"
                    >
                      Código
                    </Typography>
                    <TextField
                      fullWidth
                      value={asset?.cod_ass}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      color="#6068A5"
                      fontWeight="bold"
                    >
                      Número de serie
                    </Typography>
                    <TextField
                      fullWidth
                      value={asset?.ser_num_ass}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} color="#6068A5">
                    <Typography variant="subtitle2" fontWeight="bold">
                      Ubicación
                    </Typography>
                    <TextField
                      fullWidth
                      value={asset?.location_name}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      color="#6068A5"
                      fontWeight="bold"
                    >
                      Ingreso
                    </Typography>
                    <TextField
                      fullWidth
                      value={asset?.income_code}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      color="#6068A5"
                      fontWeight="bold"
                    >
                      Dispositivo
                    </Typography>
                    <TextField
                      fullWidth
                      value={asset?.category_name}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>

                {asset?.components?.length > 0 && (
                  <>
                    <Typography variant="subtitle2" marginTop={4}>
                      {""}
                    </Typography>
                    <GenericTable
                      data={asset?.components}
                      dataCount={asset?.components?.length}
                      isDelete={false}
                      setIsDelete={() => {}}
                    >
                      {(currentPageData) => (
                        <>
                          <TableHead sx={tableStyles.tableHead}>
                            <TableRow>
                              <TableCell>Nombre</TableCell>
                              <TableCell>Descripción</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {currentPageData.map((component, i) => (
                              <TableRow key={i}>
                                <TableCell>{component?.name}</TableCell>
                                <TableCell>
                                  {component.pivot?.description || "N/A"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </>
                      )}
                    </GenericTable>
                  </>
                )}
              </Box>
            ))
          }
        </GenericTable>
      ) : (
        <Typography variant="subtitle1" marginBottom="2rem">
          No se han encontrado activos válidos.
        </Typography>
      )}

      <Box
        display="flex"
        justifyContent="space-between"
        width="90%"
        marginTop="2rem"
      >
        <Button variant="outlined" onClick={handleBack}>
          Volver a subir
        </Button>
        <Box display="flex" justifyContent="space-between" gap="1rem">
          <Button variant="outlined" color="error" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!assets.valid_assets.length}
          >
            Guardar
          </Button>
        </Box>
      </Box>

      <BatchModal
        open={openBatchModal}
        onClose={() => setOpenBatchModal(false)}
      />
    </>
  );
};

export default AssetsByBatch;
