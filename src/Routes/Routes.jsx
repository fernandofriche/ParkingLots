import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../Pages/Login/Login.jsx';
import Register from '../Pages/Register/Register.jsx';
import RegisterCar from '../Pages/RegisterCar/RegisterCar.jsx';
import Profile from '../Pages/Profile/Profile.jsx';
import HomePage from '../Pages/HomePage/HomePage.jsx';
import Detalhes from '../Pages/Detalhes/Detalhes.jsx';
import ResetPassword from '../Pages/ResetPassword/ResetPassword.jsx';
import Reservas from '../Pages/Reservas/Reservas.jsx';
import VisualizarCars from '../Pages/VisualizarCars/VisualizarCars.jsx';
import RotaPrivada from '../Pages/RotasPrivadas/RotasPrivadas.jsx';
import NotAuthorized from '../Pages/UsuarioNaoAutorizado/UsuarioNaoAutorizado.jsx';
import LandingPage from '../Pages/LandingPage/LandingPage.jsx';
import Feedback from '../Pages/Feedback/Feedback.jsx'

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/UserNaoAutorizado" element={<NotAuthorized />} />
        <Route path="/Feedback" element={<Feedback />} />

        {/* Rotas privadas */}
        <Route element={<RotaPrivada />}>
          <Route path="/RegisterCar" element={<RegisterCar />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/detalhes/:id" element={<Detalhes />} />
          <Route path="/Reservas" element={<Reservas />} />
          <Route path="/VisualizarCars" element={<VisualizarCars />} />
          <Route path="/LandingPage" element={<LandingPage />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
