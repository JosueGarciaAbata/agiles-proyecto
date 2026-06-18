import GenericManager from "../GenericManager";
import { getDecodedToken } from "../../utils/authService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserManager = () => {
  const role = getDecodedToken()?.role;
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") {
      navigate("/dashboard/maintance");
    }
  }, [role, navigate]);

  const apiConfig = {
    fetchAll: "/users",
    fetchOne: "/users",
    fetchSearch: "/users/search?term=",
    create: "/users",
    update: "/users",
    delete: "/users",
  };

  const defaultEntityState = {
    dni_usr: "",
    role: "",
    name: "",
    email: "",
    password: "",
  };

  //   En los modales
  const fields = [
    {
      key: "dni_usr",
      label: "Cedula",
      type: "text",
      showCreate: true,
      showUpdate: false,
    },
    {
      key: "role",
      label: "Rol",
      type: "select",
      options: [
        { value: "admin", label: "Administrador" },
        { value: "user", label: "Usuario" },
      ],
      showCreate: true,
      showUpdate: true,
    },
    {
      key: "name",
      label: "Nombre",
      type: "text",
      showCreate: true,
      showUpdate: true,
    },
    {
      key: "email",
      label: "Correo",
      type: "text",
      showCreate: true,
      showUpdate: true,
    },
    {
      key: "password",
      label: "Contraseña",
      type: "password",
      showCreate: true,
      showUpdate: true,
    },
  ];

  //   En la tabla
  const columns = [
    { key: "dni_usr", label: "Cedula" },
    { key: "name", label: "Nombre y Apellido" },
    { key: "email", label: "Correo" },
    { key: "role", label: "Rol" },
  ];

  const message = "name";

  const searchBy = "cedula";

  return (
    <GenericManager
      apiConfig={apiConfig}
      entityNamePlural="Usuarios"
      entityNameSingular="Usuario"
      defaultEntityState={defaultEntityState}
      fields={fields}
      columns={columns}
      message={message}
      searchBy={searchBy}
    />
  );
};

export default UserManager;
