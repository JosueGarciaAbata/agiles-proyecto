import GenericManager from "../GenericManager";
import { getDecodedToken } from "../../utils/authService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SupplierManager = () => {
  const role = getDecodedToken()?.role;
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") {
      navigate("/dashboard/maintance");
    }
  }, [role, navigate]);

  const apiConfig = {
    fetchAll: "/suppliers",
    fetchOne: "/suppliers",
    fetchSearch: "/suppliers/search?term=",
    create: "/suppliers",
    update: "/suppliers",
    delete: "/suppliers",
  };

  const defaultEntityState = {
    id_num_sup: "",
    nam_sup: "",
    ema_sup: "",
    pho_sup: "",
  };

  const fields = [
    {
      key: "id_num_sup",
      label: "Cédula",
      type: "text",
      showCreate: true,
      showUpdate: true,
    },
    {
      key: "nam_sup",
      label: "Nombre",
      type: "text",
      showCreate: true,
      showUpdate: true,
    },
    {
      key: "ema_sup",
      label: "Correo",
      type: "text",
      showCreate: true,
      showUpdate: true,
    },
    {
      key: "pho_sup",
      label: "Telefono",
      type: "text",
      showCreate: true,
      showUpdate: true,
    },
  ];

  const columns = [
    { key: "id_num_sup", label: "Cédula" },
    { key: "nam_sup", label: "Nombre" },
    { key: "ema_sup", label: "Correo" },
    { key: "pho_sup", label: "Telefono" },
  ];

  const message = "nam_sup";
  const searchBy = "cedula";

  return (
    <GenericManager
      apiConfig={apiConfig}
      entityNamePlural="Proveedores"
      entityNameSingular="Proveedor"
      defaultEntityState={defaultEntityState}
      fields={fields}
      columns={columns}
      message={message}
      searchBy={searchBy}
    />
  );
};

export default SupplierManager;
