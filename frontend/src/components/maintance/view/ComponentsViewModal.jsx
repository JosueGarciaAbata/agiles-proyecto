import {
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState, useEffect } from "react";
import tableStyles from "../../../generic/styles/TableStyles";
import CustomTablePaginationActions from "../../../generic/CustomTablePaginationActions";
import categoryCreateStyles from "../../../generic/styles/CreateStyles";

const ComponentsViewModal = ({ open, onClose, currentComponents }) => {
  const [selectedComponents, setSelectedComponents] =
    useState(currentComponents);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  // Paginación
  const handleChangePage = (event, newPage) => setCurrentPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  useEffect(() => {
    if (open) {
      setSelectedComponents(currentComponents);
    }
  }, [open, currentComponents]);

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6" sx={{ flexShrink: 0, whiteSpace: "nowrap" }}>
            Ver componentes reemplazados
          </Typography>
        </DialogTitle>
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedComponents.map((component) => (
                      <TableRow key={component.id}>
                        <TableCell>{component.nam_com}</TableCell>
                        <TableCell>{component.des_rep_com}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={selectedComponents.length}
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
          <Button onClick={onClose} sx={categoryCreateStyles.buttonStyle1}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ComponentsViewModal;
