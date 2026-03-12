import React, { useState } from "react";
import Modal, { FormGroup, Input, Select, FormGrid, FormActions } from "../components/Modal";
import { industriaConfig } from "../config/industrias";

const dataInicial = {
  construccion: [
    { id:1, nombre:"Filtro hidráulico CAT", cantidad:12, precio:"$1,200", proveedor:"CAT Parts MX", compatible:"CAT 320, CAT 140M", stock:"OK" },
    { id:2, nombre:"Aceite motor 15W-40", cantidad:8, precio:"$480", proveedor:"Lubricantes del Norte", compatible:"General", stock:"OK" },
    { id:3, nombre:"Filtro de aire Komatsu", cantidad:3, precio:"$950", proveedor:"Komatsu Partes", compatible:"Komatsu PC210", stock:"Bajo" },
    { id:4, nombre:"Correa dentada JD", cantidad:2, precio:"$2,100", proveedor:"AgroPartes SA", compatible:"John Deere 310L", stock:"Crítico" },
  ],
  transporte: [
    { id:1, nombre:"Filtro de aceite Kenworth", cantidad:10, precio:"$850", proveedor:"Kenworth Parts", compatible:"T680", stock:"OK" },
    { id:2, nombre:"Llantas 295/75R22.5", cantidad:4, precio:"$4,200", proveedor:"Bridgestone MX", compatible:"General", stock:"Bajo" },
    { id:3, nombre:"Kit frenos traseros", cantidad:2, precio:"$3,500", proveedor:"Freightliner Parts", compatible:"Cascadia", stock:"Crítico" },
  ],
  movilidad: [
    { id:1, nombre:"Filtro de aire Toyota", cantidad:8, precio:"$350", proveedor:"Toyota Parts", compatible:"Corolla 2023", stock:"OK" },
    { id:2, nombre:"Pastillas de freno Honda", cantidad:4, precio:"$680", proveedor:"Honda Parts", compatible:"CR-V 2022", stock:"OK" },
    { id:3, nombre:"Aceite sintético 5W-30", cantidad:3, precio:"$420", proveedor:"Castrol MX", compatible:"General", stock:"Bajo" },
  ],
  medico: [
    { id:1, nombre:"Gel conductor ultrasonido", cantidad:20, precio:"$180", proveedor:"Medical Supply MX", compatible:"General", stock:"OK" },
    { id:2, nombre:"Filtro HEPA resonancia", cantidad:3, precio:"$8,500", proveedor:"Siemens Medical", compatible:"Magnetom", stock:"Bajo" },
    { id:3, nombre:"Electrodos ECG", cantidad:5, precio:"$2,200", proveedor:"Phillips Medical", compatible:"General", stock:"Crítico" },
  ],
  inmobiliaria: [
    { id:1, nombre:"Pintura vinílica blanca", cantidad:15, precio:"$320", proveedor:"Comex MX", compatible:"General", stock:"OK" },
    { id:2, nombre:"Kit fontanería básico", cantidad:4, precio:"$850", proveedor:"Helvex", compatible:"General", stock:"OK" },
    { id:3, nombre:"Focos LED 18W", cantidad:6, precio:"$120", proveedor:"Philips MX", compatible:"General", stock:"Bajo" },
  ],
};

const stockStyle = {
  OK:      { bg:"#e8f8ee", color:"#1a7f37", icon:"check_circle" },
  Bajo:    { bg:"#fff8e8", color:"#ff9500", icon:"warning" },
  Crítico: { bg:"#fff0ee", color:"#ff3b30", icon:"error" },
};

