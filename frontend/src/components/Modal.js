import React from "react";

const Modal = ({ show, onClose, onRoleSelect }) => {
  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Select Your Role</h2>
        <button onClick={() => onRoleSelect("Organizer")}>Organizer</button>
        <button onClick={() => onRoleSelect("User")}>User</button>
        <button onClick={() => onRoleSelect("Venue")}>Venue</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
