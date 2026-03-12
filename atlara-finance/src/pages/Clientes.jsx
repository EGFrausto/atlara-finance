import React, { useState } from "react";
import Modal, { FormGroup, Input, FormGrid, FormActions } from "../components/Modal";

const inicial = { nombre:"", empresa:"", tel:"", correo:"", rfc:"", direccion:"" };

const dataInicial = [
  { id:1, nombre: "Ing. Carlos Méndez", empresa: "Constructora del Norte", tel: "867-123-4567", correo: "cmendez@cdnorte.mx", rfc: "CDN901210AB3", ops: 3 },
  { id:2, nombre: "Lic. Ramón Salinas", empresa: "JRSA Infraestructura", tel: "444-987-6543", correo: "rsalinas@jrsa.mx", rfc: "RSA850315CD7", ops: 2 },
  { id:3, nombre: "Arq. Patricia Leal", empresa: "GHL Construcciones", tel: "555-321-8765", correo: "pleal@ghl.com.mx", rfc: "GHL920718EF2", ops: 1 },
  { id:4, nombre: "Ing. Roberto Pérez", empresa: "Pérez Ingeniería", tel: "811-456-7890", correo: "rperez@pinge.mx", rfc: "PIE880420GH9", ops: 0 },
  { id:5, nombre: "C.P. Ana Orozco", empresa: "Obras y Soluciones SA", tel: "33-654-3210", correo: "aorozco@obrasysoluciones.mx", rfc: "OSA780605IJ5", ops: 4 },
];

