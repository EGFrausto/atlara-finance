import React from "react";

const kpis = [
  { label: "Maquinaria Rentada", value: "12", sub: "↑ 2 desde el mes pasado", color: "#00b4d8", icon: "construction" },
  { label: "Maquinaria Disponible", value: "7", sub: "De 19 unidades totales", color: "#30d158", icon: "check_circle" },
  { label: "Pagos Pendientes", value: "$180,000", sub: "5 contratos activos", color: "#ff3b30", icon: "warning" },
  { label: "Ingresos del Mes", value: "$420,000", sub: "↑ 12% vs mes anterior", color: "#1d1d1f", icon: "trending_up" },
];

const contratos = [
  { id: "#A-203", cliente: "Constructora del Norte", maquina: "Excavadora CAT 320", costo: "$45,000", vence: "31 Mar 2025", estado: "Activo" },
  { id: "#A-204", cliente: "JRSA Infraestructura", maquina: "Grúa Liebherr LTM", costo: "$72,000", vence: "15 Abr 2025", estado: "Activo" },
  { id: "#A-197", cliente: "Obras y Soluciones SA", maquina: "Retroexcavadora JD", costo: "$28,000", vence: "10 Mar 2025", estado: "Vencido" },
  { id: "#A-201", cliente: "GHL Construcciones", maquina: "Compactadora CASE", costo: "$18,000", vence: "30 Abr 2025", estado: "Pendiente" },
];

const estadoStyle = {
  Activo:    { bg: "#e8f8ee", color: "#1a7f37" },
  Vencido:   { bg: "#fff0ee", color: "#ff3b30" },
  Pendiente: { bg: "#e0f7fc", color: "#00b4d8" },
};

function Dashboard() {
  return (
    <div style={styles.page}>

      {/* TOPBAR */}
      <div style={styles.topbar}>
        <div>
          <p style={styles.pageTag}>Dashboard</p>
          <h1 style={styles.title}>Vista General</h1>
        </div>
        <span style={styles.date}>
          {new Date().toLocaleDateString("es-MX", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
        </span>
      </div>

      {/* KPIs */}
      <div style={styles.kpiGrid}>
        {kpis.map((k, i) => (
          <div key={i} style={styles.kpiCard}>
            <div style={styles.kpiTop}>
              <span
                className="material-icons"
                style={{ fontSize: 20, color: k.color }}
              >
                {k.icon}
              </span>
              <span style={styles.kpiLabel}>{k.label}</span>
            </div>
            <div style={{ ...styles.kpiValue, color: k.color }}>{k.value}</div>
            <div style={styles.kpiSub}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* CONTRATOS */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.cardHeaderLeft}>
            <span className="material-icons" style={{ fontSize: 18, color: "#00b4d8" }}>description</span>
            <div style={styles.cardTitle}>Contratos Activos</div>
          </div>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Contrato","Cliente","Maquinaria","Costo/mes","Vence","Estado"].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contratos.map((c, i) => (
              <tr key={i} style={styles.tr}>
                <td style={{...styles.td, fontWeight:600, color:"#00b4d8"}}>{c.id}</td>
                <td style={styles.td}>{c.cliente}</td>
                <td style={{...styles.td, color:"#6e6e73"}}>{c.maquina}</td>
                <td style={{...styles.td, fontWeight:600}}>{c.costo}</td>
                <td style={{...styles.td, color:"#6e6e73"}}>{c.vence}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    background: estadoStyle[c.estado]?.bg,
                    color: estadoStyle[c.estado]?.color,
                  }}>{c.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

const styles = {
  page: {
    padding: "0 40px 40px",
    marginLeft: 240,
    background: "#f5f5f7",
    minHeight: "100vh",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: "40px 0 28px",
    marginBottom: 28,
  },
  pageTag: {
    fontSize: 13,
    fontWeight: 500,
    color: "#00b4d8",
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: 700,
    color: "#1d1d1f",
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 13,
    color: "#6e6e73",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 16,
    marginBottom: 24,
  },
  kpiCard: {
    background: "#ffffff",
    borderRadius: 16,
    padding: "24px 20px",
    boxShadow: "0 2px 8px rgba(0,0,0,.06)",
    border: "1px solid #e5e5e7",
  },
  kpiTop: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  kpiLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: "#6e6e73",
  },
  kpiValue: {
    fontSize: 36,
    fontWeight: 700,
    letterSpacing: -1,
    lineHeight: 1,
    marginBottom: 8,
  },
  kpiSub: {
    fontSize: 12,
    color: "#6e6e73",
  },
  card: {
    background: "#ffffff",
    borderRadius: 16,
    border: "1px solid #e5e5e7",
    boxShadow: "0 2px 8px rgba(0,0,0,.06)",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #f0f0f0",
  },
  cardHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#1d1d1f",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    fontSize: 12,
    fontWeight: 500,
    color: "#aeaeb2",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    padding: "12px 24px",
    borderBottom: "1px solid #f0f0f0",
  },
  tr: {
    borderBottom: "1px solid #f5f5f7",
  },
  td: {
    padding: "16px 24px",
    fontSize: 14,
    color: "#1d1d1f",
    fontWeight: 400,
  },
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
};

export default Dashboard;