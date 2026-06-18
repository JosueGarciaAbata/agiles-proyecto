import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
} from "@mui/material";
import { toast } from "react-toastify";
import categoryCreateStyles from "../../../generic/styles/CreateStyles";

const ActivitiesModal = ({
  open,
  onClose,
  onSave,
  catalog,
  currentActivities,
}) => {
  // Esto es un id
  const [selectedActivity, setSelectedActivity] = useState("");
  const [activitiesList, setActivitiesList] = useState([]);

  useEffect(() => {
    if (open) {
      setActivitiesList(currentActivities);
    }
  }, [open, currentActivities]);

  const handleAddActivity = () => {
    if (!selectedActivity) {
      toast.warning("Seleccione una actividad para añadir.");
      return;
    }

    if (activitiesList.some((activity) => activity.id === selectedActivity)) {
      toast.info("La actividad ya ha sido añadida.");
      return;
    }

    const activity = {
      id: selectedActivity,
      act_main: catalog.find((activity) => activity.id === selectedActivity)
        ?.act_main,
    };

    setActivitiesList((prev) => [...prev, activity]);
    setSelectedActivity("");
    toast.success("Actividad añadida correctamente.");
  };

  const handleRemoveActivity = (id) => {
    setActivitiesList((prev) => {
      const updatedList = prev.filter((activity) => activity.id !== id);
      return updatedList;
    });
    toast.success("Actividad eliminada correctamente.");
  };

  const handleSave = () => {
    onSave(activitiesList);
    setSelectedActivity("");
    onClose();
  };

  const handleClose = () => {
    onClose();
    setSelectedActivity("");
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 2,
              width: "100%",
              "@media (max-width: 600px)": {
                flexDirection: "column",
                alignItems: "flex-start",
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
            >
              Añadir tarea
            </Typography>
            <TextField
              select
              label="Seleccione una actividad"
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              sx={{
                marginTop: "15px",
                flexGrow: 1,
                minWidth: "150px",
                maxWidth: "310px",
                width: "100%",
                "@media (max-width: 600px)": {
                  maxWidth: "100%",
                },
              }}
            >
              {catalog.length > 0 ? (
                catalog.map((activity) => (
                  <MenuItem key={activity.id} value={activity.id}>
                    {activity.act_main}
                  </MenuItem>
                ))
              ) : (
                <MenuItem>No se han encontrado actividades...</MenuItem>
              )}
            </TextField>
            <Button
              variant="contained"
              onClick={handleAddActivity}
              sx={{
                flexShrink: 0,
                whiteSpace: "nowrap",
                minWidth: "90px",
              }}
            >
              Añadir
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {/* Tabla */}
          {activitiesList.length > 0 ? (
            <TableContainer component={Paper} sx={{ marginTop: "5px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Actividad</TableCell>
                    <TableCell>{""}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activitiesList.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell
                        sx={{
                          maxWidth: "280px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={activity.act_main}
                      >
                        {activity.act_main}
                      </TableCell>
                      <TableCell>
                        <Button
                          color="error"
                          onClick={() => handleRemoveActivity(activity.id)}
                        >
                          Quitar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="text" marginTop="10px">
              No se han encontrado actividades agregadas.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={categoryCreateStyles.buttonStyle1}>
            Cancelar
          </Button>
          <Button onClick={handleSave} sx={categoryCreateStyles.buttonStyle2}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActivitiesModal;
