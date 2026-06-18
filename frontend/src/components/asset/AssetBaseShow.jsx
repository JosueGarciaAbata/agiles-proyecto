import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import GenericStyles from "../../generic/styles/GenericStyles";
import SearchBar from "../../generic/SearchBar";
import AssetTableShow from "./AssetTableShow";
import AssetFilters from "../../generic/filters/AssetFilters";
import { useAssetsContext } from "../../provider/AssetsContext";
import BatchModal from "./lote/BatchModal";

const AssetShow = ({ columns, role }) => {
  const navigate = useNavigate();
  const [openBatch, setOpenBatch] = useState(false);
  const {
    isReady,
    deleteAsset,
    filterAssetsByTerm,
    updateFilters,
    filteredAssets,
  } = useAssetsContext();

  // Esto permite basicamente resetar los filtros cuando se pierda el foco en la pagina de "ver".
  // Es decir, si va a editar, crear o lo que sea y dejo a medias el search, pues este es resetado.
  useEffect(() => {
    return () => {
      filterAssetsByTerm("");
    };
  }, [navigate]);

  // No hacer un fetch contra la base, sino contra mis datos ya cargados.
  const onFetch = async (searchTerm) => {
    filterAssetsByTerm(searchTerm);
  };

  // 2. El padre es notifiacdo.
  const handleFilterChange = async (updatedFilters) => {
    if (!updatedFilters || Object.keys(updatedFilters).length === 0) {
      updateFilters({
        locations: [],
        incomes: [],
        categories: [],
        devices: [],
        status: [],
      });
      return;
    }

    const formatted = buildFilterPayload(updatedFilters);
    updateFilters(formatted);
  };

  const buildFilterPayload = (updatedFilters) => {
    // Procesar los filtros y extraer solo los keys de cada array
    const processFilter = (filterArray) => {
      if (!filterArray || filterArray.length === 0) return [];
      return filterArray.map((item) => item.key); // Extraer los valores "key"
    };

    // Retornar un objeto con los filtros procesados
    return {
      incomes: processFilter(updatedFilters.incomes),
      locations: processFilter(updatedFilters.locations),
      categories: processFilter(updatedFilters.categories),
      devices: processFilter(updatedFilters.devices),
      status: processFilter(updatedFilters.status),
    };
  };

  const onCreate = () => {
    navigate("/dashboard/assets/create");
  };

  const onView = (id) => {
    navigate(`/dashboard/assets/show/${id}`);
  };

  const onDelete = (id, currentState) => {
    deleteAsset(id, currentState);
  };

  return (
    <div
      className="flexColumnCenter"
      style={{ width: "90%", marginTop: "40px" }}
    >
      <Box className="flewColumnCenter">
        <Box
          className="flexRowCenterEnd"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {/* Fila 1 */}
          <Box
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <h2 style={{ marginRight: "20px" }}>Activos</h2>

            <Box display="flex" gap="1rem">
              <Button
                onClick={() => setOpenBatch(true)}
                variant="contained"
                sx={GenericStyles.buttonStyle}
                startIcon={<AddIcon />}
              >
                Agregar en lote
              </Button>
              <Button
                onClick={onCreate}
                variant="contained"
                sx={GenericStyles.buttonStyle}
                startIcon={<AddIcon />}
              >
                Agregar activo
              </Button>
            </Box>
          </Box>

          {/* Fila 2 */}
          <Box
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: "16px",
            }}
          >
            <SearchBar
              placeholder={`Buscar por número de serie`}
              onSearch={onFetch}
            />

            <AssetFilters onFilterChange={handleFilterChange} />
          </Box>
        </Box>
      </Box>

      <Box className="flexColumnCenter" paddingTop="20px">
        <AssetTableShow
          isReady={isReady}
          data={filteredAssets}
          columns={columns}
          onDelete={onDelete}
          onView={onView}
        />
      </Box>

      <BatchModal open={openBatch} onClose={() => setOpenBatch(false)} />
    </div>
  );
};

export default AssetShow;
