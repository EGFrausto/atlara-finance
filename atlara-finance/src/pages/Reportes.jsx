import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { industriaConfig } from "../config/industrias";

const ingresos = [
  { mes: "Oct", valor: 280000 },
  { mes: "Nov", valor: 320000 },
  { mes: "Dic", valor: 290000 },
  { mes: "Ene", valor: 350000 },
  { mes: "Feb", valor: 410000 },
  { mes: "Mar", valor: 438000 },
];

const pagos = [
  { mes: "Oct", pagados: 240000, pendientes: 40000 },
  { mes: "Nov", pagados: 300000, pendientes: 20000 },
  { mes: "Dic", pagados: 250000, pendientes: 40000 },
  { mes: "Ene", pagados: 320000, pendientes: 30000 },
  { mes: "Feb", pagados: 380000, pendientes: 30000 },
  { mes: "Mar", pagados: 320000, pendientes: 118000 },
];

function Reportes({ industria = "construccion" }) {
  const config = industriaConfig[industria] || industriaConfig.construccion;

  const distribucion = [
    { name: "Rentado", value: 4, color: "#00b4d8" },
    { name: "Disponible", value: 3, color: "#30d158" },
    { name: "Mantenimiento", value: 1, color: "#ff9500" },
  ];

  const formatMXN = (v) => `$${(v/1000).toFixed(0)}k`;

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>
        <div>
          <p style={styles.pageTag}>Reportes</p>
          <h1 style={styles.title}>Análisis y Reportes</h1>
        </div>
      </div>

      {/* KPIs */}
      <div style={styles.kpiGrid}>
        {[
          { label:"Ingresos del mes", value:"$438,000", icon:"trending_up", color:"#00b4d8", sub:"+12% vs mes anterior" },
          { label:"Pagos recibidos", value:"$320,000", icon:"check_circle", color:"#30d158", sub:"73% del total" },
          { label:"Por cobrar", value:"$118,000", icon:"schedule", color:"#ff9500", sub:"2 clientes pendientes" },
          { label:`${config.activoPlural} activos`, value:"4", icon:config.activoIcon, color:"#7c6ff7", sub:"de 7 totales" },
        ].map((k,i) => (
          <div key={i} style={styles.kpiCard}>
            <div style={styles.kpiTop}>
              <span className="material-icons" style={{ fontSize:20, color:k.color }}>{k.icon}</span>
              <div style={styles.kpiLabel}>{k.label}</div>
            </div>
            <div style={{ ...styles.kpiValue, color:k.color }}>{k.value}</div>
            <div style={styles.kpiSub}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* GRAFICAS ROW 1 */}
      <div style={styles.chartsRow}>
        {/* Ingresos por mes */}
        <div style={{ ...styles.chartCard, flex:2 }}>
          <div style={styles.chartHeader}>
            <div style={styles.chartTitle}>Ingresos por mes</div>
            <div style={styles.chartSub}>Últimos 6 meses</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ingresos} margin={{ top:8, right:16, left:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize:12, fill:"#aeaeb2" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatMXN} tick={{ fontSize:12, fill:"#aeaeb2" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, "Ingresos"]} contentStyle={{ borderRadius:12, border:"1px solid #e5e5e7", fontSize:13 }} />
              <Bar dataKey="valor" fill="#00b4d8" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución activos */}
        <div style={{ ...styles.chartCard, flex:1 }}>
          <div style={styles.chartHeader}>
            <div style={styles.chartTitle}>Estado de {config.activoPlural}</div>
            <div style={styles.chartSub}>Distribución actual</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={distribucion} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {distribucion.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius:12, border:"1px solid #e5e5e7", fontSize:13 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GRAFICAS ROW 2 */}
      <div style={styles.chartCard}>
        <div style={styles.chartHeader}>
          <div style={styles.chartTitle}>Pagos vs Pendientes</div>
          <div style={styles.chartSub}>Últimos 6 meses</div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={pagos} margin={{ top:8, right:16, left:0, bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize:12, fill:"#aeaeb2" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatMXN} tick={{ fontSize:12, fill:"#aeaeb2" }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v, n) => [`$${v.toLocaleString()}`, n === "pagados" ? "Pagados" : "Pendientes"]} contentStyle={{ borderRadius:12, border:"1px solid #e5e5e7", fontSize:13 }} />
            <Line type="monotone" dataKey="pagados" stroke="#30d158" strokeWidth={2.5} dot={{ r:4, fill:"#30d158" }} />
            <Line type="monotone" dataKey="pendientes" stroke="#ff9500" strokeWidth={2.5} dot={{ r:4, fill:"#ff9500" }} strokeDasharray="5 5" />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

const styles = {
  page: { padding:"0 40px 40px", marginLeft:240, background:"#f5f5f7", minHeight:"100vh" },
  topbar: { display:"flex", justifyContent:"space-between", alignItems:"flex-end", padding:"40px 0 28px", marginBottom:28 },
  pageTag: { fontSize:13, fontWeight:500, color:"#00b4d8", marginBottom:4 },
  title: { fontSize:34, fontWeight:700, color:"#1d1d1f", letterSpacing:-0.5 },
  kpiGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 },
  kpiCard: { background:"#ffffff", borderRadius:16, padding:"20px", border:"1px solid #e5e5e7", boxShadow:"0 2px 8px rgba(0,0,0,.06)" },
  kpiTop: { display:"flex", alignItems:"center", gap:8, marginBottom:12 },
  kpiLabel: { fontSize:13, color:"#6e6e73", fontWeight:500 },
  kpiValue: { fontSize:28, fontWeight:700, letterSpacing:-1, marginBottom:4 },
  kpiSub: { fontSize:12, color:"#aeaeb2" },
  chartsRow: { display:"flex", gap:20, marginBottom:20 },
  chartCard: { background:"#ffffff", borderRadius:16, padding:"24px", border:"1px solid #e5e5e7", boxShadow:"0 2px 8px rgba(0,0,0,.06)", marginBottom:20 },
  chartHeader: { marginBottom:20 },
  chartTitle: { fontSize:16, fontWeight:600, color:"#1d1d1f" },
  chartSub: { fontSize:13, color:"#aeaeb2", marginTop:2 },
};

export default Reportes;