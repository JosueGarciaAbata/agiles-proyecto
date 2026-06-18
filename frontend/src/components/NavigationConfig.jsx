import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PlaceIcon from "@mui/icons-material/Place";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";
import HandymanIcon from "@mui/icons-material/Handyman";
import { getDecodedToken } from "../utils/authService";
import { Link } from "react-router-dom";

export const navigationAdmin = [
  {
    kind: "page",
    pattern: "dashboard/users",
    segment: "dashboard/users",
    title: (
      <Link
        to="/dashboard/users"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        Usuarios
      </Link>
    ),
    icon: <PersonIcon style={{ color: "white" }} />,
  },
  {
    segment: "dashboard/responsibles",
    title: (
      <Link
        to={"/dashboard/responsibles"}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        Responsables
      </Link>
    ),
    icon: <AssignmentIndIcon style={{ color: "white" }} />,
  },
  {
    segment: "dashboard/suppliers",
    title: (
      <Link
        to={"/dashboard/suppliers"}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        Proveedores
      </Link>
    ),
    icon: <LocalShippingIcon style={{ color: "white" }} />,
  },
  {
    segment: "dashboard/locations",
    title: (
      <Link
        to={"/dashboard/locations"}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        Ubicaciones
      </Link>
    ),
    icon: <PlaceIcon style={{ color: "white" }} />,
  },

  {
    segment: "dashboard/incomes",
    title: (
      <Link
        to={"/dashboard/incomes"}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        Ingresos
      </Link>
    ),
    icon: <AttachMoneyIcon style={{ color: "white" }} />,
  },
  {
    segment: "dashboard/assets",
    title: (
      <Link
        to={"/dashboard/assets"}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        Activos
      </Link>
    ),
    icon: <InventoryIcon style={{ color: "white" }} />, // Ícono blanco
  },
  {
    segment: "dashboard/maintance",
    title: (
      <Link
        to={"/dashboard/maintance"}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        Mantenimientos
      </Link>
    ),
    icon: <HandymanIcon style={{ color: "white" }} />, // Ícono blanco
  },
  {
    segment: "dashboard/reports",
    title: (
      <Link
        to={"/dashboard/reports"}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        Reportes
      </Link>
    ),
    icon: <BarChartIcon style={{ color: "white" }} />, // Ícono blanco
  },
];

export const navigationUser = [
  {
    segment: "dashboard/assets",
    title: (
      <Link
        to={"/dashboard/assets"}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        Activos
      </Link>
    ),
    icon: <InventoryIcon style={{ color: "white" }} />, // Ícono blanco
  },
  {
    segment: "dashboard/maintance",
    title: (
      <Link
        to={"/dashboard/maintance"}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        Mantenimientos
      </Link>
    ),
    icon: <HandymanIcon style={{ color: "white" }} />, // Ícono blanco
  },
];

export const navigationGuest = [
  {
    segment: "login",
    title: (
      <Link
        to="/login"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        Iniciar sesión
      </Link>
    ),
    icon: <PersonIcon style={{ color: "white" }} />,
  },
];

export const getNavigationByRole = () => {
  const decodedToken = getDecodedToken();
  const role = decodedToken?.role;

  if (!role) {
    return navigationGuest;
  }

  if (role === "admin") {
    return navigationAdmin;
  } else if (role === "user") {
    return navigationUser;
  }

  return navigationGuest;
};
