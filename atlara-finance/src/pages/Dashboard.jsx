import React from "react";
import { industriaConfig } from "../config/industrias";

function Dashboard({ industria = "construccion" }) {
  const config = industriaConfig[industria] || industriaConfig.construccion;

  const kpis = [
    { label:"Clientes activos", value:"12", icon:"people", color:"#00b4d8", sub:"+2 este mes" },
    { label:config.activoPlural, value:"7", icon:config.activoIcon, color:"#7c6ff7", sub:"4 rentados" },
    { label:"Contratos activos", value:"5", icon:"description", color:"#30d158", sub:"1 vence pronto" },
    { label:"Ingresos del mes", value:"$438,000", icon:"payments", color:"#ff9500", sub:"+12% vs anterior" },
  ];

  const actividad = [
    { texto:`Nuevo contrato — Constructora del Norte`, tiempo:"Hace 2 horas", icon:"description", color:"#00b4d8" },
    { texto:`Pago recibido — JRSA Infraestructura $72,000`, tiempo:"Hace 5 horas", icon:"check_circle", color:"#30d158" },
    { texto:`${config.activo} en mantenimiento`, tiempo:"Hace 1 día", icon:"build", color:"#ff9500" },
    { texto:`Nuevo cliente registrado`, tiempo:"Hace 2 días", icon:"person_add", color:"#7c6ff7" },
    { texto:`Contrato vencido — Obras y Soluciones`, tiempo:"Hace 3 días", icon:"warning", color:"#ff3b30" },
  ];

  const proximosVencimientos = [
    { nombre:"Constructora del Norte", fecha:"31 Mar 2026", monto:"$45,000", dias:19 },
    { nombre:"GHL Construcciones", fecha:"30 Abr 2026", monto:"$18,000", dias:49 },
    { nombre:"JRSA Infraestructura", fecha:"15 Abr 2026", monto:"$72,000", dias:34 },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>
        <div>
          <p style={styles.pageTag}>Inicio</p>
          <h1 style={styles.title}>Dashboard</h1>
        </div>
        <div style={styles.dateBox}>
          <span className="material-icons" style={{ fontSize:16, color:"#aeaeb2" }}>calendar_today</span>
          <span style={styles.dateText}>Marzo 2026</span>
        </div>
      </div>

      {/* KPIs */}
      <div style={styles.kpiGrid}>
        {kpis.map((k, i) => (
          <div key={i} style={styles.kpiCard}>
            <div style={styles.kpiTop}>
              <span className="material-icons" style={{ fontSize:22, color:k.color }}>{k.icon}</span>
              <div style={styles.kpiLabel}>{k.label}</div>
            </div>
            <div style={{ ...styles.kpiValue, color:k.color }}>{k.value}</div>
            <div style={styles.kpiSub}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={styles.row}>
        {/* ACTIVIDAD RECIENTE */}
        <div style={{ ...styles.card, flex:1 }}>
          <div style={styles.cardHeader}>
            <span className="material-icons" style={{ fontSize:18, color:"#00b4d8" }}>history</span>
            <div style={styles.cardTitle}>Actividad reciente</div>
          </div>
          <div style={styles.actividadList}>
            {actividad.map((a, i) => (
              <div key={i} style={styles.actividadItem}>
                <div style={{ ...styles.actividadIcon, background:`${a.color}18` }}>
                  <span className="material-icons" style={{ fontSize:16, color:a.color }}>{a.icon}</span>
                </div>
                <div style={styles.actividadContent}>
                  <div style={styles.actividadTexto}>{a.texto}</div>
                  <div style={styles.actividadTiempo}>{a.tiempo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PROXIMOS VENCIMIENTOS */}
        <div style={{ ...styles.card, flex:1 }}>
          <div style={styles.cardHeader}>
            <span className="material-icons" style={{ fontSize:18, color:"#ff9500" }}>schedule</span>
            <div style={styles.cardTitle}>Próximos vencimientos</div>
          </div>
          <div style={styles.vencimientosList}>
            {proximosVencimientos.map((v, i) => (
              <div key={i} style={styles.vencimientoItem}>
                <div style={styles.vencimientoLeft}>
                  <div style={styles.vencimientoNombre}>{v.nombre}</div>
                  <div style={styles.vencimientoFecha}>{v.fecha}</div>
                </div>
                <div style={styles.vencimientoRight}>
                  <div style={styles.vencimientoMonto}>{v.monto}</div>
                  <div style={{
                    ...styles.vencimientoDias,
                    background: v.dias <= 20 ? "#fff0ee" : "#fff8e8",
                    color: v.dias <= 20 ? "#ff3b30" : "#ff9500"
                  }}>
                    {v.dias} días
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RESUMEN ACTIVOS */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span className="material-icons" style={{ fontSize:18, color:"#00b4d8" }}>{config.activoIcon}</span>
          <div style={styles.cardTitle}>Resumen de {config.activoPlural}</div>
        </div>
        <div style={styles.activosGrid}>
          {[
            { label:"Total", value:7, color:"#1d1d1f" },
            { label:"Rentados", value:4, color:"#00b4d8" },
            { label:"Disponibles", value:3, color:"#30d158" },
            { label:"Mantenimiento", value:1, color:"#ff9500" },
          ].map((a, i) => (
            <div key={i} style={styles.activoItem}>
              <div style={{ ...styles.activoValue, color:a.color }}>{a.value}</div>
              <div style={styles.activoLabel}>{a.label}</div>
              <div style={{ ...styles.activoBar, background:`${a.color}20` }}>
                <div style={{ height:"100%", width:`${(a.value/7)*100}%`, background:a.color, borderRadius:4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding:"0 40px 40px", marginLeft:240, background:"#f5f5f7", minHeight:"100vh" },
  topbar: { display:"flex", justifyContent:"space-between", alignItems:"flex-end", padding:"40px 0 28px", marginBottom:28 },
  pageTag: { fontSize:13, fontWeight:500, color:"#00b4d8", marginBottom:4 },
  title: { fontSize:34, fontWeight:700, color:"#1d1d1f", letterSpacing:-0.5 },
  dateBox: { display:"flex", alignItems:"center", gap:6, background:"#ffffff", border:"1px solid #e5e5e7", borderRadius:10, padding:"8px 14px" },
  dateText: { fontSize:13, color:"#6e6e73", fontWeight:500 },
  kpiGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 },
  kpiCard: { background:"#ffffff", borderRadius:16, padding:"20px", border:"1px solid #e5e5e7", boxShadow:"0 2px 8px rgba(0,0,0,.06)" },
  kpiTop: { display:"flex", alignItems:"center", gap:8, marginBottom:12 },
  kpiLabel: { fontSize:13, color:"#6e6e73", fontWeight:500 },
  kpiValue: { fontSize:28, fontWeight:700, letterSpacing:-1, marginBottom:4 },
  kpiSub: { fontSize:12, color:"#aeaeb2" },
  row: { display:"flex", gap:20, marginBottom:20 },
  card: { background:"#ffffff", borderRadius:16, border:"1px solid #e5e5e7", boxShadow:"0 2px 8px rgba(0,0,0,.06)", overflow:"hidden", marginBottom:20 },
  cardHeader: { display:"flex", alignItems:"center", gap:8, padding:"20px 24px", borderBottom:"1px solid #f0f0f0" },
  cardTitle: { fontSize:15, fontWeight:600, color:"#1d1d1f" },
  actividadList: { padding:"8px 0" },
  actividadItem: { display:"flex", alignItems:"flex-start", gap:12, padding:"14px 24px", borderBottom:"1px solid #f5f5f7" },
  actividadIcon: { width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  actividadContent: { flex:1 },
  actividadTexto: { fontSize:13, fontWeight:500, color:"#1d1d1f", marginBottom:2 },
  actividadTiempo: { fontSize:12, color:"#aeaeb2" },
  vencimientosList: { padding:"8px 0" },
  vencimientoItem: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 24px", borderBottom:"1px solid #f5f5f7" },
  vencimientoLeft: {},
  vencimientoNombre: { fontSize:13, fontWeight:600, color:"#1d1d1f", marginBottom:2 },
  vencimientoFecha: { fontSize:12, color:"#aeaeb2" },
  vencimientoRight: { display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 },
  vencimientoMonto: { fontSize:13, fontWeight:700, color:"#1d1d1f" },
  vencimientoDias: { fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:10 },
  activosGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0 },
  activoItem: { padding:"24px", borderRight:"1px solid #f5f5f7" },
  activoValue: { fontSize:36, fontWeight:700, letterSpacing:-1, marginBottom:4 },
  activoLabel: { fontSize:13, color:"#6e6e73", marginBottom:12 },
  activoBar: { height:6, borderRadius:4, overflow:"hidden" },
};

export default Dashboard;