import React, { useEffect, useState } from "react";
import {
  Modal,
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

const ObservationsModal = ({ open, onClose, onSave, currentObservations }) => {
  const [selectedObservation, setSelectedObservation] = useState("");
  const [observationsList, setObservationsList] = useState([]);

  useEffect(() => {
    if (open) {
      setObservationsList(currentObservations);
    }
  }, [open, currentObservations]);

  const handleObservation = () => {
    if (selectedObservation === "") {
      toast.warning("Observación vacía.");
      return;
    }

    if (selectedObservation.length > 100 || selectedObservation.length < 5) {
      toast.warning("La observación debe tener entre 5 y 100 caracteres.");
      return;
    }

    const observationExists = observationsList.find(
      (obs) => obs.des_obs === selectedObservation.trim()
    );

    if (observationExists) {
      toast.warning("La observación ya ha sido añadida.");
      return;
    }

    setObservationsList((prev) => [
      ...prev,
      {
        des_obs: selectedObservation.trim(),
      },
    ]);
    setSelectedObservation("");
    toast.success("Observación añadida correctamente.");
  };

  const handleRemoveActivity = (observationToRemove) => {
    setObservationsList((prev) =>
      prev.filter((observation) => observation.des_obs !== observationToRemove)
    );
    toast.success("Observación eliminada correctamente.");
  };

  const handleSave = () => {
    onSave(observationsList);
    onClose();
  };

  const handleClose = () => {
    onClose();
    setObservationsList([]);
    setSelectedObservation("");
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
              Observación
            </Typography>
            <TextField
              label="Añada una observación"
              value={selectedObservation}
              onChange={(e) => setSelectedObservation(e.target.value)}
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
            ></TextField>
            <Button
              variant="contained"
              onClick={handleObservation}
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
          {observationsList.length > 0 ? (
            <TableContainer component={Paper} sx={{ marginTop: "5px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Observación</TableCell>
                    <TableCell>{""}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {observationsList.map((observation, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          maxWidth: "280px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={observation.des_obs}
                      >
                        {observation.des_obs}
                      </TableCell>
                      <TableCell>
                        <Button
                          color="error"
                          onClick={() =>
                            handleRemoveActivity(observation.des_obs)
                          }
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
              No se han encontrado observaciones agregadas.
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

export default ObservationsModal;
