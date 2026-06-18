import React from "react";
import ContentTable from "./ContentTable";
import Loader from "../components/Loader";

const ContentGenericTable = ({
  isReady,
  isDelete,
  data,
  columns,
  onView,
  setIsDelete,
  onDelete,
  entityName,
}) => {
  if (!isReady) {
    return <Loader />;
  }

  if (!Array.isArray(data)) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        Error: los datos no son validos.
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        No hay {entityName} registrados.
      </div>
    );
  }

  return (
    <ContentTable
      data={data}
      columns={columns}
      onView={onView}
      onDelete={onDelete}
      setIsDelete={setIsDelete}
      isDelete={isDelete}
    />
  );
};

export default ContentGenericTable;
