import axiosInstance from "../../utils/api";
import React, { useEffect, useState } from "react";
import GenericManager from "../GenericManager";
import { toast } from "react-toastify";
import { getDecodedToken } from "../../utils/authService";
import { useNavigate } from "react-router-dom";

const IncomeManager = () => {
  const role = getDecodedToken()?.role;
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") {
      navigate("/dashboard/maintance");
    }
  }, [role, navigate]);

  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axiosInstance.get("/suppliers");
        setSuppliers(response.data.results);
      } catch (error) {
        toast.error("Error al cargar los proveedores");
      }
    };

    fetchSuppliers();
  }, []);

  const apiConfig = {
    fetchAll: "/incomes",
    fetchOne: "/incomes",
    fetchSearch: "/incomes/search?term=",
    create: "/incomes",
    update: "/incomes",
    delete: "/incomes",
  };

  const defaultEntityState = {
    cod_inc: "",
    date_inc: null,
    // Por defecto dejemosle abierto, sino este no se crea
    est_inc: "O",
    supplier_id: "",
    supplier_nam: "",
  };

  const results =
    suppliers.length > 0
      ? suppliers.map((supplier) => ({
          value: supplier.id,
          label: supplier.nam_sup,
        }))
      : [{ value: "", label: "Cargando proveedores..." }];

  // Modales
  const fields = [
    {
      key: "cod_inc",
      label: "Código",
      type: "text",
      showCreate: true,
      showUpdate: true,
    },
    {
      key: "supplier_id",
      label: "Proveedor",
      type: "select",
      options: results,
      showCreate: true,
      showUpdate: true,
    },
    {
      key: "est_inc",
      label: "Estado",
      type: "select",
      options: [
        { value: "O", label: "Abierto" },
        { value: "C", label: "Cerrado" },
      ],
      showCreate: false,
      showUpdate: true,
    },
    {
      key: "date_inc",
      label: "Fecha",
      type: "date",
      showCreate: true,
      showUpdate: true,
    },
  ];

  // Tabla
  const columns = [
    { key: "cod_inc", label: "Código" },
    { key: "supplier_name", label: "Proveedor" },
    { key: "date_inc", label: "Fecha" },
    { key: "est_inc", label: "Estado" },
  ];

  // Para el elimiminar
  const message = "cod_inc";

  const searchBy = "código";

  return (
    <GenericManager
      apiConfig={apiConfig}
      entityNamePlural="Ingresos"
      entityNameSingular="Ingreso"
      defaultEntityState={defaultEntityState}
      fields={fields}
      columns={columns}
      message={message}
      searchBy={searchBy}
    />
  );
};

export default IncomeManager;
