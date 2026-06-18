import GenericManager from "../GenericManager";
import { getDecodedToken } from "../../utils/authService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ResponsibleManager = () => {
  const role = getDecodedToken()?.role;
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") {
      navigate("/dashboard/maintance");
    }
  }, [role, navigate]);

  const apiConfig = {
    fetchAll: "/responsibles",
    fetchOne: "/responsibles",
    fetchSearch: "/responsibles/search?term=",
    create: "/responsibles",
    update: "/responsibles",
    delete: "/responsibles",
  };

  const defaultEntityState = {
    is_ext: "",
    dni_res: "",
    nam_res: "",
    las_res: "",
    ema_res: "",
    pho_res: "",
  };

  //   En los modales
  const fields = [
    {
      key: "is_ext",
      label: "Tipo",
      type: "select",
      options: [
        { value: "Y", label: "Interno" },
        { value: "N", label: "Externo" },
      ],
      showCreate: true,
      showUpdate: true,
    },
    {
      key: "dni_res",
      label: "Cedula",
      type: "text",
      showCreate: true,
      showUpdate: true,
    },
    {
      key: "nam_res",
      label: "Nombre",
      type: "text",
      showCreate: true,
      showUpdate: true,
    },
    {
      key: "las_res",
      label: "Apellido",
      type: "text",
      showCreate: true,
      showUpdate: true,
    },
    {
      key: "ema_res",
      label: "Correo",
      type: "text",
      showCreate: true,
      showUpdate: true,
    },
    {
      key: "pho_res",
      label: "Telefono",
      type: "text",
      showCreate: true,
      showUpdate: true,
    },
  ];

  //   En la tabla
  const columns = [
    { key: "dni_res", label: "Cedula" },
    { key: "nam_res", label: "Nombre" },
    { key: "las_res", label: "Apellido" },
    { key: "pho_res", label: "Telefono" },
    { key: "ema_res", label: "Correo" },
    { key: "is_ext", label: "Tipo" },
  ];

  const message = "dni_res";

  const searchBy = "cedula";

  return (
    <GenericManager
      apiConfig={apiConfig}
      entityNamePlural="Responsables"
      entityNameSingular="Responsable"
      defaultEntityState={defaultEntityState}
      fields={fields}
      columns={columns}
      message={message}
      searchBy={searchBy}
    />
  );
};

export default ResponsibleManager;
