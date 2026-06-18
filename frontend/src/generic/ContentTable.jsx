import React from "react";
import GenericTable from "../components/GenericTable";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from "@mui/icons-material/Visibility";
import tableStyles from "./styles/TableStyles";
import dayjs from "dayjs";
import { getDecodedToken } from "../utils/authService";

const ContentTable = ({
  data,
  columns,
  onView,
  onDelete,
  setIsDelete,
  isDelete,
}) => {
  const decodedToken = getDecodedToken();
  const currentUserEmail = decodedToken.email;

  const transformedValue = (key, value) => {
    if (key === "est_inc") {
      return value === "O" ? "Abierto" : "Cerrado";
    }

    if (key === "date_inc") {
      return dayjs(value).utc().format("MM-DD-YYYY");
    }

    if (key === "is_ext") {
      return value === "Y" ? "Interno" : "Externo";
    }

    return value || "-";
  };

  return (
    <>
      <GenericTable
        data={data}
        dataCount={data.length}
        setIsDelete={setIsDelete}
        isDelete={isDelete}
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
                    <TableCell key={column.key}>
                      {transformedValue(column.key, item[column.key])}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <IconButton onClick={() => onView(item.id)} color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => onDelete(item.id)}
                      color="secondary"
                      disabled={currentUserEmail === item.email}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </TableCell>
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
