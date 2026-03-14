import React, { useState } from "react";
import Modal, { FormGroup, Input, Select, FormGrid, FormActions } from "../components/Modal";
import { industriaConfig } from "../config/industrias";

const dataInicial = {
  construccion: [
    { id:1, nombre:"Constructora del Norte", contacto:"Carlos Méndez", correo:"carlos@constructoranorte.mx", telefono:"81 1234 5678", ciudad:"Monterrey, NL", estado:"Activo" },
    { id:2, nombre:"JRSA Infraestructura", contacto:"Jorge Ramírez", correo:"jorge@jrsa.mx", telefono:"55 9876 5432", ciudad:"CDMX", estado:"Activo" },
    { id:3, nombre:"Obras y Soluciones SA", contacto:"Ana Flores", correo:"ana@obrasys.mx", telefono:"33 5555 1234", ciudad:"Guadalajara, JAL", estado:"Inactivo" },
    { id:4, nombre:"GHL Construcciones", contacto:"Gabriela López", correo:"gabi@ghl.mx", telefono:"81 8888 9999", ciudad:"Monterrey, NL", estado:"Activo" },
  ],
  transporte: [
    { id:1, nombre:"Logística Express MX", contacto:"Roberto Silva", correo:"roberto@logex.mx", telefono:"55 1111 2222", ciudad:"CDMX", estado:"Activo" },
    { id:2, nombre:"Distribuidora Central", contacto:"María Torres", correo:"maria@distcentral.mx", telefono:"33 3333 4444", ciudad:"Guadalajara, JAL", estado:"Activo" },
    { id:3, nombre:"Transportes del Norte", contacto:"Juan Garza", correo:"juan@transnorte.mx", telefono:"81 5555 6666", ciudad:"Monterrey, NL", estado:"Inactivo" },
  ],
  movilidad: [
    { id:1, nombre:"Juan Pérez", contacto:"Juan Pérez", correo:"juan@gmail.com", telefono:"55 1234 5678", ciudad:"CDMX", estado:"Activo" },
    { id:2, nombre:"María García", contacto:"María García", correo:"maria@gmail.com", telefono:"55 8765 4321", ciudad:"CDMX", estado:"Activo" },
    { id:3, nombre:"Pedro Martínez", contacto:"Pedro Martínez", correo:"pedro@gmail.com", telefono:"55 9999 0000", ciudad:"CDMX", estado:"Inactivo" },
  ],
  medico: [
    { id:1, nombre:"Hospital Central", contacto:"Dr. Ricardo Vega", correo:"rvega@hospitalcentral.mx", telefono:"55 2222 3333", ciudad:"CDMX", estado:"Activo" },
    { id:2, nombre:"Clínica del Norte", contacto:"Dra. Laura Soto", correo:"lsoto@clinicanorte.mx", telefono:"81 4444 5555", ciudad:"Monterrey, NL", estado:"Activo" },
    { id:3, nombre:"Centro Médico Sur", contacto:"Dr. Miguel Ruiz", correo:"mruiz@cmedicosur.mx", telefono:"33 6666 7777", ciudad:"Guadalajara, JAL", estado:"Inactivo" },
  ],
  inmobiliaria: [
    { id:1, nombre:"Tienda XYZ", contacto:"Luis Hernández", correo:"luis@tiendaxyz.mx", telefono:"55 7777 8888", ciudad:"CDMX", estado:"Activo" },
    { id:2, nombre:"Empresa ABC", contacto:"Sandra Morales", correo:"sandra@empresaabc.mx", telefono:"81 9999 0000", ciudad:"Monterrey, NL", estado:"Activo" },
    { id:3, nombre:"Oficinas Corp SA", contacto:"Fernando Díaz", correo:"fernando@oficinascorp.mx", telefono:"33 1111 2222", ciudad:"Guadalajara, JAL", estado:"Inactivo" },
  ],
};

const estadoStyle = {
  Activo:   { bg:"#e8f8ee", color:"#1a7f37" },
  Inactivo: { bg:"#f5f5f7", color:"#aeaeb2" },
};

