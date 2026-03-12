import React, { useState } from "react";
import Modal, { FormGroup, Input, Select, FormGrid, FormActions } from "../components/Modal";
import { industriaConfig } from "../config/industrias";

const dataInicial = {
  construccion: [
    { id:1, nombre:"Excavadora CAT 320", tipo:"Excavadora", marca:"Caterpillar 320", año:2021, ubicacion:"Monterrey, NL", estado:"Rentada", cliente:"Constructora del Norte" },
    { id:2, nombre:"Grúa Liebherr LTM", tipo:"Grúa", marca:"Liebherr LTM 1060", año:2020, ubicacion:"SLP, SLP", estado:"Rentada", cliente:"JRSA Infraestructura" },
    { id:3, nombre:"Retroexcavadora JD", tipo:"Retroexcavadora", marca:"John Deere 310L", año:2019, ubicacion:"CDMX", estado:"Vencida", cliente:"Obras y Soluciones" },
    { id:4, nombre:"Compactadora CASE", tipo:"Compactadora", marca:"CASE 1107F", año:2022, ubicacion:"Guadalajara, JAL", estado:"Rentada", cliente:"GHL Construcciones" },
    { id:5, nombre:"Motoniveladora CAT", tipo:"Niveladora", marca:"Caterpillar 140M", año:2021, ubicacion:"Almacén Central", estado:"Disponible", cliente:"—" },
  ],
  transporte: [
    { id:1, nombre:"Camión Kenworth T680", tipo:"Camión", marca:"Kenworth T680", año:2022, ubicacion:"Base Norte", estado:"Rentada", cliente:"Logística Express" },
    { id:2, nombre:"Trailer Freightliner", tipo:"Trailer", marca:"Freightliner Cascadia", año:2021, ubicacion:"Base Sur", estado:"Disponible", cliente:"—" },
    { id:3, nombre:"Camioneta Sprinter", tipo:"Van", marca:"Mercedes Sprinter", año:2023, ubicacion:"CDMX", estado:"Rentada", cliente:"Distribuidora Central" },
  ],
  movilidad: [
    { id:1, nombre:"Sedan Toyota Corolla", tipo:"Sedan", marca:"Toyota Corolla", año:2023, ubicacion:"Zona Norte", estado:"Rentada", cliente:"Juan Pérez" },
    { id:2, nombre:"SUV Honda CR-V", tipo:"SUV", marca:"Honda CR-V", año:2022, ubicacion:"Zona Sur", estado:"Disponible", cliente:"—" },
    { id:3, nombre:"Pickup Ford Ranger", tipo:"Pickup", marca:"Ford Ranger", año:2023, ubicacion:"Zona Centro", estado:"Rentada", cliente:"María García" },
  ],
  medico: [
    { id:1, nombre:"Resonancia MRI 3T", tipo:"Resonancia", marca:"Siemens Magnetom", año:2021, ubicacion:"Piso 2", estado:"Rentada", cliente:"Hospital Central" },
    { id:2, nombre:"Tomógrafo CT", tipo:"Tomógrafo", marca:"GE Revolution", año:2020, ubicacion:"Piso 1", estado:"Disponible", cliente:"—" },
    { id:3, nombre:"Ultrasonido Portátil", tipo:"Ultrasonido", marca:"Philips Lumify", año:2022, ubicacion:"Urgencias", estado:"Rentada", cliente:"Clínica del Norte" },
  ],
  inmobiliaria: [
    { id:1, nombre:"Local Comercial Plaza Norte", tipo:"Local Comercial", marca:"Av. Principal 123", año:2015, ubicacion:"Col. Centro", estado:"Rentada", cliente:"Tienda XYZ" },
    { id:2, nombre:"Oficina Torre Empresarial", tipo:"Oficina", marca:"Blvd. Corporativo 456", año:2018, ubicacion:"Col. Corporativa", estado:"Disponible", cliente:"—" },
    { id:3, nombre:"Bodega Industrial", tipo:"Bodega", marca:"Zona Industrial 789", año:2010, ubicacion:"Parque Industrial", estado:"Rentada", cliente:"Empresa ABC" },
  ],
};

const estadoStyle = {
  Rentada:    { bg:"#e8f0ff", color:"#0071e3" },
  Disponible: { bg:"#e8f8ee", color:"#1a7f37" },
  Vencida:    { bg:"#fff0ee", color:"#ff3b30" },
  Mantenimiento: { bg:"#fff8e8", color:"#ff9500" },
};

