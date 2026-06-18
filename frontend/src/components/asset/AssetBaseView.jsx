import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FormControlLabel, Switch } from "@mui/material";
import { Grid2 } from "@mui/material";
import Box from "@mui/material/Box";
import CreateStyles from "../../generic/styles/CreateStyles";
import DynamicField from "../../generic/DynamicField";
import AssetTableCreate from "./AssetTableCreate";
import { useAssetsContext } from "../../provider/AssetsContext";

const AssetBaseView = ({
  asset,
  isReady,
  relatedData,
  fields,
  columns,
  errors,
  validateAll,
  validateTableFields,
  handleDescription,
  handleFieldChange,
}) => {
  const navigate = useNavigate();
  const { updateAsset } = useAssetsContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const handleFetch = async (param) => {};

  const handleReturn = () => {
    navigate("/dashboard/assets");
  };

  const handleUpdate = async () => {
    const isEntityValid = validateAll();
    const isTableValid = validateTableFields();

    if (isEntityValid && isTableValid) {
      updateAsset(asset);
      setIsEditing(false);
      navigate("/dashboard/assets");
    }
  };

  return (
    <>
      {/* Titulo */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h5"
          sx={{
            color: "#6068A5",
            fontWeight: "bold",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          Ver activo
        </Typography>
        <Box marginLeft="50px">
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
      </Box>
      {/* Cuerpo */}
      <Box p={3} border="1px solid #ddd" width="90%" borderRadius={2}>
        <Grid2 container spacing={3}>
          {fields.map((field) => (
            <Grid2 item size={{ xs: 12, md: 6 }} key={field.key}>
              {/* Título del campo */}
              <Typography
                variant="subtitle1"
                width="100%"
                color="#6068A5"
                fontWeight="bold"
              >
                {field.label}
              </Typography>
              {/* Campo dinámico */}
              <DynamicField
                key={field.key}
                field={field}
                value={asset[field.key]}
                onChange={handleFieldChange}
                onFetch={handleFetch}
                error={errors[field.key]}
                helperText={errors[field.key]}
                readOnly={!isEditing || !field.editable}
              />
            </Grid2>
          ))}
        </Grid2>
        {/* Poner la tabla */}
        <Box marginTop="30px">
          <AssetTableCreate
            data={relatedData || []}
            isReady={isReady}
            isDelete={isDelete}
            setIsDelete={setIsDelete}
            columns={columns}
            handleDescription={handleDescription}
            readOnly={!isEditing}
          />
        </Box>
      </Box>

      {/* Footer */}
      <Box
        width="90%"
        marginTop="20px"
        display="flex"
        justifyContent="flex-end"
      >
        <Button
          color="primary"
          sx={CreateStyles.buttonStyle2}
          onClick={handleReturn}
        >
          Cancelar
        </Button>

        <Button
          color="primary"
          sx={CreateStyles.buttonStyle2}
          onClick={handleUpdate}
        >
          Guardar
        </Button>
      </Box>
    </>
  );
};

export default AssetBaseView;
