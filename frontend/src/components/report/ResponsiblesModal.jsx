import { Typography, TextField, MenuItem, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { generateErrorMessage } from "../../utils/validations";
import axiosInstance from "../../utils/api";
import ModalWrapper from "./ModalWrapper";
import GeneralWrapper from "./GeneralWrapper";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import ReusableDatePicker from "./ReusableDatePicker";
import BaseModal from "./BaseModal";
import generateResponsiblesPDF from "./generateResponsiblesPDF";
import { useDataContext } from "./../../provider/DataContext";

dayjs.extend(utc);

const ResponsiblesModal = (props) => {
  // const [responsibles, setResponsibles] = useState([]);
  const { data } = useDataContext();

  const initialState = {
    idResponsible: "",
    startDate: null,
    endDate: null,
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({
    idResponsible: false,
    startDate: false,
    endDate: false,
  });

  // const [isReady, setIsReady] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axiosInstance.get("/responsibles");
  //       setResponsibles(response.data.results);
  //       setIsReady(true);
  //     } catch (error) {
  //       if (error.response.data.errors) {
  //         const message = generateErrorMessage(error.response.data.errors);
  //         toast.error(message);
  //       } else {
  //         toast.error("Error inesperado al obtener responsables.");
  //       }
  //     }
  //   };

  //   fetchData();
  // }, []);

  // if (!isReady) {
  //   return null;
  // }

  const renderResponsibles = () =>
    data?.responsibles.length > 0 ? (
      data?.responsibles.map((responsible) => (
        <MenuItem key={responsible.id} value={responsible.dni_res}>
          {`${responsible.dni_res} - ${responsible.nam_res} ${responsible.las_res}`}
        </MenuItem>
      ))
    ) : (
      <MenuItem>No hay responsables por el momento</MenuItem>
    );

  const handleReponsible = (idResponsible) => {
    setFormData((prev) => ({ ...prev, idResponsible: idResponsible }));
    setErrors((prev) => ({ ...prev, idResponsible: "" }));
  };

  const handleStarDate = (date) => {
    const transformedDate = transformDate(date);
    setFormData((prev) => ({ ...prev, startDate: transformedDate }));
    setErrors((prev) => ({ ...prev, startDate: "" }));
  };
  const handleEndDate = (date) => {
    const transformedDate = transformDate(date);
    setFormData((prev) => ({ ...prev, endDate: transformedDate }));
    setErrors((prev) => ({ ...prev, endDate: "" }));
  };

  const transformDate = (date) => {
    try {
      return date ? dayjs(date).utc().format("YYYY-MM-DDTHH:mm:ss[Z]") : null;
    } catch (error) {
      return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.idResponsible) {
      newErrors.idResponsible = "Ingrese un responsable";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Ingrese una fecha válida";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Ingrese una fecha válida";
    }

    if (formData.startDate && formData.endDate) {
      const start = dayjs(formData.startDate);
      const end = dayjs(formData.endDate);

      if (start.isAfter(end)) {
        newErrors.startDate =
          "La fecha de inicio no puede ser mayor que la fecha de fin";
        newErrors.endDate =
          "La fecha de fin no puede ser menor que la fecha de inicio";
      }
    }

    return newErrors;
  };

  const handleReport = async () => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).length > 0;

    if (hasErrors) {
      return;
    }
    const responsibleData = data.responsibles.find(
      (responsible) => responsible.dni_res === formData.idResponsible
    );

    try {
      const responsible = formData.idResponsible,
        created_at = dayjs(formData.startDate).format("YYYY-MM-DD HH:mm:ss"),
        ended_at = dayjs(formData.endDate).format("YYYY-MM-DD HH:mm:ss");

      const inicio = dayjs(formData.startDate).format("MM-DD-YYYY");
      const fin = dayjs(formData.endDate).format("MM-DD-YYYY");

      const formattedData = {
        responsible,
        created_at,
        ended_at,
      };

      const response = await axiosInstance.post(
        "/report/maintenances-by-responsible",
        formattedData
      );
      const results = response.data.results;
      console.log("resultados reporte", results);

      generateResponsiblesPDF(responsibleData, results, inicio, fin);
      setFormData(initialState);
    } catch (error) {
      console.log(error);
      if (error.response?.data?.errors) {
        toast.error("No se pudo obtener el reporte");
      } else {
        toast.error("Error inesperado al obtener responsables.");
      }
    }
  };

  return (
    <BaseModal
      open={props.open}
      handleClose={props.handleClose}
      label="Mantenimiento de responsables"
    >
      <GeneralWrapper>
        <ModalWrapper>
          <Typography>Responsables</Typography>
          <TextField
            select
            label="Seleccione algun responsable"
            value={formData["idResponsible"] || ""}
            onChange={(e) => handleReponsible(e.target.value)}
            sx={{ width: "50%" }}
            error={!!errors.idResponsible}
            helperText={errors.idResponsible}
          >
            {renderResponsibles()}
          </TextField>
        </ModalWrapper>
        <ModalWrapper>
          <Typography>Fecha de inicio</Typography>
          <ReusableDatePicker
            label="Mes, dia y año"
            value={formData["startDate"]}
            onChange={(date) => handleStarDate(date)}
            error={!!errors.startDate}
            helperText={errors.startDate}
          />
        </ModalWrapper>
        <ModalWrapper>
          <Typography>Fecha de fin</Typography>
          <ReusableDatePicker
            label="Mes, dia y año"
            value={formData["endDate"]}
            onChange={(date) => handleEndDate(date)}
            error={!!errors.endDate}
            helperText={errors.endDate}
          />
        </ModalWrapper>
        <ModalWrapper>
          <Button variant="contained" onClick={handleReport}>
            Generar reporte
          </Button>
        </ModalWrapper>
      </GeneralWrapper>
    </BaseModal>
  );
};

export default ResponsiblesModal;
