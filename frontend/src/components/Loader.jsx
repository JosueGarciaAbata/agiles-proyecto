import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const Loader = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <CircularProgress />
      <Typography variant="subtitle1" sx={{ marginTop: "10px" }}>
        Cargando datos, por favor espera...
      </Typography>
    </div>
  );
};

export default Loader;
