const Wrapper = ({ children }) => {
  return (
    <div
      className="flexColumnCenter"
      style={{ width: "90%", marginTop: "40px" }}
    >
      {children}
    </div>
  );
};

export default Wrapper;
