import React from "react";

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            <span className="material-icons" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>
        <div style={styles.body}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function FormGroup({ label, children }) {
  return (
    <div style={formStyles.group}>
      <label style={formStyles.label}>{label}</label>
      {children}
    </div>
  );
}

export function Input({ ...props }) {
  return <input style={formStyles.input} {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <select style={formStyles.input} {...props}>
      {children}
    </select>
  );
}

export function FormGrid({ children }) {
  return <div style={formStyles.grid}>{children}</div>;
}

export function FormActions({ onCancel, onSave }) {
  return (
    <div style={formStyles.actions}>
      <button style={formStyles.btnCancel} onClick={onCancel}>Cancelar</button>
      <button style={formStyles.btnSave} onClick={onSave}>Guardar</button>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.4)",
    backdropFilter: "blur(4px)",
    zIndex: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "#ffffff",
    borderRadius: 20,
    width: 540,
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 24px 60px rgba(0,0,0,.15)",
    border: "1px solid #e5e5e7",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 28px",
    borderBottom: "1px solid #f0f0f0",
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1d1d1f",
    letterSpacing: -0.3,
  },
  closeBtn: {
    background: "#f5f5f7",
    border: "none",
    borderRadius: 8,
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#6e6e73",
  },
  body: {
    padding: "24px 28px",
  },
};

const formStyles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 8,
  },
  group: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#6e6e73",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    border: "1px solid #e5e5e7",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 14,
    color: "#1d1d1f",
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
    background: "#f5f5f7",
    transition: "border-color .15s",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 24,
    paddingTop: 20,
    borderTop: "1px solid #f0f0f0",
  },
  btnCancel: {
    background: "#f5f5f7",
    color: "#6e6e73",
    border: "none",
    borderRadius: 10,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnSave: {
    background: "#00b4d8",
    color: "#ffffff",
    border: "none",
    borderRadius: 10,
    padding: "10px 24px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};

export default Modal;