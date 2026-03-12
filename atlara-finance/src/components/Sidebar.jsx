import React from "react";
import { industriaConfig } from "../config/industrias";

function Sidebar({ current, onChange, user, industria, onLogout }) {
  const config = industriaConfig[industria] || industriaConfig.construccion;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "clientes", label: "Clientes", icon: "people" },
    { id: "maquinaria", label: config.activo, icon: config.activoIcon },
    { id: "contratos", label: "Contratos", icon: "description" },
    { id: "inventario", label: config.inventario, icon: config.inventarioIcon },
    { id: "pagos", label: "Pagos", icon: "payments" },
    { id: "reportes", label: "Reportes", icon: "bar_chart" },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <img src="/at-fin.png" alt="Atlara" style={styles.logoImg} onError={e => e.target.style.display='none'} />
        <div style={styles.logoWord}>Atlara</div>
        <div style={styles.logoSub}>Finance</div>
      </div>

      <nav style={styles.nav}>
        {navItems.map(item => (
          <div
            key={item.id}
            onClick={() => onChange(item.id)}
            style={{
              ...styles.navItem,
              ...(current === item.id ? styles.navActive : {})
            }}
          >
            <span className="material-icons" style={{ ...styles.navIcon, color: current === item.id ? "#00b4d8" : "#aeaeb2" }}>
              {item.icon}
            </span>
            <span style={{ ...styles.navLabel, ...(current === item.id ? styles.navLabelActive : {}) }}>
              {item.label}
            </span>
          </div>
        ))}
      </nav>

      <div style={styles.footer}>
        <div style={styles.userBox}>
          <div style={styles.userAvatar}>
            <span className="material-icons" style={{ fontSize:16, color:"#ffffff" }}>person</span>
          </div>
          <div style={styles.userInfo}>
            <div style={styles.userEmail}>{user?.email?.split("@")[0]}</div>
            <div style={styles.userRole}>{config.activo}</div>
          </div>
        </div>
        <button style={styles.logoutBtn} onClick={onLogout} title="Cerrar sesión">
          <span className="material-icons" style={{ fontSize:18 }}>logout</span>
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: { width:240, minHeight:"100vh", background:"#ffffff", borderRight:"1px solid #e5e5e7", display:"flex", flexDirection:"column", position:"fixed", top:0, left:0, bottom:0 },
  logo: { padding:"28px 20px 24px", borderBottom:"1px solid #f0f0f0", display:"flex", flexDirection:"column", alignItems:"flex-start" },
  logoImg: { height:80, width:"auto", marginBottom:10, objectFit:"contain" },
  logoWord: { fontSize:18, fontWeight:700, color:"#1d1d1f", letterSpacing:-0.5 },
  logoSub: { fontSize:12, fontWeight:500, color:"#00b4d8", marginTop:1 },
  nav: { flex:1, padding:"12px", display:"flex", flexDirection:"column", gap:2 },
  navItem: { display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:10, cursor:"pointer", transition:"background .15s" },
  navActive: { background:"#e0f7fc" },
  navIcon: { fontSize:20, flexShrink:0 },
  navLabel: { fontSize:14, fontWeight:400, color:"#3a3a3c" },
  navLabelActive: { fontWeight:600, color:"#00b4d8" },
  footer: { padding:"16px", borderTop:"1px solid #f0f0f0", display:"flex", alignItems:"center", gap:8 },
  userBox: { flex:1, display:"flex", alignItems:"center", gap:10 },
  userAvatar: { width:32, height:32, borderRadius:"50%", background:"#00b4d8", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  userInfo: { flex:1, minWidth:0 },
  userEmail: { fontSize:13, fontWeight:600, color:"#1d1d1f", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },
  userRole: { fontSize:11, color:"#aeaeb2" },
  logoutBtn: { background:"#f5f5f7", border:"none", borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#aeaeb2", flexShrink:0 },
};

export default Sidebar;