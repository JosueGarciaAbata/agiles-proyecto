import CustomTablePaginationActions from "../generic/CustomTablePaginationActions";
import { Table, TableContainer, Paper, TablePagination } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import tableStyles from "../generic/styles/TableStyles";

const START_PAGE = 5;
const NEXT_PAGES = [5, 10];

const GenericTable = ({ children, data, dataCount, setIsDelete, isDelete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(START_PAGE);

  useEffect(() => {
    if (isDelete) {
      const totalPages = Math.ceil(data.length / rowsPerPage);

      // Si la página actual es mayor o igual al total de páginas, retroceder a la página anterior
      if (currentPage >= totalPages && currentPage > 0) {
        setCurrentPage(totalPages - 1); // Retroceder una página de manera segura
      }

      if (data.length === 0) {
        setCurrentPage(0);
      }

      setIsDelete(false); // Resetear el flag de eliminación
    }
  }, [isDelete, data.length, currentPage, rowsPerPage, setIsDelete]);

  // Calcular las entidades para la página actual
  const currentPageData = useMemo(() => {
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }, [currentPage, rowsPerPage, data]);

  const handleChangePage = (event, newPage) => setCurrentPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0); // Volver a la primera página cuando cambian las filas por página
  };

  return (
    <>
      <TableContainer
        className="table-container"
        component={Paper}
        sx={tableStyles.tableContainer}
      >
        <Table>{children(currentPageData)}</Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={dataCount}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={NEXT_PAGES}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={
          <span style={tableStyles.labelRowsPerPage}>Filas por página</span>
        }
        labelDisplayedRows={() => ""}
        ActionsComponent={(props) => (
          <CustomTablePaginationActions {...props} />
        )}
        sx={tableStyles.pagination}
      />
    </>
  );
};

export default GenericTable;
