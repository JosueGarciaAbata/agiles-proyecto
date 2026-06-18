import { useState, useMemo } from "react";

const usePagination = (data, rowsPerPage = 2) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPageState, setRowsPerPage] = useState(rowsPerPage);

  const currentPageData = useMemo(() => {
    const startIndex = currentPage * rowsPerPageState;
    const endIndex = startIndex + rowsPerPageState;
    return data.slice(startIndex, endIndex);
  }, [currentPage, rowsPerPageState, data]);

  const adjustPageAfterDelete = () => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / rowsPerPageState);

    // Si la página actual es mayor o igual al total de páginas, retroceder a la página anterior
    if (currentPage >= totalPages && currentPage > 0) {
      setCurrentPage(currentPage - 1); // Retroceder una página
    }
  };

  const handleChangePage = (event, newPage) => setCurrentPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0); // Volver a la primera página cuando cambian las filas por página
  };

  return {
    currentPageData,
    currentPage,
    setCurrentPage,
    rowsPerPageState,
    setRowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    adjustPageAfterDelete,
  };
};

export default usePagination;
