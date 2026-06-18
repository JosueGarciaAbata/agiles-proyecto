import MaintanceBaseShow from "./MaintanceBaseShow";

const MaintanceShow = () => {
  const columns = [
    { key: "cod_main", label: "Código" },
    { key: "created_at", label: "Fecha de inicio" },
    { key: "ended_at", label: "Fecha fin" },
    { key: "responsable", label: "Responsable" },
    { key: "type", label: "Tipo de mantenimiento" },
  ];

  return <MaintanceBaseShow columns={columns} />;
};

export default MaintanceShow;
