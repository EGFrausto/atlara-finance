import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const industrias = [
  { id: "construccion", label: "Construcción", icon: "construction", desc: "Maquinaria pesada, excavadoras, grúas" },
  { id: "transporte", label: "Transporte", icon: "local_shipping", desc: "Flotillas, camiones, trailers" },
  { id: "movilidad", label: "Movilidad", icon: "directions_car", desc: "Vehículos de renta, Uber, taxis" },
  { id: "medico", label: "Médico", icon: "medical_services", desc: "Equipo hospitalario, ambulancias" },
  { id: "inmobiliaria", label: "Inmobiliaria", icon: "apartment", desc: "Propiedades y espacios en renta" },
];

function Login({ onLogin }) {
  const [modo, setModo] = useState("login");
  const [paso, setPaso] = useState(1);
  const [form, setForm] = useState({ correo: "", password: "", nombre: "", industria: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleLogin() {
    if (!form.correo || !form.password) { setError("Completa todos los campos"); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.correo, form.password);
      onLogin({ correo: form.correo, industria: "construccion" });
    } catch (e) {
      setError("Correo o contraseña incorrectos");
    }
    setLoading(false);
  }

  async function handleRegistro() {
    if (!form.industria) { setError("Selecciona una industria"); return; }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, form.correo, form.password);
      onLogin({ correo: form.correo, industria: form.industria });
    } catch (e) {
      if (e.code === "auth/email-already-in-use") setError("Este correo ya está registrado");
      else if (e.code === "auth/weak-password") setError("La contraseña debe tener al menos 6 caracteres");
      else setError("Error al crear la cuenta");
    }
    setLoading(false);
  }

  function handleSiguiente() {
    if (!form.nombre) { setError("Escribe tu nombre"); return; }
    if (!form.correo) { setError("Escribe tu correo"); return; }
    if (!form.password || form.password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    setError("");
    setPaso(2);
  }

  return (
    <div style={styles.page}>

      {/* LEFT PANEL */}
      <div style={styles.left}>
        <div style={styles.leftContent}>

          <div style={styles.brand}>
            <img
              src="/atf.png"
              alt="Atlara Finance"
              style={{
                height: 140,
                width: "auto",
                objectFit: "contain",
                filter: "brightness(0) invert(1)",
              }}
            />
          </div>

          <h1 style={styles.heroTitle}>
            Gestión financiera<br />para tu industria.
          </h1>
          <p style={styles.heroSub}>
            Controla activos, contratos, clientes y pagos desde una sola plataforma. Adaptado a tu tipo de negocio.
          </p>
          <div style={styles.industriasList}>
            {industrias.map(i => (
              <div key={i.id} style={styles.industriaItem}>
                <span className="material-icons" style={{ fontSize: 16, color: "#00b4d8" }}>{i.icon}</span>
                <span style={styles.industriaLabel}>{i.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={styles.right}>
        <div style={styles.formBox}>

          {/* TABS */}
          <div style={styles.tabs}>
            <button
              style={{ ...styles.tab, ...(modo === "login" ? styles.tabActive : {}) }}
              onClick={() => { setModo("login"); setError(""); setPaso(1); }}
            >
              Iniciar sesión
            </button>
            <button
              style={{ ...styles.tab, ...(modo === "registro" ? styles.tabActive : {}) }}
              onClick={() => { setModo("registro"); setError(""); setPaso(1); }}
            >
              Crear cuenta
            </button>
          </div>

          {/* LOGIN */}
          {modo === "login" && (
            <div style={styles.formContent}>
              <h2 style={styles.formTitle}>Bienvenido de nuevo</h2>
              <p style={styles.formSub}>Ingresa a tu cuenta de Atlara Finance</p>

              <div style={styles.formGroup}>
                <label style={styles.label}>Correo electrónico</label>
                <input name="correo" type="email" value={form.correo} onChange={handleChange} placeholder="correo@empresa.mx" style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Contraseña</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={styles.input} onKeyDown={e => e.key === "Enter" && handleLogin()} />
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <button style={styles.btnPrimary} onClick={handleLogin} disabled={loading}>
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </button>
            </div>
          )}

          {/* REGISTRO PASO 1 */}
          {modo === "registro" && paso === 1 && (
            <div style={styles.formContent}>
              <h2 style={styles.formTitle}>Crea tu cuenta</h2>
              <p style={styles.formSub}>Paso 1 de 2 — Datos de acceso</p>

              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre completo</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Juan Pérez" style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Correo electrónico</label>
                <input name="correo" type="email" value={form.correo} onChange={handleChange} placeholder="correo@empresa.mx" style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Contraseña</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" style={styles.input} />
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <button style={styles.btnPrimary} onClick={handleSiguiente}>
                Siguiente →
              </button>
            </div>
          )}

          {/* REGISTRO PASO 2 — INDUSTRIA */}
          {modo === "registro" && paso === 2 && (
            <div style={styles.formContent}>
              <h2 style={styles.formTitle}>¿Cuál es tu industria?</h2>
              <p style={styles.formSub}>Paso 2 de 2 — Personaliza tu experiencia</p>

              <div style={styles.industriaGrid}>
                {industrias.map(i => (
                  <div
                    key={i.id}
                    onClick={() => setForm({ ...form, industria: i.id })}
                    style={{
                      ...styles.industriaCard,
                      ...(form.industria === i.id ? styles.industriaCardActive : {})
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: 24, color: form.industria === i.id ? "#00b4d8" : "#aeaeb2" }}>
                      {i.icon}
                    </span>
                    <div style={styles.industriaCardLabel}>{i.label}</div>
                    <div style={styles.industriaCardDesc}>{i.desc}</div>
                  </div>
                ))}
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <div style={styles.btnRow}>
                <button style={styles.btnGhost} onClick={() => setPaso(1)}>← Atrás</button>
                <button style={styles.btnPrimary} onClick={handleRegistro} disabled={loading}>
                  {loading ? "Creando cuenta..." : "Crear cuenta"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display:"flex", minHeight:"100vh", background:"#f5f5f7" },
  left: {
    flex: 1,
    background: "#1d1d1f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
  },
  leftContent: { maxWidth: 420 },
  brand: { marginBottom: 40 },
  heroTitle: { fontSize: 40, fontWeight: 700, color: "#ffffff", lineHeight: 1.2, letterSpacing: -0.5, marginBottom: 16 },
  heroSub: { fontSize: 15, color: "rgba(255,255,255,.5)", lineHeight: 1.7, marginBottom: 40 },
  industriasList: { display: "flex", flexDirection: "column", gap: 14 },
  industriaItem: { display: "flex", alignItems: "center", gap: 10 },
  industriaLabel: { fontSize: 14, color: "rgba(255,255,255,.7)", fontWeight: 500 },
  right: {
    width: 520,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    background: "#ffffff",
  },
  formBox: { width: "100%", maxWidth: 400 },
  tabs: { display:"flex", gap:0, marginBottom:32, borderBottom:"1px solid #f0f0f0" },
  tab: { flex:1, background:"transparent", border:"none", padding:"12px 0", fontSize:14, fontWeight:500, color:"#aeaeb2", cursor:"pointer", fontFamily:"inherit", borderBottom:"2px solid transparent", marginBottom:-1 },
  tabActive: { color:"#00b4d8", borderBottom:"2px solid #00b4d8" },
  formContent: { display:"flex", flexDirection:"column", gap:0 },
  formTitle: { fontSize:24, fontWeight:700, color:"#1d1d1f", letterSpacing:-0.3, marginBottom:6 },
  formSub: { fontSize:14, color:"#6e6e73", marginBottom:28 },
  formGroup: { display:"flex", flexDirection:"column", gap:6, marginBottom:16 },
  label: { fontSize:12, fontWeight:600, color:"#6e6e73", textTransform:"uppercase", letterSpacing:0.5 },
  input: { border:"1px solid #e5e5e7", borderRadius:10, padding:"12px 14px", fontSize:14, color:"#1d1d1f", fontFamily:"inherit", outline:"none", background:"#f5f5f7" },
  error: { background:"#fff0ee", color:"#ff3b30", padding:"10px 14px", borderRadius:10, fontSize:13, fontWeight:500, marginBottom:16 },
  btnPrimary: { background:"#00b4d8", color:"#fff", border:"none", borderRadius:12, padding:"14px", fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"inherit", width:"100%", marginTop:8 },
  btnGhost: { background:"#f5f5f7", color:"#6e6e73", border:"none", borderRadius:12, padding:"14px 24px", fontSize:15, fontWeight:500, cursor:"pointer", fontFamily:"inherit" },
  btnRow: { display:"flex", gap:10, marginTop:8 },
  industriaGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 },
  industriaCard: { border:"1px solid #e5e5e7", borderRadius:12, padding:"16px 12px", cursor:"pointer", transition:"all .15s", background:"#f5f5f7", display:"flex", flexDirection:"column", gap:6 },
  industriaCardActive: { border:"1.5px solid #00b4d8", background:"#e0f7fc" },
  industriaCardLabel: { fontSize:13, fontWeight:600, color:"#1d1d1f" },
  industriaCardDesc: { fontSize:11, color:"#aeaeb2", lineHeight:1.4 },
};

export default Login;