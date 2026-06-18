import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AssetModalTable from "./AssetModalTable";

const AssetSelector = ({ data, onAdd }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Typography
        variant="subtitle1"
        width="100%"
        color="#6068A5"
        fontWeight="bold"
      >
        Activos
      </Typography>

      <Box
        sx={{
          marginTop: "2.2rem",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
          disabled={!(data.length > 0)}
          sx={{
            margin: "0 15px",
            whiteSpace: "nowrap",
          }}
        >
          +
        </Button>
      </Box>

      <AssetModalTable
        open={openModal}
        onClose={() => setOpenModal(false)}
        assets={data}
        onAdd={onAdd}
      />
    </>
  );
};

export default AssetSelector;