function Clientes({ industria = "construccion" }) {
  const config = industriaConfig[industria] || industriaConfig.construccion;
  const inicial = { nombre:"", contacto:"", correo:"", telefono:"", ciudad:"", estado:"Activo" };
  const [data, setData] = useState(dataInicial[industria] || dataInicial.construccion);
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmarId, setConfirmarId] = useState(null);
  const [form, setForm] = useState(inicial);
  const [toast, setToast] = useState("");

  const filtrados = data.filter(c =>
    `${c.nombre} ${c.contacto} ${c.ciudad}`.toLowerCase().includes(q.toLowerCase())
  );

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  function handleSave() {
    if (!form.nombre || !form.contacto) { showToast("Completa los campos obligatorios"); return; }
    setData([...data, { ...form, id: Date.now() }]);
    setForm(inicial);
    setModalOpen(false);
    showToast("Cliente agregado ✓");
  }

  function handleDelete(id) {
    setData(data.filter(c => c.id !== id));
    setConfirmarId(null);
    showToast("Cliente eliminado");
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>
        <div>
          <p style={styles.pageTag}>Clientes</p>
          <h1 style={styles.title}>Clientes</h1>
        </div>
        <div style={styles.topbarRight}>
          <div style={styles.searchBox}>
            <span className="material-icons" style={styles.searchIcon}>search</span>
            <input style={styles.searchInput} placeholder="Buscar clientes..." value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <button style={styles.btnAdd} onClick={() => setModalOpen(true)}>
            <span className="material-icons" style={{ fontSize:18 }}>add</span>
            Nuevo Cliente
          </button>
        </div>
      </div>

      <div style={styles.miniGrid}>
        {[
          { label:"Total", value:data.length, icon:"people", color:"#1d1d1f" },
          { label:"Activos", value:data.filter(c=>c.estado==="Activo").length, icon:"check_circle", color:"#1a7f37" },
          { label:"Inactivos", value:data.filter(c=>c.estado==="Inactivo").length, icon:"pause_circle", color:"#aeaeb2" },
          { label:`Con ${config.activo}`, value:data.filter(c=>c.estado==="Activo").length, icon:config.activoIcon, color:"#00b4d8" },
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
            <span className="material-icons" style={{ fontSize:18, color:"#00b4d8" }}>people</span>
            <div style={styles.cardTitle}>{filtrados.length} clientes</div>
          </div>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>{["Empresa","Contacto","Correo","Teléfono","Ciudad","Estado",""].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtrados.map(c => (
              <tr key={c.id} style={styles.tr}>
                <td style={{...styles.td, fontWeight:600}}>{c.nombre}</td>
                <td style={styles.td}>{c.contacto}</td>
                <td style={{...styles.td, color:"#6e6e73"}}>{c.correo}</td>
                <td style={{...styles.td, color:"#6e6e73"}}>{c.telefono}</td>
                <td style={{...styles.td, color:"#6e6e73"}}>{c.ciudad}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background:estadoStyle[c.estado]?.bg, color:estadoStyle[c.estado]?.color }}>{c.estado}</span>
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
                      <span className="material-icons" style={{ fontSize:16 }}>delete</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo Cliente">
        <FormGrid>
          <FormGroup label="Empresa *">
            <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Constructora del Norte" />
          </FormGroup>
          <FormGroup label="Contacto *">
            <Input name="contacto" value={form.contacto} onChange={handleChange} placeholder="Carlos Méndez" />
          </FormGroup>
          <FormGroup label="Correo">
            <Input name="correo" type="email" value={form.correo} onChange={handleChange} placeholder="correo@empresa.mx" />
          </FormGroup>
          <FormGroup label="Teléfono">
            <Input name="telefono" value={form.telefono} onChange={handleChange} placeholder="81 1234 5678" />
          </FormGroup>
          <FormGroup label="Ciudad">
            <Input name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="Monterrey, NL" />
          </FormGroup>
          <FormGroup label="Estado">
            <Select name="estado" value={form.estado} onChange={handleChange}>
              <option>Activo</option>
              <option>Inactivo</option>
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
  page: { padding:"0 40px 40px", background:"#f5f5f7", minHeight:"100vh" },
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
  miniValue: { fontSize:32, fontWeight:700, letterSpacing:-1 },
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
  btnDelete: { background:"#fff0ee", border:"none", borderRadius:8, padding:"6px 8px", cursor:"pointer", color:"#ff3b30", display:"flex", alignItems:"center" },
  confirmBox: { display:"flex", alignItems:"center", gap:6 },
  confirmText: { fontSize:13, color:"#ff3b30", fontWeight:500 },
  btnConfirm: { background:"#ff3b30", color:"#fff", border:"none", borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:600, cursor:"pointer" },
  btnCancelar: { background:"#f5f5f7", color:"#6e6e73", border:"none", borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:500, cursor:"pointer" },
  toast: { position:"fixed", bottom:24, right:24, background:"#1d1d1f", color:"#fff", padding:"12px 20px", borderRadius:12, fontSize:14, fontWeight:500, display:"flex", alignItems:"center", gap:8, boxShadow:"0 8px 24px rgba(0,0,0,.2)" },
};

export default Clientes;