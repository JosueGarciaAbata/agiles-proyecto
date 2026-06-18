import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GenericTable from "../../GenericTable";
import SearchBar from "../../../generic/SearchBar";
import { useAssetsContext } from "../../../provider/AssetsContext";
import AssetFilters from "../../../generic/filters/AssetFilters";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import categoryViewStyles from "../../../generic/styles/ViewStyles";
import tableStyles from "../../../generic/styles/TableStyles";

const AssetModalTable = ({ open, onClose, onAdd }) => {
  const { filteredAssets, updateFilters, filterAssetsByTerm } =
    useAssetsContext();

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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: "900px", maxWidth: "1600px" },
      }}
    >
      <DialogTitle>Añadir activos</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            margin: "1rem 0",
          }}
        >
          {/* Filtros */}
          <SearchBar
            placeholder={`Buscar por número de serie`}
            onSearch={filterAssetsByTerm}
          />

          <AssetFilters onFilterChange={handleFilterChange} />
          {/* --------- */}
        </Box>
        {filteredAssets?.length > 0 ? (
          <GenericTable
            data={filteredAssets}
            dataCount={filteredAssets.length}
            isDelete={false}
            setIsDelete={() => {}}
          >
            {(currentPageData) => (
              <>
                <TableHead sx={tableStyles.tableHead}>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Número de serie</TableCell>
                    <TableCell>Ubicación</TableCell>
                    <TableCell>Ingreso</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell>{""}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentPageData.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        backgroundColor: row?.isAdded
                          ? "#e0f7fa"
                          : "transparent",
                      }}
                    >
                      <TableCell>{row.cod_ass}</TableCell>
                      <TableCell>{row.ser_num_ass}</TableCell>
                      <TableCell>{row.location_name}</TableCell>
                      <TableCell>{row.income_code}</TableCell>
                      <TableCell>{row.category_name}</TableCell>
                      <TableCell>
                        {row?.isAdded ? (
                          <Typography variant="caption" color="success.main">
                            Agregado
                          </Typography>
                        ) : (
                          <IconButton onClick={() => onAdd(row)}>
                            <AddIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}
          </GenericTable>
        ) : (
          <Typography variant="subtitle1" marginTop="1.5rem">
            No se han encontrado datos.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          sx={categoryViewStyles.buttonStyle2}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssetModalTable;
