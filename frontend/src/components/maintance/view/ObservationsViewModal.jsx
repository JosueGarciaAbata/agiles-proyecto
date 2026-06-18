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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import categoryCreateStyles from "../../../generic/styles/CreateStyles";

const ObservationsViewModal = ({ open, onClose, currentObservations }) => {
  const [observationsList, setObservationsList] = useState(currentObservations);

  useEffect(() => {
    if (open) {
      setObservationsList(currentObservations);
    }
  }, [open, currentObservations]);

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
              Ver observaciones
            </Typography>
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
                  {observationsList.map((observation) => (
                    <TableRow key={observation.id}>
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
          <Button onClick={onClose} sx={categoryCreateStyles.buttonStyle1}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ObservationsViewModal;
