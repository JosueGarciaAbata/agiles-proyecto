import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { validateField, validateFields } from "../../utils/validations";
import { getDecodedToken } from "../../utils/authService";
import { useDataContext } from "../../provider/DataContext";
import axiosInstance from "../../utils/api";
import AssetBaseView from "./AssetBaseView";
import Loader from "../Loader";

const AssetView = () => {
  const { id } = useParams();
  const role = getDecodedToken()?.role;
  const [incomes, setIncomes] = useState([]);
  const [relatedData, setRelatedData] = useState([]);
  const [asset, setAsset] = useState({});
  const [errors, setErrors] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [isRelatedDataInitialized, setIsRelatedDataInitialized] =
    useState(false);

  const { data } = useDataContext();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [asset, incomesData] = await Promise.all([
          axiosInstance.get(`/assets/show/${id}?role=${role}`),
          axiosInstance.get(`/assets/incomes/${id}`),
        ]);

        setIncomes(incomesData.data);
        setAsset(asset.data);
        setIsReady(true);
      } catch (error) {
        toast.error("No se han podido obtener los datos.");
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (asset.components && !isRelatedDataInitialized) {
      const initializedData = asset.components.map((component) => ({
        ...component,
        error: false,
      }));

      setRelatedData(initializedData);
      setIsRelatedDataInitialized(true);
    }
  }, [asset, isRelatedDataInitialized]);

  const resultsLocations =
    data?.locations.length > 0
      ? data?.locations.map((location) => ({
          value: location.id,
          label: location.nam_loc,
        }))
      : [{ value: "", label: "No se han encontrado ubicaciones..." }];

  const resultsIncomes =
    incomes.length > 0
      ? incomes.map((income) => ({
          value: income.id,
          label: income.cod_inc,
        }))
      : [{ value: "", label: "No se han encontrado ingresos..." }];

  const fields = [
    { key: "cod_ass", label: "Código", type: "text", editable: true },
    {
      key: "ser_num_ass",
      label: "Número de serie",
      type: "text",
      editable: true,
    },
    {
      key: "id_loc_ass",
      label: "Ubicación",
      type: "select",
      options: resultsLocations,
      editable: true,
    },
    {
      key: "id_inc_ass",
      label: "Ingreso",
      type: "select",
      options: resultsIncomes,
      editable: true,
    },
    {
      key: "category_name",
      label: "Dispositivo",
      type: "text",
      editable: false,
    },
  ];

  const handleFieldChange = (key, value) => {
    setAsset((prev) => ({ ...prev, [key]: value }));

    const errorMessage = validateField(key, value);
    setErrors((prevErrors) => ({ ...prevErrors, [key]: errorMessage }));
  };

  const validateAll = () => {
    const validationErrors = validateFields(asset, fields);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const validateSingleField = (id, description) => {
    const hasError =
      !description.trim() || description.length < 3 || description.length > 200;

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
  };

  const handleDescription = (id, description) => {
    validateSingleField(id, description);
    setAsset((prevEntity) => {
      const updatedComponents = prevEntity.components.map((component) =>
        component.id === id
          ? {
              ...component,
              pivot: { ...component.pivot, description },
            }
          : component
      );

      return { ...prevEntity, components: updatedComponents };
    });
  };

  const validateTableFields = () => {
    let hasErrors = false;

    const updatedRelatedData = relatedData.map((component) => {
      const description = component.pivot?.description?.trim();

      // Validar descripción: Obligatorio, entre 3 y 200 caracteres
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

  const columns = [
    { key: "id", label: "Codigo", showInTable: false },
    { key: "nam_com", label: "Nombre", showInTable: true },
    { key: "des_com", label: "Descripción", showInTable: true },
  ];

  if (!isReady) {
    return <Loader />;
  }
  return (
    <AssetBaseView
      asset={asset}
      isReady={isReady}
      relatedData={relatedData}
      fields={fields}
      columns={columns}
      validateAll={validateAll}
      validateTableFields={validateTableFields}
      handleDescription={handleDescription}
      handleFieldChange={handleFieldChange}
      setAsset={setAsset}
      errors={errors}
    />
  );
};

export default AssetView;
