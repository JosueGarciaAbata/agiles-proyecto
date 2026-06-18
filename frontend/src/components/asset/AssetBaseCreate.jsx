import {
  validateField,
  validateFields,
  handleErrors,
} from "../../utils/validations";
import React, { useState } from "react";
import { Box, Grid2, Typography, Button } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CreateStyles from "../../generic/styles/CreateStyles";
import DynamicField from "../../generic/DynamicField";
import AssetTableCreate from "./AssetTableCreate";
import axiosInstance from "../../utils/api";
import { useAssetsContext } from "../../provider/AssetsContext";

const Entry = ({ fields, columns, defaultState }) => {
  const { addAsset } = useAssetsContext();
  const [entity, setEntity] = useState(defaultState);
  const [relatedData, setRelatedData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const navigate = useNavigate();

  const resetFields = () => {
    setEntity(defaultState);
    setRelatedData([]);
    setErrors({});
  };

  // Basicamente valida un solo campo
  const handleFieldChange = (key, value) => {
    setEntity((prev) => ({ ...prev, [key]: value }));

    const errorMessage = validateField(key, value);
    setErrors((prevErrors) => ({ ...prevErrors, [key]: errorMessage }));
  };

  // Cambio basado en la fila y su valor.
  const handleDescription = (id, description) => {
    setEntity((prevEntity) => {
      const componentExists = prevEntity.components.some(
        (component) => component.id === id
      );

      let updatedComponents;
      const hasError = !description.trim();

      // Actualizar el compoentne si existe
      if (componentExists) {
        updatedComponents = prevEntity.components.map((component) =>
          component.id === id
            ? {
                ...component,
                pivot: { ...component.pivot, description },
              }
            : component
        );
        // Crear el componente si no existe
      } else {
        updatedComponents = [
          ...prevEntity.components,
          { id, pivot: { description } },
        ];
      }

      // Actualizar relatedData para mantener los datos que escribe el usuario en la tabla.
      setRelatedData((prevData) =>
        prevData.map((component) =>
          component.id === id
            ? {
                ...component,
                pivot: { ...component.pivot, description },
                error: hasError,
              }
            : component
        )
      );

      return { ...prevEntity, components: updatedComponents };
    });
  };

  // En este caso el key seria id_cat_ass y el value correspondería al id.
  const handleFetch = async (key, value) => {
    if (key === "id_cat_ass") {
      setIsCategorySelected(true);
      setIsReady(true);
      resetComponents();

      try {
        const response = await axiosInstance.get(`/categories/show/${value}`);
        const componentsWithDescription = response.data.device.components.map(
          (component) => ({
            ...component,
            pivot: {
              ...component.pivot,
              description: component.pivot?.description || "",
            },
          })
        );

        setRelatedData(componentsWithDescription);
      } catch (error) {
        toast.error("No se ha podido obtener los componentes.");
        setRelatedData([]);
      } finally {
        setIsReady(true);
      }
    }
  };

  const resetComponents = () => {
    setEntity((prevEntity) => ({
      ...prevEntity,
      components: [],
    }));
    setRelatedData([]);
  };

  const validateTableFields = () => {
    let hasErrors = false;

    const updatedRelatedData = relatedData.map((component) => {
      const description = component.pivot?.description?.trim();

      // Validar que la descripción exista y tenga entre 3 y 30 caracteres
      if (!description || description.length < 3 || description.length > 200) {
        hasErrors = true;
        return { ...component, error: true };
      }

      // Si la descripción está bien, eliminar el error
      return { ...component, error: false };
    });

    // Actualizar el estado con los errores encontrados
    setRelatedData(updatedRelatedData);

    return !hasErrors;
  };

  // Cuando intente crear todos los campos
  const validateAll = () => {
    const validationErrors = validateFields(entity, fields);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleReturn = () => {
    navigate("/dashboard/assets");
  };

  const handleCreate = async () => {
    const isEntityValid = validateAll();
    const isTableValid = validateTableFields();

    if (isEntityValid && isTableValid) {
      addAsset(entity);
      resetFields();
      navigate("/dashboard/assets");
    }
  };

  return (
    <>
      <Typography
        variant="h6"
        color="#6068A5"
        marginBottom="20px"
        marginTop="20px"
        fontWeight="bold"
      >
        Crear activo
      </Typography>
      <Box p={3} border="1px solid #ddd" width="90%" borderRadius={2}>
        {/* Contenedor de la cuadrícula */}
        <Grid2 container spacing={3}>
          {fields.map((field) => (
            <Grid2 item size={{ xs: 12, sm: 6, md: 6 }} key={field.key}>
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
                value={entity[field.key]}
                onChange={handleFieldChange}
                onFetch={handleFetch}
                error={errors[field.key]}
                helperText={errors[field.key]}
                readOnly={false}
              />
            </Grid2>
          ))}
        </Grid2>

        {/* Generar tabla */}
        {isCategorySelected ? (
          relatedData.length > 0 ? (
            <Box marginTop="30px">
              <AssetTableCreate
                data={relatedData}
                setIsDelete={setIsDelete}
                isDelete={isDelete}
                isReady={isReady}
                columns={columns}
                handleDescription={handleDescription}
                readOnly={false}
              />
            </Box>
          ) : (
            <Typography marginTop="30px" color="#6068A5">
              No se han encontrado componentes para el dispositivo.
            </Typography>
          )
        ) : null}
      </Box>

      {/* Botones */}
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
          onClick={handleCreate}
        >
          Guardar
        </Button>
      </Box>
    </>
  );
};

export default Entry;
