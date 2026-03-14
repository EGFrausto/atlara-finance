import React, { useState } from "react";
import Modal, { FormGroup, Input, Select, FormGrid, FormActions } from "../components/Modal";
import { industriaConfig } from "../config/industrias";

const dataInicial = {
  construccion: [
    { id:1, id_contrato:"#A-203", cliente:"Constructora del Norte", maquina:"Excavadora CAT 320", inicio:"01 Ene 2025", fin:"31 Mar 2025", costo:"$45,000", estado:"Activo" },
    { id:2, id_contrato:"#A-204", cliente:"JRSA Infraestructura", maquina:"Grúa Liebherr LTM", inicio:"01 Feb 2025", fin:"15 Abr 2025", costo:"$72,000", estado:"Activo" },
    { id:3, id_contrato:"#A-197", cliente:"Obras y Soluciones SA", maquina:"Retroexcavadora JD", inicio:"10 Nov 2024", fin:"10 Mar 2025", costo:"$28,000", estado:"Vencido" },
    { id:4, id_contrato:"#A-201", cliente:"GHL Construcciones", maquina:"Compactadora CASE", inicio:"01 Mar 2025", fin:"30 Abr 2025", costo:"$18,000", estado:"Pendiente" },
  ],
  transporte: [
    { id:1, id_contrato:"#T-101", cliente:"Logística Express MX", maquina:"Camión Kenworth T680", inicio:"01 Ene 2026", fin:"31 Mar 2026", costo:"$35,000", estado:"Activo" },
    { id:2, id_contrato:"#T-102", cliente:"Distribuidora Central", maquina:"Camioneta Sprinter", inicio:"01 Feb 2026", fin:"30 Abr 2026", costo:"$18,000", estado:"Activo" },
    { id:3, id_contrato:"#T-098", cliente:"Transportes del Norte", maquina:"Trailer Freightliner", inicio:"01 Nov 2025", fin:"31 Ene 2026", costo:"$52,000", estado:"Vencido" },
  ],
  movilidad: [
    { id:1, id_contrato:"#M-201", cliente:"Juan Pérez", maquina:"Sedan Toyota Corolla", inicio:"01 Mar 2026", fin:"31 Mar 2026", costo:"$8,500", estado:"Activo" },
    { id:2, id_contrato:"#M-202", cliente:"María García", maquina:"Pickup Ford Ranger", inicio:"15 Mar 2026", fin:"15 Abr 2026", costo:"$12,000", estado:"Activo" },
    { id:3, id_contrato:"#M-198", cliente:"Pedro Martínez", maquina:"SUV Honda CR-V", inicio:"01 Ene 2026", fin:"28 Feb 2026", costo:"$10,000", estado:"Vencido" },
  ],
  medico: [
    { id:1, id_contrato:"#H-301", cliente:"Hospital Central", maquina:"Resonancia MRI 3T", inicio:"01 Ene 2026", fin:"31 Dic 2026", costo:"$85,000", estado:"Activo" },
    { id:2, id_contrato:"#H-302", cliente:"Clínica del Norte", maquina:"Ultrasonido Portátil", inicio:"01 Feb 2026", fin:"31 Jul 2026", costo:"$22,000", estado:"Activo" },
    { id:3, id_contrato:"#H-298", cliente:"Centro Médico Sur", maquina:"Tomógrafo CT", inicio:"01 Sep 2025", fin:"28 Feb 2026", costo:"$95,000", estado:"Vencido" },
  ],
  inmobiliaria: [
    { id:1, id_contrato:"#I-401", cliente:"Tienda XYZ", maquina:"Local Comercial Plaza Norte", inicio:"01 Ene 2026", fin:"31 Dic 2026", costo:"$45,000", estado:"Activo" },
    { id:2, id_contrato:"#I-402", cliente:"Empresa ABC", maquina:"Bodega Industrial", inicio:"01 Mar 2026", fin:"28 Feb 2027", costo:"$32,000", estado:"Activo" },
    { id:3, id_contrato:"#I-398", cliente:"Oficinas Corp SA", maquina:"Oficina Torre Empresarial", inicio:"01 Jun 2025", fin:"31 Dic 2025", costo:"$28,000", estado:"Vencido" },
  ],
};

const estadoStyle = {
  Activo:     { bg:"#e8f8ee", color:"#1a7f37" },
  Vencido:    { bg:"#fff0ee", color:"#ff3b30" },
  Pendiente:  { bg:"#e8f0ff", color:"#0071e3" },
  Finalizado: { bg:"#f5f5f7", color:"#aeaeb2" },
};

