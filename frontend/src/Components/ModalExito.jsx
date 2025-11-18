import React from "react";
import "./ModalExito.css";

const ModalExito = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>✔ Aviso</h2>
        <p>{message}</p>
        <button onClick={onClose}>Aceptar</button>
      </div>
    </div>
  );
};

export default ModalExito;
