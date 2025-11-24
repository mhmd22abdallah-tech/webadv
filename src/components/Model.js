import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Model({ isModelOpen, setIsModelOpen, children }) {
  if (!isModelOpen) {
    return null;
  }
  
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center">
      <div className="bg-white p-4 rounded shadow-lg" style={{ minWidth: "300px" }}>
        <button className="btn-close position-absolute top-0 end-0 m-3" onClick={() => setIsModelOpen(false)}></button>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

export default Model;
