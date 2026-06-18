import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import Chip from "@mui/material/Chip";

const Filters = ({ data, onFilterChange, clearFilters, setClearFilters }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedValues, setSelectedValues] = useState({});

  useEffect(() => {
    if (clearFilters) {
      setSelectedValues({});
      onFilterChange({});
      setClearFilters(false);
    }
  }, [clearFilters]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAutocompleteChange = (key, newValue) => {
    setSelectedValues((prev) => {
      const updated = { ...prev, [key]: newValue };
      onFilterChange(updated);
      return updated;
    });
  };

  const handleClearFilters = () => {
    setSelectedValues({});
    onFilterChange({});
  };

  return (
    <Box>
      {/* Botón de Filtros */}
      <IconButton
        onClick={handleClick}
        sx={{ color: "primary.main" }}
        aria-label="Filtros"
      >
        <FilterListIcon />
        <Typography variant="body2" sx={{ ml: 1 }}>
          Filtros
        </Typography>
      </IconButton>

      {/* Menú Desplegable */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ style: { padding: 10 } }}
        sx={{
          "& .MuiPaper-root": {
            width: "500px", // Ajusta el ancho del menú
            maxHeight: "500px", // Limita la altura si hay muchos filtros
            overflowY: "auto", // Añade scroll si el contenido supera la altura
          },
        }}
      >
        {data.map((item) => (
          <Box
            key={item.key}
            sx={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "0.5rem",
              marginRight: "1rem",
            }}
          >
            <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
              {item.label}
            </Typography>
            <Autocomplete
              multiple
              id={`filter-${item.key}`}
              options={item.options}
              getOptionLabel={(option) => option.label}
              value={selectedValues[item.key] || []}
              onChange={(event, newValue) =>
                handleAutocompleteChange(item.key, newValue)
              }
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    key={option.key}
                    label={option.label}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Seleccionar"
                />
              )}
              sx={{ width: "100%" }}
            />
          </Box>
        ))}
        {/* Botón para limpiar */}
        <MenuItem onClick={handleClearFilters} sx={{ color: "secondary.main" }}>
          Limpiar filtros
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Filters;
