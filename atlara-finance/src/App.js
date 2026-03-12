import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Maquinaria from "./pages/Maquinaria";
import Contratos from "./pages/Contratos";
import Inventario from "./pages/Inventario";
import Pagos from "./pages/Pagos";
import Reportes from "./pages/Reportes";
import Login from "./pages/Login";
import "./App.css";

function App() {
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [industria, setIndustria] = useState("construccion");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser({ correo: u.email, nombre: u.displayName });
        const savedIndustria = localStorage.getItem(`atlara_industria_${u.uid}`);
        if (savedIndustria) setIndustria(savedIndustria);
      } else {
        setUser(null);
      }
      setCargando(false);
    });
    return () => unsub();
  }, []);

  function handleLogin(datos) {
    setUser({ correo: datos.correo, nombre: datos.nombre });
    setIndustria(datos.industria);
    localStorage.setItem(`atlara_industria_${auth.currentUser?.uid}`, datos.industria);
  }

  async function handleLogout() {
    await signOut(auth);
    setUser(null);
    setIndustria("construccion");
    setPage("dashboard");
  }

  if (cargando) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", background:"#f5f5f7" }}>
      <div style={{ fontSize:14, color:"#aeaeb2", fontWeight:500 }}>Cargando...</div>
    </div>
  );

  if (!user) return <Login onLogin={handleLogin} />;

  function renderPage() {
    if (page === "dashboard") return <Dashboard industria={industria} />;
    if (page === "clientes") return <Clientes industria={industria} />;
    if (page === "maquinaria") return <Maquinaria industria={industria} />;
    if (page === "contratos") return <Contratos industria={industria} />;
    if (page === "inventario") return <Inventario industria={industria} />;
    if (page === "pagos") return <Pagos industria={industria} />;
    if (page === "reportes") return <Reportes industria={industria} />;
  }

  return (
    <div className="app">
      <Sidebar current={page} onChange={setPage} user={user} industria={industria} onLogout={handleLogout} />
      <main className="main">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;