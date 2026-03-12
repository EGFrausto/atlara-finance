import React, { useState } from "react";
import Modal, { FormGroup, Input, Select, FormGrid, FormActions } from "../components/Modal";

const inicial = { cliente:"", contrato:"", monto:"", fecha:"", estado:"Pendiente" };

const dataInicial = [
  { id:1, cliente:"Constructora del Norte", contrato:"#A-203", monto:"$45,000", fecha:"28 Feb 2025", estado:"Pagado" },
  { id:2, cliente:"JRSA Infraestructura", contrato:"#A-204", monto:"$72,000", fecha:"15 Mar 2025", estado:"Pendiente" },
  { id:3, cliente:"Obras y Soluciones SA", contrato:"#A-197", monto:"$28,000", fecha:"10 Mar 2025", estado:"Vencido" },
  { id:4, cliente:"GHL Construcciones", contrato:"#A-201", monto:"$18,000", fecha:"30 Mar 2025", estado:"Pendiente" },
  { id:5, cliente:"Constructora del Norte", contrato:"#A-203", monto:"$45,000", fecha:"31 Ene 2025", estado:"Pagado" },
];

const estadoStyle = {
  Pagado:   { bg:"#e8f8ee", color:"#1a7f37", icon:"check_circle" },
  Pendiente:{ bg:"#e0f7fc", color:"#00b4d8", icon:"schedule" },
  Vencido:  { bg:"#fff0ee", color:"#ff3b30", icon:"warning" },
};

