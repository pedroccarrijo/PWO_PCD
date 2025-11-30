import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPCD from "./pages/LoginPCD";
import LoginEmpresa from "./pages/LoginEmpresa";
import CadastroPCD from "./pages/CadastroPCD";
import CadastroEmpresa from "./pages/CadastroEmpresa";
import Explorer from "./pages/Explorer";
import PrivateRoute from "./components/PrivateRoute";
import DetalhesVaga from "./pages/DetalhesVaga";
import PerfilPCD from "./pages/PerfilPCD";
import Vagas from "./pages/Vagas";
import DashboardEmpresa from "./pages/DashboardEmpresa";
import CriarVagaEmpresa from "./pages/CriarVagaEmpresa";
import EmpresasPage from "./pages/EmpresasPage";
import DetalheCandidatoEmpresa from "./pages/DetalheCandidatoEmpresa";



function App() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login/pcd" element={<LoginPCD />} />
      <Route path="/login/empresa" element={<LoginEmpresa />} />
      <Route path="/cadastro/pcd" element={<CadastroPCD />} />
      <Route path="/cadastro/empresa" element={<CadastroEmpresa />} />

      {/* Protegidas */}
      <Route
        path="/explorer"
        element={
          <PrivateRoute>
            <Explorer />
          </PrivateRoute>
        }
      />

      <Route
        path="/vaga/:id"
        element={
          <PrivateRoute>
            <DetalhesVaga />
          </PrivateRoute>
        }
      />

      <Route
        path="/perfil/pcd"
        element={
          <PrivateRoute>
            <PerfilPCD />
          </PrivateRoute>
        }
      />

      <Route
        path="/vagas"
        element={
          <PrivateRoute>
            <Vagas />
          </PrivateRoute>
        }
      />

      <Route
        path="/empresa/dashboard"
        element={
          <PrivateRoute>
            <DashboardEmpresa />
          </PrivateRoute>
        }
      />

      <Route
        path="/empresa/vagas/nova"
        element={
          <PrivateRoute>
            <CriarVagaEmpresa />
          </PrivateRoute>
        }
      />

      <Route
        path="/empresas"
        element={
          <PrivateRoute>
            <EmpresasPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/empresa/candidato/:id"
        element={
          <PrivateRoute>
            <DetalheCandidatoEmpresa />
          </PrivateRoute>
        }
      />



    </Routes>
  );
}

export default App;
