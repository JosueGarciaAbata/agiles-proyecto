import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  Box,
} from "@mui/material";
import { validateField, validateFields } from "../utils/validations";
import ViewStyles from "./styles/ViewStyles";
import DynamicField from "./DynamicField";
import { toast } from "react-toastify";

const ViewModal = ({
  open,
  onClose,
  item,
  onUpdate,
  isEditing,
  setIsEditing,
  fields,
}) => {
  // { att_1, att_2, att_3 }
  const [entity, setEntity] = useState(item);
  const [errors, setErrors] = useState({});

  // Item no valido
  useEffect(() => {
    if (open && !item) {
      toast.error("El elemento no existe o no está definido.");
      onClose();
    }
  }, [open, item, onClose]);

  // Item valido
  useEffect(() => {
    if (open && item) {
      setEntity(item);
      setErrors({});
    }
  }, [item, open]);

  // Basicamente validar un solo campo
  const handleFieldChange = (key, value) => {
    setEntity((prev) => ({ ...prev, [key]: value }));

    // Validar el campo actual
    const errorMessage = validateField(key, value);
    setErrors((prevErrors) => ({ ...prevErrors, [key]: errorMessage }));
  };

  // Cuando intente actualizar validar todos los campos.
  const validateAll = () => {
    // Excluir password
    const fieldsToValidate = fields.filter((field) => field.key !== "password");

    const validationErrors = validateFields(entity, fieldsToValidate);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleUpdate = () => {
    if (validateAll()) {
      onUpdate(entity);
      setIsEditing(false);
    }
  };

  // Evitar renderizar el modal
  if (!open || !item) {
    return null;
  }

  const visibleFields = fields.filter((field) => field.showUpdate);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Ver
        <Box style={{ position: "absolute", right: "20px", top: "16px" }}>
          <FormControlLabel
            control={
              <Switch
                checked={isEditing}
                onChange={() => setIsEditing(!isEditing)}
                color="primary"
              />
            }
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {visibleFields.map((field) => (
            <Box
              key={field.key}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography style={{ width: "100px", marginRight: "15px" }}>
                {field.label}
              </Typography>

              <DynamicField
                key={field.key}
                field={field}
                value={entity[field.key]}
                onChange={handleFieldChange}
                error={errors[field.key]}
                helperText={errors[field.key]}
                readOnly={!isEditing}
              />
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        {isEditing ? (
          <Button
            onClick={handleUpdate}
            color="primary"
            sx={ViewStyles.buttonStyle2}
          >
            Guardar
          </Button>
        ) : null}
        <Button
          onClick={onClose}
          color="secondary"
          sx={ViewStyles.buttonStyle1}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewModal;
