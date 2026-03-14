import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const dataInicial = {
  transporte: [
    { id:1, nombre:"Carlos Méndez", licencia:"Lic-A-001", tipo:"Licencia A", telefono:"81 1234 5678", unidad:"Camión Kenworth T680", estado:"Disponible", km:142830, rutas:48 },
    { id:2, nombre:"Jorge Ramírez", licencia:"Lic-A-002", tipo:"Licencia A", telefono:"55 9876 5432", unidad:"Trailer Freightliner", estado:"En ruta", km:98420, rutas:31 },
    { id:3, nombre:"Ana Torres", licencia:"Lic-B-003", tipo:"Licencia B", telefono:"33 5555 1234", unidad:"Van Mercedes Sprinter", estado:"Disponible", km:54200, rutas:22 },
    { id:4, nombre:"Luis García", licencia:"Lic-A-004", tipo:"Licencia A", telefono:"81 8888 9999", unidad:"Camión Kenworth T370", estado:"En ruta", km:201540, rutas:67 },
    { id:5, nombre:"María López", licencia:"Lic-A-005", tipo:"Licencia A", telefono:"81 4444 5555", unidad:"Trailer Peterbilt 579", estado:"Inactivo", km:310200, rutas:89 },
    { id:6, nombre:"Pedro Soto", licencia:"Lic-B-006", tipo:"Licencia B", telefono:"33 2222 3333", unidad:"Camión International LT", estado:"Disponible", km:77800, rutas:29 },
  ],
  movilidad: [
    { id:1, nombre:"Roberto Silva", licencia:"Lic-B-001", tipo:"Licencia B", telefono:"55 1111 2222", unidad:"Toyota Corolla", estado:"Disponible", km:45000, rutas:120 },
    { id:2, nombre:"Sandra Morales", licencia:"Lic-B-002", tipo:"Licencia B", telefono:"55 3333 4444", unidad:"Honda CR-V", estado:"En ruta", km:38000, rutas:98 },
    { id:3, nombre:"Fernando Díaz", licencia:"Lic-B-003", tipo:"Licencia B", telefono:"55 5555 6666", unidad:"Ford Ranger", estado:"Inactivo", km:62000, rutas:145 },
  ],
};

const estadoStyle = {
  "Disponible": { bg:"#e8f8ee", color:"#1a7f37" },
  "En ruta":    { bg:"#e8f0ff", color:"#0071e3" },
  "Inactivo":   { bg:"#f5f5f7", color:"#aeaeb2" },
};

const estadoColores = {
  "Disponible": "#1a7f37",
  "En ruta":    "#0071e3",
  "Inactivo":   "#aeaeb2",
};

const inicial = { nombre:"", licencia:"", tipo:"Licencia A", telefono:"", unidad:"", estado:"Disponible", km:"0", rutas:"0" };

