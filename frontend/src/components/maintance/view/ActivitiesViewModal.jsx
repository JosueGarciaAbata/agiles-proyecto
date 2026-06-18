import {
  Box,
  Typography,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
} from "@mui/material";
import { useEffect, useState } from "react";
import categoryCreateStyles from "../../../generic/styles/CreateStyles";

const ActivitiesViewModal = ({ open, onClose, currentActivities }) => {
  const [activitiesList, setActivitiesList] = useState([]);

  useEffect(() => {
    if (open) {
      setActivitiesList(currentActivities);
    }
  }, [open, currentActivities]);

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
              Ver tareas
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
          <Button onClick={onClose} sx={categoryCreateStyles.buttonStyle1}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActivitiesViewModal;
