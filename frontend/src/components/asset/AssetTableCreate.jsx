import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
} from "@mui/material";
import tableStyles from "../../generic/styles/TableStyles";
import Loader from "../Loader";
import GenericTable from "../GenericTable";

const ContentTable = ({
  data,
  isReady,
  isDelete,
  setIsDelete,
  readOnly,
  columns,
  handleDescription,
}) => {
  if (!isReady) {
    console.log(isReady);
    return <Loader />;
  }

  if (!Array.isArray(data)) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        Error: los datos no son validos.
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "30px", color: "#6068A5" }}>
        No se han encontrado componentes.
      </div>
    );
  }

  const filteredColumn = columns.filter((column) => column.showInTable);

  return (
    <>
      <GenericTable
        data={data}
        dataCount={data.length}
        isDelete={isDelete}
        setIsDelete={setIsDelete}
      >
        {(currentPageData) => (
          <>
            <TableHead sx={tableStyles.tableHead}>
              <TableRow>
                {filteredColumn.map((column) => (
                  <TableCell key={column.key}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageData.map((item) => (
                <TableRow key={item.id}>
                  {filteredColumn.map((column) => (
                    <TableCell key={column.key}>
                      {/* Campo que se genera para la descripción */}
                      {column.key === "des_com" ? (
                        <TextField
                          value={item.pivot?.description || ""}
                          onChange={(e) =>
                            handleDescription(item.id, e.target.value)
                          }
                          error={item.error || false}
                          helperText={
                            item.error
                              ? "Este campo es obligatorio con mínimo 3 y máximo 200 caracteres"
                              : ""
                          }
                          InputProps={{
                            readOnly: readOnly,
                          }}
                        ></TextField>
                      ) : (
                        item[column.key]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </GenericTable>
    </>
  );
};

export default ContentTable;