function Operadores({ industria = "transporte" }) {
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmarId, setConfirmarId] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(inicial);
  const [toast, setToast] = useState("");

  // Cargar desde Firestore
  useEffect(() => {
    async function cargar() {
      try {
        const ref = doc(db, "operadores", industria);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setData(snap.data().items);
        } else {
          setData(dataInicial[industria] || dataInicial.transporte);
        }
      } catch (e) {
        console.error(e);
        setData(dataInicial[industria] || dataInicial.transporte);
      }
      setCargando(false);
    }
    cargar();
  }, [industria]);

  // Guardar en Firestore
  useEffect(() => {
    if (cargando) return;
    async function guardar() {
      try {
        const ref = doc(db, "operadores", industria);
        await setDoc(ref, { items: data });
      } catch (e) {
        console.error(e);
      }
    }
    guardar();
  }, [data, industria, cargando]);

  // Cerrar popup al click fuera
  useEffect(() => {
    function handleClick(e) {
      if (!e.target.closest(".estado-popup")) setEditandoId(null);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtrados = data.filter(o =>
    `${o.nombre} ${o.licencia} ${o.unidad}`.toLowerCase().includes(q.toLowerCase())
  );

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  function cambiarEstado(id, estado) {
    setData(data.map(o => o.id === id ? { ...o, estado } : o));
    showToast(`Operador marcado como ${estado}`);
  }

  function handleSave() {
    if (!form.nombre || !form.licencia) { showToast("Completa los campos obligatorios"); return; }
    setData([...data, { ...form, id: Date.now() }]);
    setForm(inicial);
    setModalOpen(false);
    showToast("Operador agregado ✓");
  }

  function handleDelete(id) {
    setData(data.filter(o => o.id !== id));
    setConfirmarId(null);
    showToast("Operador eliminado");
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  if (cargando) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
      <div style={{ fontSize:14, color:"#aeaeb2", fontWeight:500 }}>Cargando...</div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>
        <div>
          <p style={styles.pageTag}>Operadores</p>
          <h1 style={styles.title}>Operadores</h1>
        </div>
        <div style={styles.topbarRight}>
          <div style={styles.searchBox}>
            <span className="material-icons" style={styles.searchIcon}>search</span>
            <input style={styles.searchInput} placeholder="Buscar operador..." value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <button style={styles.btnAdd} onClick={() => setModalOpen(true)}>
            <span className="material-icons" style={{ fontSize:18 }}>add</span>
            Nuevo Operador
          </button>
        </div>
      </div>

      <div style={styles.miniGrid}>
        {[
          { label:"Total", value:data.length, icon:"people", color:"#1d1d1f" },
          { label:"Disponibles", value:data.filter(o=>o.estado==="Disponible").length, icon:"check_circle", color:"#1a7f37" },
          { label:"En ruta", value:data.filter(o=>o.estado==="En ruta").length, icon:"navigation", color:"#0071e3" },
          { label:"Inactivos", value:data.filter(o=>o.estado==="Inactivo").length, icon:"pause_circle", color:"#aeaeb2" },
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
          <span className="material-icons" style={{ fontSize:18, color:"#00b4d8" }}>badge</span>
          <div style={styles.cardTitle}>{filtrados.length} operadores</div>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>{["Nombre","Licencia","Teléfono","Unidad asignada","Km","Rutas","Estado",""].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtrados.map(o => (
              <tr key={o.id} style={styles.tr}>
                <td style={{...styles.td, fontWeight:700}}>{o.nombre}</td>
                <td style={{...styles.td, color:"#00b4d8", fontWeight:600}}>{o.licencia}</td>
                <td style={{...styles.td, color:"#6e6e73"}}>{o.telefono}</td>
                <td style={styles.td}>{o.unidad}</td>
                <td style={{...styles.td, color:"#6e6e73"}}>{Number(o.km).toLocaleString()} km</td>
                <td style={{...styles.td, fontWeight:600}}>{o.rutas}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background:estadoStyle[o.estado]?.bg, color:estadoStyle[o.estado]?.color }}>{o.estado}</span>
                </td>
                <td style={styles.td}>
                  <div style={{ display:"flex", gap:6, position:"relative" }} className="estado-popup">
                    <button
                      style={styles.btnEdit}
                      onClick={() => setEditandoId(editandoId === o.id ? null : o.id)}
                    >
                      <span className="material-icons" style={{ fontSize:16 }}>edit</span>
                    </button>
                    {confirmarId === o.id ? (
                      <div style={styles.confirmBox}>
                        <span style={styles.confirmText}>¿Eliminar?</span>
                        <button style={styles.btnConfirm} onClick={() => handleDelete(o.id)}>Sí</button>
                        <button style={styles.btnCancelar} onClick={() => setConfirmarId(null)}>No</button>
                      </div>
                    ) : (
                      <button style={styles.btnDelete} onClick={() => setConfirmarId(o.id)}>
                        <span className="material-icons" style={{ fontSize:16 }}>delete</span>
                      </button>
                    )}
                    {editandoId === o.id && (
                      <div style={styles.miniPopup} className="estado-popup">
                        <div style={styles.miniPopupTitle}>Cambiar estado</div>
                        {["Disponible","En ruta","Inactivo"].map(e => (
                          <div
                            key={e}
                            onClick={() => { cambiarEstado(o.id, e); setEditandoId(null); }}
                            style={{ ...styles.miniPopupOption, ...(o.estado === e ? styles.miniPopupOptionActive : {}) }}
                          >
                            <div style={{ ...styles.miniDot, background: estadoColores[e] }} />
                            {e}
                          </div>
                        ))}
                        <button style={styles.miniPopupCerrar} onClick={() => setEditandoId(null)}>Cancelar</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>Nuevo Operador</div>
              <button style={styles.btnCerrar} onClick={() => setModalOpen(false)}>
                <span className="material-icons" style={{ fontSize:18 }}>close</span>
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGrid}>
                {[
                  { label:"Nombre *", name:"nombre", placeholder:"Carlos Méndez" },
                  { label:"No. Licencia *", name:"licencia", placeholder:"Lic-A-007" },
                  { label:"Teléfono", name:"telefono", placeholder:"81 1234 5678" },
                  { label:"Unidad asignada", name:"unidad", placeholder:"Camión Kenworth T680" },
                ].map(f => (
                  <div key={f.name} style={styles.formGroup}>
                    <label style={styles.label}>{f.label}</label>
                    <input name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} style={styles.input} />
                  </div>
                ))}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tipo de licencia</label>
                  <select name="tipo" value={form.tipo} onChange={handleChange} style={styles.input}>
                    <option>Licencia A</option>
                    <option>Licencia B</option>
                    <option>Licencia C</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Estado inicial</label>
                  <select name="estado" value={form.estado} onChange={handleChange} style={styles.input}>
                    <option>Disponible</option>
                    <option>En ruta</option>
                    <option>Inactivo</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.btnGhost} onClick={() => setModalOpen(false)}>Cancelar</button>
              <button style={styles.btnPrimary} onClick={handleSave}>Guardar operador</button>
            </div>
          </div>
        </div>
      )}

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
  cardHeader: { display:"flex", alignItems:"center", gap:8, padding:"20px 24px", borderBottom:"1px solid #f0f0f0" },
  cardTitle: { fontSize:15, fontWeight:600, color:"#1d1d1f" },
  table: { width:"100%", borderCollapse:"collapse" },
  th: { textAlign:"left", fontSize:12, fontWeight:500, color:"#aeaeb2", textTransform:"uppercase", letterSpacing:0.5, padding:"12px 24px", borderBottom:"1px solid #f0f0f0" },
  tr: { borderBottom:"1px solid #f5f5f7" },
  td: { padding:"14px 24px", fontSize:14, color:"#1d1d1f" },
  badge: { display:"inline-block", padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600 },
  btnEdit: { background:"#f0fdf8", border:"none", borderRadius:8, padding:"6px 8px", cursor:"pointer", color:"#00b4d8", display:"flex", alignItems:"center" },
  btnDelete: { background:"#fff0ee", border:"none", borderRadius:8, padding:"6px 8px", cursor:"pointer", color:"#ff3b30", display:"flex", alignItems:"center" },
  confirmBox: { display:"flex", alignItems:"center", gap:6 },
  confirmText: { fontSize:13, color:"#ff3b30", fontWeight:500 },
  btnConfirm: { background:"#ff3b30", color:"#fff", border:"none", borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:600, cursor:"pointer" },
  btnCancelar: { background:"#f5f5f7", color:"#6e6e73", border:"none", borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:500, cursor:"pointer" },
  miniPopup: { position:"absolute", right:0, top:36, background:"#ffffff", borderRadius:14, boxShadow:"0 8px 32px rgba(0,0,0,.15)", padding:"12px", zIndex:50, minWidth:160, border:"1px solid #e5e5e7" },
  miniPopupTitle: { fontSize:11, fontWeight:600, color:"#aeaeb2", textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 },
  miniPopupOption: { display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:500, color:"#1d1d1f" },
  miniPopupOptionActive: { background:"#f0fdf8", color:"#00b4d8" },
  miniDot: { width:8, height:8, borderRadius:"50%", flexShrink:0 },
  miniPopupCerrar: { width:"100%", marginTop:8, background:"#f5f5f7", border:"none", borderRadius:8, padding:"7px", fontSize:12, color:"#6e6e73", cursor:"pointer", fontFamily:"inherit" },
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 },
  modal: { background:"#fff", borderRadius:20, width:520, maxHeight:"90vh", overflow:"hidden", display:"flex", flexDirection:"column" },
  modalHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"24px", borderBottom:"1px solid #f0f0f0" },
  modalTitle: { fontSize:18, fontWeight:700, color:"#1d1d1f" },
  btnCerrar: { background:"#f5f5f7", border:"none", borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#6e6e73" },
  modalBody: { padding:"24px", overflowY:"auto" },
  formGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 },
  formGroup: { display:"flex", flexDirection:"column", gap:6 },
  label: { fontSize:12, fontWeight:600, color:"#6e6e73", textTransform:"uppercase", letterSpacing:0.5 },
  input: { border:"1px solid #e5e5e7", borderRadius:10, padding:"10px 14px", fontSize:14, color:"#1d1d1f", fontFamily:"inherit", outline:"none", background:"#f5f5f7" },
  modalFooter: { padding:"20px 24px", borderTop:"1px solid #f0f0f0", display:"flex", justifyContent:"flex-end", gap:10 },
  btnGhost: { background:"#f5f5f7", color:"#6e6e73", border:"none", borderRadius:12, padding:"12px 24px", fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"inherit" },
  btnPrimary: { background:"#00b4d8", color:"#fff", border:"none", borderRadius:12, padding:"12px 24px", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" },
  toast: { position:"fixed", bottom:24, right:24, background:"#1d1d1f", color:"#fff", padding:"12px 20px", borderRadius:12, fontSize:14, fontWeight:500, display:"flex", alignItems:"center", gap:8, boxShadow:"0 8px 24px rgba(0,0,0,.2)" },
};

export default Operadores;