function Clientes() {
  const [data, setData] = useState(dataInicial);
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmarId, setConfirmarId] = useState(null);
  const [form, setForm] = useState(inicial);
  const [toast, setToast] = useState("");

  const filtrados = data.filter(c =>
    `${c.nombre} ${c.empresa} ${c.rfc}`.toLowerCase().includes(q.toLowerCase())
  );

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave() {
    if (!form.nombre || !form.empresa) {
      showToast("Por favor completa los campos obligatorios");
      return;
    }
    setData([...data, { ...form, id: Date.now(), ops: 0 }]);
    setForm(inicial);
    setModalOpen(false);
    showToast("Cliente agregado exitosamente ✓");
  }

  function handleDelete(id) {
    setData(data.filter(c => c.id !== id));
    setConfirmarId(null);
    showToast("Cliente eliminado");
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>
        <div>
          <p style={styles.pageTag}>Clientes</p>
          <h1 style={styles.title}>Base de Clientes</h1>
        </div>
        <div style={styles.topbarRight}>
          <div style={styles.searchBox}>
            <span className="material-icons" style={styles.searchIcon}>search</span>
            <input
              style={styles.searchInput}
              placeholder="Buscar clientes..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
          <button style={styles.btnAdd} onClick={() => setModalOpen(true)}>
            <span className="material-icons" style={{ fontSize: 18 }}>add</span>
            Nuevo Cliente
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.cardHeaderLeft}>
            <span className="material-icons" style={{ fontSize: 18, color: "#00b4d8" }}>people</span>
            <div style={styles.cardTitle}>{filtrados.length} clientes</div>
          </div>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Nombre","Empresa","Teléfono","Correo","RFC","Operaciones",""].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((c) => (
              <tr key={c.id} style={styles.tr}>
                <td style={{...styles.td, fontWeight:600}}>{c.nombre}</td>
                <td style={styles.td}>{c.empresa}</td>
                <td style={{...styles.td, color:"#6e6e73"}}>{c.tel}</td>
                <td style={{...styles.td, color:"#00b4d8"}}>{c.correo}</td>
                <td style={{...styles.td, color:"#6e6e73", fontFamily:"monospace"}}>{c.rfc}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    background: c.ops > 0 ? "#e0f7fc" : "#f5f5f7",
                    color: c.ops > 0 ? "#00b4d8" : "#aeaeb2",
                  }}>
                    {c.ops} {c.ops === 1 ? "operación" : "operaciones"}
                  </span>
                </td>
                <td style={styles.td}>
                  {confirmarId === c.id ? (
                    <div style={styles.confirmBox}>
                      <span style={styles.confirmText}>¿Eliminar?</span>
                      <button style={styles.btnConfirm} onClick={() => handleDelete(c.id)}>Sí</button>
                      <button style={styles.btnCancelar} onClick={() => setConfirmarId(null)}>No</button>
                    </div>
                  ) : (
                    <button style={styles.btnDelete} onClick={() => setConfirmarId(c.id)}>
                      <span className="material-icons" style={{ fontSize: 16 }}>delete</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL NUEVO CLIENTE */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo Cliente">
        <FormGrid>
          <FormGroup label="Nombre completo *">
            <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ing. Juan Pérez" />
          </FormGroup>
          <FormGroup label="Empresa *">
            <Input name="empresa" value={form.empresa} onChange={handleChange} placeholder="Constructora SA" />
          </FormGroup>
          <FormGroup label="Teléfono">
            <Input name="tel" value={form.tel} onChange={handleChange} placeholder="867-123-4567" />
          </FormGroup>
          <FormGroup label="Correo">
            <Input name="correo" type="email" value={form.correo} onChange={handleChange} placeholder="correo@empresa.mx" />
          </FormGroup>
          <FormGroup label="RFC">
            <Input name="rfc" value={form.rfc} onChange={handleChange} placeholder="ABC123456XYZ" />
          </FormGroup>
          <FormGroup label="Dirección">
            <Input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Calle, Ciudad, Estado" />
          </FormGroup>
        </FormGrid>
        <FormActions onCancel={() => setModalOpen(false)} onSave={handleSave} />
      </Modal>

      {toast && (
        <div style={styles.toast}>
          <span className="material-icons" style={{ fontSize: 16 }}>check_circle</span>
          {toast}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding:"0 40px 40px", marginLeft:240, background:"#f5f5f7", minHeight:"100vh" },
  topbar: { display:"flex", justifyContent:"space-between", alignItems:"flex-end", padding:"40px 0 28px", marginBottom:28 },
  pageTag: { fontSize:13, fontWeight:500, color:"#00b4d8", marginBottom:4 },
  title: { fontSize:34, fontWeight:700, color:"#1d1d1f", letterSpacing:-0.5 },
  topbarRight: { display:"flex", alignItems:"center", gap:12 },
  searchBox: { display:"flex", alignItems:"center", gap:8, background:"#ffffff", border:"1px solid #e5e5e7", borderRadius:12, padding:"10px 16px", boxShadow:"0 2px 8px rgba(0,0,0,.06)" },
  searchIcon: { fontSize:18, color:"#aeaeb2" },
  searchInput: { border:"none", outline:"none", fontSize:14, color:"#1d1d1f", background:"transparent", width:200 },
  btnAdd: { display:"flex", alignItems:"center", gap:6, background:"#00b4d8", color:"#fff", border:"none", borderRadius:12, padding:"10px 18px", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" },
  card: { background:"#ffffff", borderRadius:16, border:"1px solid #e5e5e7", boxShadow:"0 2px 8px rgba(0,0,0,.06)", overflow:"hidden" },
  cardHeader: { padding:"20px 24px", borderBottom:"1px solid #f0f0f0" },
  cardHeaderLeft: { display:"flex", alignItems:"center", gap:8 },
  cardTitle: { fontSize:15, fontWeight:600, color:"#1d1d1f" },
  table: { width:"100%", borderCollapse:"collapse" },
  th: { textAlign:"left", fontSize:12, fontWeight:500, color:"#aeaeb2", textTransform:"uppercase", letterSpacing:0.5, padding:"12px 24px", borderBottom:"1px solid #f0f0f0" },
  tr: { borderBottom:"1px solid #f5f5f7" },
  td: { padding:"16px 24px", fontSize:14, color:"#1d1d1f" },
  badge: { display:"inline-block", padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600 },
  btnDelete: { background:"#fff0ee", border:"none", borderRadius:8, padding:"6px 8px", cursor:"pointer", color:"#ff3b30", display:"flex", alignItems:"center" },
  confirmBox: { display:"flex", alignItems:"center", gap:6 },
  confirmText: { fontSize:13, color:"#ff3b30", fontWeight:500 },
  btnConfirm: { background:"#ff3b30", color:"#fff", border:"none", borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:600, cursor:"pointer" },
  btnCancelar: { background:"#f5f5f7", color:"#6e6e73", border:"none", borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:500, cursor:"pointer" },
  toast: { position:"fixed", bottom:24, right:24, background:"#1d1d1f", color:"#fff", padding:"12px 20px", borderRadius:12, fontSize:14, fontWeight:500, display:"flex", alignItems:"center", gap:8, boxShadow:"0 8px 24px rgba(0,0,0,.2)" },
};

export default Clientes;