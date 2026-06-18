import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import * as XLSX from "xlsx";
import axiosInstance from "../../../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BatchModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState(""); // Nombre del archivo cargado
  const [error, setError] = useState(""); // Mensaje de error
  const [data, setData] = useState([]); // Datos procesados del Excel

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // Verificar que el archivo tenga extensión .xlsx
    if (!file.name.endsWith(".xlsx")) {
      setError("Ingrese un archivo .xlsx");
      setFileName(file.name);
      setData([]);
      return;
    }

    setError(""); // Limpiar errores si el archivo es válido
    setFileName(file.name);

    // Leer y procesar el archivo Excel
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      console.log("Workbook", workbook);

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const formattedData = jsonData.map((row) => {
        const assetData = {
          id_inc_ass: row["Ingreso"], // Asigna "Ingreso" a "id_inc_ass"
          id_cat_ass: parseInt(row["Categoria"], 10), // Convierte "Categoria" a un número entero
          id_loc_ass: row["Localización"], // Asigna "Localización" a "id_loc_ass"
          cod_ass: row["Codigo Activo"], // Asigna "Codigo Activo" a "cod_ass"
          ser_num_ass: row["Numero de Serie"], // Asigna "Numero de Serie" a "ser_num_ass"
          obs_add_ass: "", // Inicializa un valor vacío por defecto
          components: row["Componentes"] || [], // Guarda los componentes tal cual en la propiedad 'components'
        };

        if (assetData.components.length > 0) {
          const componentsArray = assetData.components
            .split(";")
            .map((component) => {
              const [id, description] = component.split(":");

              return {
                id: parseInt(id, 10),
                pivot: {
                  description: description?.trim(),
                },
              };
            })
            .filter((component) => component.id && component.pivot.description);

          assetData.components = componentsArray;
        }

        return assetData;
      });

      console.log("Lo que se tiene al final es", formattedData);
      setData(formattedData); // Guardar datos en el estado
    };
    reader.readAsBinaryString(file); // Leer el archivo como binario
  };

  const handleSubmit = async () => {
    if (data.length === 0) {
      setError("No hay datos para procesar. Cargue un archivo válido.");
      return;
    }

    const payload = { assets: data };
    console.log("JSON a enviar:", payload);

    try {
      const response = await axiosInstance.post(
        "/assets/validateBatch",
        payload
      );

      if (response.data) {
        onClose();
        navigate("/dashboard/batch", {
          state: { assets: response.data },
        });
      }
    } catch (error) {
      console.log(error.response);
      toast.error(
        "No se ha podido procesar por lotes, puesto que existen algunos campos vacios o incorrectos"
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Subir archivo
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {/* Input para cargar el archivo */}
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          InputProps={{
            readOnly: true,
            endAdornment: (
              <label htmlFor="file-upload">
                <Button
                  component="span"
                  sx={{ marginLeft: 1 }}
                  startIcon={<AddIcon />}
                >
                  📤
                </Button>
              </label>
            ),
          }}
          value={fileName || "Seleccione un archivo .xlsx"}
        />
        <input
          type="file"
          id="file-upload"
          accept=".xlsx"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {/* Mostrar error si ocurre */}
        {error && (
          <Typography color="red" variant="body2">
            {error}
          </Typography>
        )}

        {/* Botón para procesar */}
        <Button
          variant="contained"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={handleSubmit}
        >
          Añadir activos
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default BatchModal;