function Pagos() {
  const [data, setData] = useState(dataInicial);
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmarId, setConfirmarId] = useState(null);
  const [form, setForm] = useState(inicial);
  const [toast, setToast] = useState("");

  const filtrados = data.filter(p =>
    `${p.cliente} ${p.contrato}`.toLowerCase().includes(q.toLowerCase())
  );

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  function handleSave() {
    if (!form.cliente || !form.monto) { showToast("Completa los campos obligatorios"); return; }
    setData([...data, { ...form, id: Date.now() }]);
    setForm(inicial);
    setModalOpen(false);
    showToast("Pago registrado ✓");
  }

  function handleDelete(id) {
    setData(data.filter(p => p.id !== id));
    setConfirmarId(null);
    showToast("Pago eliminado");
  }

  function marcarPagado(id) {
    setData(data.map(p => p.id === id ? { ...p, estado:"Pagado" } : p));
    showToast("Pago marcado como recibido ✓");
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>
        <div>
          <p style={styles.pageTag}>Pagos</p>
          <h1 style={styles.title}>Control de Pagos</h1>
        </div>
        <div style={styles.topbarRight}>
          <div style={styles.searchBox}>
            <span className="material-icons" style={styles.searchIcon}>search</span>
            <input style={styles.searchInput} placeholder="Buscar pagos..." value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <button style={styles.btnAdd} onClick={() => setModalOpen(true)}>
            <span className="material-icons" style={{ fontSize:18 }}>add</span>
            Registrar Pago
          </button>
        </div>
      </div>

      <div style={styles.miniGrid}>
        {[
          { label:"Pagados", value:"$320,000", icon:"check_circle", color:"#1a7f37" },
          { label:"Pendientes", value:"$90,000", icon:"schedule", color:"#00b4d8" },
          { label:"Vencidos", value:"$28,000", icon:"warning", color:"#ff3b30" },
          { label:"Total mes", value:"$438,000", icon:"payments", color:"#1d1d1f" },
        ].map((s,i) => (
          <div key={i} style={styles.miniCard}>
            <span className="material-icons" style={{ fontSize:20, color:s.color }}>{s.icon}</span>
            <div style={{ ...styles.miniValue, color:s.color }}>{s.value}</div>
            <div style={styles.miniLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.cardHeaderLeft}>
            <span className="material-icons" style={{ fontSize:18, color:"#00b4d8" }}>payments</span>
            <div style={styles.cardTitle}>{filtrados.length} registros</div>
          </div>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>{["Cliente","Contrato","Monto","Fecha","Estado","Acción",""].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtrados.map(p => (
              <tr key={p.id} style={styles.tr}>
                <td style={{...styles.td, fontWeight:600}}>{p.cliente}</td>
                <td style={{...styles.td, color:"#00b4d8", fontWeight:600}}>{p.contrato}</td>
                <td style={{...styles.td, fontWeight:700}}>{p.monto}</td>
                <td style={{...styles.td, color:"#6e6e73"}}>{p.fecha}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background:estadoStyle[p.estado]?.bg, color:estadoStyle[p.estado]?.color, display:"inline-flex", alignItems:"center", gap:4 }}>
                    <span className="material-icons" style={{ fontSize:12 }}>{estadoStyle[p.estado]?.icon}</span>
                    {p.estado}
                  </span>
                </td>
                <td style={styles.td}>
                  {p.estado === "Pendiente" && (
                    <button style={styles.btnPrimary} onClick={() => marcarPagado(p.id)}>Cobrar</button>
                  )}
                  {p.estado === "Vencido" && (
                    <button style={styles.btnDanger} onClick={() => showToast("Recordatorio enviado ✓")}>Recordar</button>
                  )}
                  {p.estado === "Pagado" && (
                    <button style={styles.btnGhost}>Ver recibo</button>
                  )}
                </td>
                <td style={styles.td}>
                  {confirmarId === p.id ? (
                    <div style={styles.confirmBox}>
                      <span style={styles.confirmText}>¿Eliminar?</span>
                      <button style={styles.btnConfirm} onClick={() => handleDelete(p.id)}>Sí</button>
                      <button style={styles.btnCancelar} onClick={() => setConfirmarId(null)}>No</button>
                    </div>
                  ) : (
                    <button style={styles.btnDelete} onClick={() => setConfirmarId(p.id)}>
                      <span className="material-icons" style={{ fontSize:16 }}>delete</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Registrar Pago">
        <FormGrid>
          <FormGroup label="Cliente *">
            <Input name="cliente" value={form.cliente} onChange={handleChange} placeholder="Constructora del Norte" />
          </FormGroup>
          <FormGroup label="Contrato">
            <Input name="contrato" value={form.contrato} onChange={handleChange} placeholder="#A-203" />
          </FormGroup>
          <FormGroup label="Monto *">
            <Input name="monto" value={form.monto} onChange={handleChange} placeholder="$45,000" />
          </FormGroup>
          <FormGroup label="Fecha">
            <Input name="fecha" type="date" value={form.fecha} onChange={handleChange} />
          </FormGroup>
          <FormGroup label="Estado">
            <Select name="estado" value={form.estado} onChange={handleChange}>
              <option>Pagado</option>
              <option>Pendiente</option>
              <option>Vencido</option>
            </Select>
          </FormGroup>
        </FormGrid>
        <FormActions onCancel={() => setModalOpen(false)} onSave={handleSave} />
      </Modal>

      {toast && (
        <div style={styles.toast}>
          <span className="material-icons" style={{ fontSize:16 }}>check_circle</span>
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
  miniGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 },
  miniCard: { background:"#ffffff", borderRadius:16, padding:"20px", border:"1px solid #e5e5e7", boxShadow:"0 2px 8px rgba(0,0,0,.06)", display:"flex", flexDirection:"column", gap:8 },
  miniValue: { fontSize:28, fontWeight:700, letterSpacing:-1 },
  miniLabel: { fontSize:13, color:"#6e6e73", fontWeight:500 },
  card: { background:"#ffffff", borderRadius:16, border:"1px solid #e5e5e7", boxShadow:"0 2px 8px rgba(0,0,0,.06)", overflow:"hidden" },
  cardHeader: { padding:"20px 24px", borderBottom:"1px solid #f0f0f0" },
  cardHeaderLeft: { display:"flex", alignItems:"center", gap:8 },
  cardTitle: { fontSize:15, fontWeight:600, color:"#1d1d1f" },
  table: { width:"100%", borderCollapse:"collapse" },
  th: { textAlign:"left", fontSize:12, fontWeight:500, color:"#aeaeb2", textTransform:"uppercase", letterSpacing:0.5, padding:"12px 24px", borderBottom:"1px solid #f0f0f0" },
  tr: { borderBottom:"1px solid #f5f5f7" },
  td: { padding:"16px 24px", fontSize:14, color:"#1d1d1f" },
  badge: { display:"inline-block", padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600 },
  btnPrimary: { background:"#00b4d8", color:"#fff", border:"none", borderRadius:8, padding:"8px 16px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" },
  btnDanger: { background:"#fff0ee", color:"#ff3b30", border:"none", borderRadius:8, padding:"8px 16px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" },
  btnGhost: { background:"#f5f5f7", color:"#6e6e73", border:"none", borderRadius:8, padding:"8px 16px", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit" },
  btnDelete: { background:"#fff0ee", border:"none", borderRadius:8, padding:"6px 8px", cursor:"pointer", color:"#ff3b30", display:"flex", alignItems:"center" },
  confirmBox: { display:"flex", alignItems:"center", gap:6 },
  confirmText: { fontSize:13, color:"#ff3b30", fontWeight:500 },
  btnConfirm: { background:"#ff3b30", color:"#fff", border:"none", borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:600, cursor:"pointer" },
  btnCancelar: { background:"#f5f5f7", color:"#6e6e73", border:"none", borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:500, cursor:"pointer" },
  toast: { position:"fixed", bottom:24, right:24, background:"#1d1d1f", color:"#fff", padding:"12px 20px", borderRadius:12, fontSize:14, fontWeight:500, display:"flex", alignItems:"center", gap:8, boxShadow:"0 8px 24px rgba(0,0,0,.2)" },
};

export default Pagos;