function Maquinaria({ industria = "construccion" }) {
  const config = industriaConfig[industria] || industriaConfig.construccion;
  const inicial = { nombre:"", tipo:"", marca:"", año:"", ubicacion:"", estado:"Disponible", cliente:"—" };

  const [data, setData] = useState(dataInicial[industria] || dataInicial.construccion);
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmarId, setConfirmarId] = useState(null);
  const [form, setForm] = useState(inicial);
  const [toast, setToast] = useState("");

  const filtrados = data.filter(m =>
    `${m.nombre} ${m.tipo} ${m.marca}`.toLowerCase().includes(q.toLowerCase())
  );

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  function handleSave() {
    if (!form.nombre || !form.marca) { showToast("Completa los campos obligatorios"); return; }
    setData([...data, { ...form, id: Date.now() }]);
    setForm(inicial);
    setModalOpen(false);
    showToast(`${config.activo} agregado ✓`);
  }

  function handleDelete(id) {
    setData(data.filter(m => m.id !== id));
    setConfirmarId(null);
    showToast("Eliminado correctamente");
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>
        <div>
          <p style={styles.pageTag}>{config.activo}</p>
          <h1 style={styles.title}>{config.activoPlural}</h1>
        </div>
        <div style={styles.topbarRight}>
          <div style={styles.searchBox}>
            <span className="material-icons" style={styles.searchIcon}>search</span>
            <input style={styles.searchInput} placeholder={`Buscar ${config.activoPlural.toLowerCase()}...`} value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <button style={styles.btnAdd} onClick={() => setModalOpen(true)}>
            <span className="material-icons" style={{ fontSize:18 }}>add</span>
            Nuevo
          </button>
        </div>
      </div>

      <div style={styles.miniGrid}>
        {[
          { label:"Total", value:data.length, icon:config.activoIcon, color:"#1d1d1f" },
          { label:"Rentado", value:data.filter(m=>m.estado==="Rentada").length, icon:"handshake", color:"#00b4d8" },
          { label:"Disponible", value:data.filter(m=>m.estado==="Disponible").length, icon:"check_circle", color:"#1a7f37" },
          { label:"Mantenimiento", value:data.filter(m=>m.estado==="Mantenimiento").length, icon:"build", color:"#ff9500" },
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
            <span className="material-icons" style={{ fontSize:18, color:"#00b4d8" }}>{config.activoIcon}</span>
            <div style={styles.cardTitle}>{filtrados.length} {config.activoPlural.toLowerCase()}</div>
          </div>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>{[config.activoCampos.nombre, config.activoCampos.tipo, config.activoCampos.marca, config.activoCampos.año, config.activoCampos.ubicacion, "Estado", "Cliente", ""].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtrados.map(m => (
              <tr key={m.id} style={styles.tr}>
                <td style={{...styles.td, fontWeight:600}}>{m.nombre}</td>
                <td style={{...styles.td, color:"#6e6e73"}}>{m.tipo}</td>
                <td style={styles.td}>{m.marca}</td>
                <td style={{...styles.td, color:"#6e6e73"}}>{m.año}</td>
                <td style={{...styles.td, color:"#6e6e73"}}>{m.ubicacion}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background:estadoStyle[m.estado]?.bg, color:estadoStyle[m.estado]?.color }}>{m.estado}</span>
                </td>
                <td style={{...styles.td, color:"#6e6e73"}}>{m.cliente}</td>
                <td style={styles.td}>
                  {confirmarId === m.id ? (
                    <div style={styles.confirmBox}>
                      <span style={styles.confirmText}>¿Eliminar?</span>
                      <button style={styles.btnConfirm} onClick={() => handleDelete(m.id)}>Sí</button>
                      <button style={styles.btnCancelar} onClick={() => setConfirmarId(null)}>No</button>
                    </div>
                  ) : (
                    <button style={styles.btnDelete} onClick={() => setConfirmarId(m.id)}>
                      <span className="material-icons" style={{ fontSize:16 }}>delete</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Nuevo ${config.activo}`}>
        <FormGrid>
          <FormGroup label={`${config.activoCampos.nombre} *`}>
            <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder={config.activoEjemplos.nombre} />
          </FormGroup>
          <FormGroup label={config.activoCampos.tipo}>
            <Input name="tipo" value={form.tipo} onChange={handleChange} placeholder={config.activoEjemplos.tipo} />
          </FormGroup>
          <FormGroup label={`${config.activoCampos.marca} *`}>
            <Input name="marca" value={form.marca} onChange={handleChange} placeholder={config.activoEjemplos.marca} />
          </FormGroup>
          <FormGroup label={config.activoCampos.año}>
            <Input name="año" type="number" value={form.año} onChange={handleChange} placeholder="2023" />
          </FormGroup>
          <FormGroup label={config.activoCampos.ubicacion}>
            <Input name="ubicacion" value={form.ubicacion} onChange={handleChange} placeholder="Ubicación" />
          </FormGroup>
          <FormGroup label="Estado">
            <Select name="estado" value={form.estado} onChange={handleChange}>
              <option>Disponible</option>
              <option>Rentada</option>
              <option>Mantenimiento</option>
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

export default Maquinaria;