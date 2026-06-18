import React, { act, useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  TableContainer,
  Paper,
  Table,
  TablePagination,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  MenuItem,
} from "@mui/material";
import categoryCreateStyles from "../../../generic/styles/CreateStyles";
import tableStyles from "../../../generic/styles/TableStyles";
import CustomTablePaginationActions from "../../../generic/CustomTablePaginationActions";
import { toast } from "react-toastify";

const ComponentsModal = ({
  open,
  onClose,
  onSave,
  catalog,
  currentComponents,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [selectedComponentId, setSelectedComponentId] = useState("");
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      console.log(currentComponents);
      setSelectedComponents(currentComponents);
    }
  }, [open, currentComponents]);

  // Paginación
  const handleChangePage = (event, newPage) => setCurrentPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  // Acciones en la tabla
  const handleAddComponent = () => {
    if (!selectedComponentId) {
      toast.warning("Seleccione un componente para añadir.");
      return;
    }

    if (
      selectedComponents.some(
        (component) => component.id === selectedComponentId
      )
    ) {
      toast.warning("El componente ya ha sido añadido.");
      return;
    }

    const component = catalog.find((comp) => comp.id === selectedComponentId);
    if (component) {
      setSelectedComponents((prev) => [
        ...prev,
        { ...component, id_com_bel: selectedComponentId, des_rep_com: "" },
      ]);
      setSelectedComponentId("");
    }

    console.log("Lo que se añadio a la tabla es", selectedComponents);
  };

  const handleRemoveComponent = (componentId) => {
    setSelectedComponents((prev) =>
      prev.filter((component) => component.id !== componentId)
    );

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[componentId];
      return newErrors;
    });
  };

  // Cambio basado en la fila y su valor.
  const handleDescriptionChange = (componentId, description) => {
    if (description.length < 3 || description.length > 30) {
      setErrors((prev) => ({
        ...prev,
        [componentId]: "La descripción debe tener entre 3 y 30 caracteres.",
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[componentId];
        return newErrors;
      });
    }

    setSelectedComponents((prev) =>
      prev.map((component) =>
        component.id === componentId
          ? { ...component, des_rep_com: description }
          : component
      )
    );
  };

  const handleSave = () => {
    // Validar que todos los componentes tengan descripciones válidas
    const invalidComponents = selectedComponents.filter(
      (component) =>
        !component.des_rep_com ||
        component.des_rep_com.length < 3 ||
        component.des_rep_com.length > 30
    );

    if (invalidComponents.length > 0) {
      // Marcar errores en los componentes inválidos
      const newErrors = {};
      invalidComponents.forEach((component) => {
        newErrors[component.id] =
          "La descripción debe tener entre 3 y 30 caracteres.";
      });
      setErrors(newErrors);

      toast.warning(
        "Todos los componentes deben tener descripciones válidas antes de guardar."
      );
      return;
    }

    onSave(selectedComponents);
    onClose();
  };

  const handleClose = () => {
    setSelectedComponents([]);
    setSelectedComponentId("");
    setErrors({});
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6" sx={{ flexShrink: 0, whiteSpace: "nowrap" }}>
            Reemplazar
          </Typography>
        </DialogTitle>
        <Box
          display="flex"
          gap={2}
          alignItems="center"
          marginBottom={2}
          marginTop={2}
          px={3}
        >
          <TextField
            select
            label="Seleccione un componente"
            value={selectedComponentId}
            onChange={(e) => setSelectedComponentId(e.target.value)}
            fullWidth
          >
            {catalog.length > 0 ? (
              catalog.map((component) => (
                <MenuItem key={component.id} value={component.id}>
                  {component.nam_com}
                </MenuItem>
              ))
            ) : (
              <MenuItem>No se han encontrado componentes...</MenuItem>
            )}
          </TextField>
          <Button variant="contained" onClick={handleAddComponent}>
            Añadir
          </Button>
        </Box>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {selectedComponents.length > 0 ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={tableStyles.tableHead}>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Acción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedComponents
                      .slice(
                        currentPage * rowsPerPage,
                        currentPage * rowsPerPage + rowsPerPage
                      )
                      .map((component) => (
                        <TableRow key={component.id}>
                          <TableCell>{component.nam_com}</TableCell>
                          <TableCell>
                            <TextField
                              value={component.des_rep_com}
                              onChange={(e) =>
                                handleDescriptionChange(
                                  component.id,
                                  e.target.value
                                )
                              }
                              placeholder="Ingrese descripción"
                              fullWidth
                              error={!!errors[component.id]}
                              helperText={errors[component.id] || ""}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              color="error"
                              onClick={() =>
                                handleRemoveComponent(component.id)
                              }
                              size="small"
                            >
                              Quitar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={selectedComponents?.length}
                page={currentPage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[3, 5]}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={
                  <span style={tableStyles.labelRowsPerPage}>
                    Filas por página
                  </span>
                }
                labelDisplayedRows={() => ""}
                ActionsComponent={(props) => (
                  <CustomTablePaginationActions {...props} />
                )}
                sx={tableStyles.pagination}
              />
            </>
          ) : (
            <Typography>
              No se han encontrado componentes a reemplazar
            </Typography>
          )}
          {/* End table */}
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

export default ComponentsModal;
