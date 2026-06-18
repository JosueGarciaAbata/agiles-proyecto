import React, { useState, useEffect } from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { getNavigationByRole } from "../components/NavigationConfig";
import { demoTheme } from "../components/Theme";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { Outlet, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/api";
import { getDecodedToken, removeToken } from "../utils/authService";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { DataProvider } from "../provider/DataContext";
import { AssetsProvider } from "../provider/AssetsContext";
import { MaintenancesProvider } from "../provider/MaintenancesContext";

function Dashboard({ window }) {
  const navigate = useNavigate();

  const [session, setSession] = useState(() => {
    const decodedToken = getDecodedToken();
    if (!decodedToken) {
      navigate("/");
      return null;
    }

    return {
      user: {
        name: decodedToken.name,
        email: decodedToken.email,
      },
    };
  });

  const [navigation, setNavigation] = useState(getNavigationByRole);

  useEffect(() => {
    const handleNavigationUpdate = () => {
      setNavigation(getNavigationByRole());
    };

    handleNavigationUpdate();
  }, []);

  const authentication = {
    signOut: async () => {
      await axiosInstance.post("/logout");
      removeToken();
      setSession(null);
      navigate("/");
    },
  };

  return (
    <MaintenancesProvider>
      <AssetsProvider>
        <DataProvider>
          <AppProvider
            session={session}
            authentication={authentication}
            navigation={navigation}
            theme={demoTheme}
            branding={{
              homeUrl: "dashboard",
              logo: (
                <EngineeringIcon style={{ color: "white", fontSize: 35 }} />
              ),
              title: (
                <span style={{ color: "white" }}>
                  {" "}
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
                    Sistema de Mantenimientos
                  </Link>
                </span>
              ),
            }}
          >
            <DashboardLayout>
              <Box
                sx={{
                  py: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Outlet />
              </Box>
            </DashboardLayout>
          </AppProvider>
        </DataProvider>
      </AssetsProvider>
    </MaintenancesProvider>
  );
}

export default Dashboard;