function Inventario({ industria = "construccion" }) {
  const config = industriaConfig[industria] || industriaConfig.construccion;
  const inicial = { nombre:"", cantidad:"", precio:"", proveedor:"", compatible:"", stock:"OK" };

  const [data, setData] = useState(dataInicial[industria] || dataInicial.construccion);
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmarId, setConfirmarId] = useState(null);
  const [form, setForm] = useState(inicial);
  const [toast, setToast] = useState("");

  const filtrados = data.filter(r =>
    `${r.nombre} ${r.proveedor} ${r.compatible}`.toLowerCase().includes(q.toLowerCase())
  );

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  function handleSave() {
    if (!form.nombre || !form.cantidad) { showToast("Completa los campos obligatorios"); return; }
    setData([...data, { ...form, id: Date.now() }]);
    setForm(inicial);
    setModalOpen(false);
    showToast("Artículo agregado ✓");
  }

  function handleDelete(id) {
    setData(data.filter(r => r.id !== id));
    setConfirmarId(null);
    showToast("Artículo eliminado");
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>
        <div>
          <p style={styles.pageTag}>{config.inventario}</p>
          <h1 style={styles.title}>{config.inventario}</h1>
        </div>
        <div style={styles.topbarRight}>
          <div style={styles.searchBox}>
            <span className="material-icons" style={styles.searchIcon}>search</span>
            <input style={styles.searchInput} placeholder={`Buscar ${config.inventario.toLowerCase()}...`} value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <button style={styles.btnAdd} onClick={() => setModalOpen(true)}>
            <span className="material-icons" style={{ fontSize:18 }}>add</span>
            Nuevo
          </button>
        </div>
      </div>

      <div style={styles.miniGrid}>
        {[
          { label:"Total artículos", value:data.length, icon:config.inventarioIcon, color:"#1d1d1f" },
          { label:"Stock OK", value:data.filter(r=>r.stock==="OK").length, icon:"check_circle", color:"#1a7f37" },
          { label:"Stock bajo", value:data.filter(r=>r.stock==="Bajo").length, icon:"warning", color:"#ff9500" },
          { label:"Crítico", value:data.filter(r=>r.stock==="Crítico").length, icon:"error", color:"#ff3b30" },
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
            <span className="material-icons" style={{ fontSize:18, color:"#00b4d8" }}>{config.inventarioIcon}</span>
            <div style={styles.cardTitle}>{filtrados.length} artículos</div>
          </div>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>{["Nombre","Cantidad","Precio unit.","Proveedor","Compatible con","Stock",""].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtrados.map(r => (
              <tr key={r.id} style={styles.tr}>
                <td style={{...styles.td, fontWeight:600}}>{r.nombre}</td>
                <td style={{...styles.td, fontWeight:700}}>{r.cantidad}</td>
                <td style={{...styles.td, color:"#6e6e73"}}>{r.precio}</td>
                <td style={{...styles.td, color:"#6e6e73"}}>{r.proveedor}</td>
                <td style={{...styles.td, color:"#6e6e73"}}>{r.compatible}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background:stockStyle[r.stock]?.bg, color:stockStyle[r.stock]?.color, display:"inline-flex", alignItems:"center", gap:4 }}>
                    <span className="material-icons" style={{ fontSize:12 }}>{stockStyle[r.stock]?.icon}</span>
                    {r.stock}
                  </span>
                </td>
                <td style={styles.td}>
                  {confirmarId === r.id ? (
                    <div style={styles.confirmBox}>
                      <span style={styles.confirmText}>¿Eliminar?</span>
                      <button style={styles.btnConfirm} onClick={() => handleDelete(r.id)}>Sí</button>
                      <button style={styles.btnCancelar} onClick={() => setConfirmarId(null)}>No</button>
                    </div>
                  ) : (
                    <button style={styles.btnDelete} onClick={() => setConfirmarId(r.id)}>
                      <span className="material-icons" style={{ fontSize:16 }}>delete</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Nuevo artículo — ${config.inventario}`}>
        <FormGrid>
          <FormGroup label="Nombre *">
            <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del artículo" />
          </FormGroup>
          <FormGroup label="Cantidad *">
            <Input name="cantidad" type="number" value={form.cantidad} onChange={handleChange} placeholder="10" />
          </FormGroup>
          <FormGroup label="Precio unitario">
            <Input name="precio" value={form.precio} onChange={handleChange} placeholder="$1,200" />
          </FormGroup>
          <FormGroup label="Proveedor">
            <Input name="proveedor" value={form.proveedor} onChange={handleChange} placeholder="Proveedor" />
          </FormGroup>
          <FormGroup label="Compatible con">
            <Input name="compatible" value={form.compatible} onChange={handleChange} placeholder="Equipos compatibles" />
          </FormGroup>
          <FormGroup label="Stock">
            <Select name="stock" value={form.stock} onChange={handleChange}>
              <option>OK</option>
              <option>Bajo</option>
              <option>Crítico</option>
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

export default Inventario;