import React from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import tableStyles from "../../generic/styles/TableStyles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { getDecodedToken } from "../../utils/authService";
import Tooltip from "@mui/material/Tooltip";
import Loader from "../Loader";
import GenericTable from "../GenericTable";

const AssetTableShow = ({
  isReady,
  setIsDelete,
  isDelete,
  data,
  columns,
  onDelete,
  onView,
}) => {
  if (!isReady) {
    return <Loader />;
  }

  if (!Array.isArray(data)) {
    console.log("no vale", data);
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        Error: los datos no son validos.
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        No hay activos registrados.
      </div>
    );
  }

  // Verificando el rol del usuario.
  const decodedToken = getDecodedToken();
  const role = decodedToken?.role;

  return (
    <GenericTable
      data={data}
      dataCount={data.length}
      setIsDelete={() => {}}
      isDelete={false}
    >
      {(currentPageData) => (
        <>
          <TableHead sx={tableStyles.tableHead}>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key}>{column.label}</TableCell>
              ))}
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageData.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={column.key}>{item[column.key]}</TableCell>
                ))}
                <TableCell align="center">
                  <IconButton onClick={() => onView(item.id)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  {role === "admin" ? (
                    <IconButton
                      onClick={() => onDelete(item.id, item.est_ass)}
                      color={item.est_ass === "V" ? "secondary" : "sucess"}
                    >
                      {item.est_ass === "V" ? (
                        <Tooltip title="Ocultar">
                          <VisibilityIcon />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Mostrar">
                          <VisibilityOffIcon />
                        </Tooltip>
                      )}
                    </IconButton>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      )}
    </GenericTable>
  );
};

export default AssetTableShow;