function Contratos({ industria = "construccion" }) {
  const config = industriaConfig[industria] || industriaConfig.construccion;
  const inicial = { cliente:"", maquina:"", inicio:"", fin:"", costo:"", estado:"Activo" };

  const [data, setData] = useState(dataInicial[industria] || dataInicial.construccion);
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmarId, setConfirmarId] = useState(null);
  const [form, setForm] = useState(inicial);
  const [toast, setToast] = useState("");

  const filtrados = data.filter(c =>
    `${c.id_contrato} ${c.cliente} ${c.maquina}`.toLowerCase().includes(q.toLowerCase())
  );

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  function handleSave() {
    if (!form.cliente || !form.maquina) { showToast("Completa los campos obligatorios"); return; }
    const newId = `#A-${Math.floor(Math.random()*900)+200}`;
    setData([...data, { ...form, id: Date.now(), id_contrato: newId }]);
    setForm(inicial);
    setModalOpen(false);
    showToast("Contrato agregado ✓");
  }

  function handleDelete(id) {
    setData(data.filter(c => c.id !== id));
    setConfirmarId(null);
    showToast("Contrato eliminado");
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>
        <div>
          <p style={styles.pageTag}>Contratos</p>
          <h1 style={styles.title}>Gestión de Contratos</h1>
        </div>
        <div style={styles.topbarRight}>
          <div style={styles.searchBox}>
            <span className="material-icons" style={styles.searchIcon}>search</span>
            <input style={styles.searchInput} placeholder="Buscar contrato..." value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <button style={styles.btnAdd} onClick={() => setModalOpen(true)}>
            <span className="material-icons" style={{ fontSize:18 }}>add</span>
            Nuevo Contrato
          </button>
        </div>
      </div>

      <div style={styles.miniGrid}>
        {[
          { label:"Total", value:data.length, icon:"description", color:"#1d1d1f" },
          { label:"Activos", value:data.filter(c=>c.estado==="Activo").length, icon:"check_circle", color:"#1a7f37" },
          { label:"Pendientes", value:data.filter(c=>c.estado==="Pendiente").length, icon:"schedule", color:"#00b4d8" },
          { label:"Vencidos", value:data.filter(c=>c.estado==="Vencido").length, icon:"warning", color:"#ff3b30" },
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
            <span className="material-icons" style={{ fontSize:18, color:"#00b4d8" }}>description</span>
            <div style={styles.cardTitle}>{filtrados.length} contratos</div>
          </div>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>{["#","Cliente", config.activo,"Inicio","Fin","Costo/mes","Estado",""].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtrados.map(c => (
              <tr key={c.id} style={styles.tr}>
                <td style={{...styles.td, fontWeight:700, color:"#00b4d8"}}>{c.id_contrato}</td>
                <td style={{...styles.td, fontWeight:600}}>{c.cliente}</td>
                <td style={{...styles.td, color:"#6e6e73"}}>{c.maquina}</td>
                <td style={{...styles.td, color:"#6e6e73"}}>{c.inicio}</td>
                <td style={{...styles.td, color:"#6e6e73"}}>{c.fin}</td>
                <td style={{...styles.td, fontWeight:600}}>{c.costo}</td>
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo Contrato">
        <FormGrid>
          <FormGroup label="Cliente *">
            <Input name="cliente" value={form.cliente} onChange={handleChange} placeholder="Nombre del cliente" />
          </FormGroup>
          <FormGroup label={`${config.activo} *`}>
            <Input name="maquina" value={form.maquina} onChange={handleChange} placeholder={config.activoEjemplos.nombre} />
          </FormGroup>
          <FormGroup label="Fecha inicio">
            <Input name="inicio" type="date" value={form.inicio} onChange={handleChange} />
          </FormGroup>
          <FormGroup label="Fecha fin">
            <Input name="fin" type="date" value={form.fin} onChange={handleChange} />
          </FormGroup>
          <FormGroup label="Costo mensual">
            <Input name="costo" value={form.costo} onChange={handleChange} placeholder="$45,000" />
          </FormGroup>
          <FormGroup label="Estado">
            <Select name="estado" value={form.estado} onChange={handleChange}>
              <option>Activo</option>
              <option>Pendiente</option>
              <option>Vencido</option>
              <option>Finalizado</option>
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

export default Contratos;