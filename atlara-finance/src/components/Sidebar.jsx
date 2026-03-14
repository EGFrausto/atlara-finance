import React, { useState } from "react";
import { industriaConfig } from "../config/industrias";

const getNavItems = (config) => [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "clientes", label: "Clientes", icon: "people" },
  { id: "maquinaria", label: config.activo, icon: config.activoIcon },
  { id: "contratos", label: "Contratos", icon: "description" },
  { id: "inventario", label: config.inventario, icon: config.inventarioIcon },
  ...(config.tieneOperadores ? [{ id: "operadores", label: "Operadores", icon: "badge" }] : []),
  { id: "pagos", label: "Pagos", icon: "payments" },
  { id: "reportes", label: "Reportes", icon: "bar_chart" },
];

function Sidebar({ current, onChange, user, industria, onLogout, collapsed, onCollapse }) {
  const config = industriaConfig[industria] || industriaConfig.construccion;
  const navItems = getNavItems(config);
  const [tooltip, setTooltip] = useState(null);

  return (
    <aside style={{ ...styles.sidebar, width: collapsed ? 64 : 240 }}>

      {/* LOGO + TOGGLE */}
      <div style={{ ...styles.logo, padding: collapsed ? "16px 0" : "16px 20px", justifyContent: collapsed ? "center" : "space-between" }}>
        <img
          src="/at-fin.png"
          alt="Atlara Finance"
          style={{ ...styles.logoImg, height: collapsed ? 28 : 64 }}
          onError={e => e.target.style.display='none'}
        />
        {!collapsed && (
          <button style={styles.toggleBtn} onClick={() => onCollapse(true)}>
            <span className="material-icons" style={{ fontSize:18, color:"#aeaeb2" }}>chevron_left</span>
          </button>
        )}
      </div>

      {/* TOGGLE cuando está colapsado */}
      {collapsed && (
        <div style={{ display:"flex", justifyContent:"center", padding:"8px 0", borderBottom:"1px solid #f0f0f0" }}>
          <button style={styles.toggleBtn} onClick={() => onCollapse(false)}>
            <span className="material-icons" style={{ fontSize:18, color:"#aeaeb2" }}>chevron_right</span>
          </button>
        </div>
      )}

      {/* NAV */}
      <nav style={styles.nav}>
        {navItems.map(item => (
          <div
            key={item.id}
            onClick={() => onChange(item.id)}
            onMouseEnter={() => collapsed && setTooltip(item.id)}
            onMouseLeave={() => setTooltip(null)}
            style={{
              ...styles.navItem,
              justifyContent: collapsed ? "center" : "flex-start",
              ...(current === item.id ? styles.navActive : {})
            }}
          >
            <span className="material-icons" style={{ ...styles.navIcon, color: current === item.id ? "#00b4d8" : "#aeaeb2" }}>
              {item.icon}
            </span>
            {!collapsed && (
              <span style={{ ...styles.navLabel, ...(current === item.id ? styles.navLabelActive : {}) }}>
                {item.label}
              </span>
            )}
            {collapsed && tooltip === item.id && (
              <div style={styles.tooltip}>{item.label}</div>
            )}
          </div>
        ))}
      </nav>

      {/* FOOTER expandido */}
      {!collapsed && (
        <div style={styles.footer}>
          <div style={styles.userBox}>
            <div style={styles.userAvatar}>
              <span className="material-icons" style={{ fontSize:16, color:"#ffffff" }}>person</span>
            </div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{user?.nombre || user?.correo?.split("@")[0]}</div>
              <div style={styles.userRole}>{config.activo}</div>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={onLogout} title="Cerrar sesión">
            <span className="material-icons" style={{ fontSize:18 }}>logout</span>
          </button>
        </div>
      )}

      {/* FOOTER colapsado */}
      {collapsed && (
        <div style={{ marginTop:"auto", padding:"16px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:8, borderTop:"1px solid #f0f0f0" }}>
          <div style={styles.userAvatar}>
            <span className="material-icons" style={{ fontSize:16, color:"#ffffff" }}>person</span>
          </div>
          <button style={styles.logoutBtn} onClick={onLogout} title="Cerrar sesión">
            <span className="material-icons" style={{ fontSize:18 }}>logout</span>
          </button>
        </div>
      )}
    </aside>
  );
}

const styles = {
  sidebar: { minHeight:"100vh", background:"#ffffff", borderRight:"1px solid #e5e5e7", display:"flex", flexDirection:"column", position:"fixed", top:0, left:0, bottom:0, transition:"width .2s", overflow:"hidden", zIndex:50 },
  logo: { borderBottom:"1px solid #f0f0f0", display:"flex", alignItems:"center" },
  logoImg: { width:"auto", objectFit:"contain", mixBlendMode:"multiply", transition:"height .2s" },
  toggleBtn: { background:"#f5f5f7", border:"none", borderRadius:8, width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 },
  nav: { flex:1, padding:"12px 8px", display:"flex", flexDirection:"column", gap:2 },
  navItem: { display:"flex", alignItems:"center", gap:12, padding:"10px 8px", borderRadius:10, cursor:"pointer", transition:"background .15s", position:"relative" },
  navActive: { background:"#e0f7fc" },
  navIcon: { fontSize:20, flexShrink:0 },
  navLabel: { fontSize:14, fontWeight:400, color:"#3a3a3c", whiteSpace:"nowrap" },
  navLabelActive: { fontWeight:600, color:"#00b4d8" },
  tooltip: { position:"absolute", left:52, background:"#1d1d1f", color:"#fff", fontSize:12, fontWeight:500, padding:"6px 10px", borderRadius:8, whiteSpace:"nowrap", zIndex:100, pointerEvents:"none" },
  footer: { padding:"16px", borderTop:"1px solid #f0f0f0", display:"flex", alignItems:"center", gap:8 },
  userBox: { flex:1, display:"flex", alignItems:"center", gap:10 },
  userAvatar: { width:32, height:32, borderRadius:"50%", background:"#00b4d8", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  userInfo: { flex:1, minWidth:0 },
  userName: { fontSize:13, fontWeight:600, color:"#1d1d1f", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },
  userRole: { fontSize:11, color:"#aeaeb2" },
  logoutBtn: { background:"#f5f5f7", border:"none", borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#aeaeb2", flexShrink:0 },
};

export default Sidebar;