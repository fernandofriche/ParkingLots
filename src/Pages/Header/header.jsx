import React from "react";
import Styles from "./header.module.css"
import { useNavigate } from "react-router-dom";
import LogoNew from '../../assets/Images/LogoNewVersion.png';
import CircleUser from '../../assets/Images/CircleUser.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Header() {

    const navigate = useNavigate();

    function Feedback() {
        navigate("/Feedback")
    }
    function Perfil() {
        navigate("/Profile")
    }
    function HomePage() {
        navigate("/HomePage")
    }
    function RegistroCar() {
        navigate("/RegisterCar")
    }
    function Reservas() {
        navigate("/Reservas")
    }

    return (
        <>
            <header className={Styles.Cabecalho}>
                <div className={Styles.DivLista}>
                    <ul>
                        <li>
                            <a onClick={() => navigate('/HomePage')}>
                                <img className={Styles.Logo} src={LogoNew} alt="Logo" />
                            </a>
                        </li>
                        <li><a onClick={() => navigate('/HomePage')}>Estacionamentos</a></li>
                        <li><a onClick={() => navigate('/Reservas')}>Reservas</a></li>
                        <li><a onClick={() => navigate('/RegisterCar')}>Cadastrar Veículo</a></li>
                        <li><a href="#parceiros" onClick={Feedback}>Feedback</a></li>
                        <li>
                            <a href="#usuario">
                                <img src={CircleUser} alt="User" onClick={Perfil} className={Styles.UserIcon} />
                            </a>
                        </li>
                    </ul>
                </div>
            </header>

            <nav class="navbar navbar-dark bg-dark fixed-top">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">ParkingLots</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                        <div class="offcanvas-header">
                            <h5 class="offcanvas-title" id="offcanvasDarkNavbarLabel">Dark offcanvas</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body">
                            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                                <li class="nav-item">
                                    <a class="nav-link active" aria-current="page" onClick={HomePage}>Estacionamentos</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" onClick={Reservas}>Reservas</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link active" aria-current="page" onClick={RegistroCar}>Cadastrar Veículo</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" onClick={Feedback}>Feedback</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" onClick={Perfil}>Perfil</a>
                                </li>
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Dropdown
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-dark" onClick={Perfil}>
                                        <li><a class="dropdown-item" href="#" onClick={() => navigateToView('perfil')}>Perfil</a></li>
                                        <li><a class="dropdown-item" href="#" nClick={() => {
                                            navigateToView('senha');
                                            // Pode adicionar outras ações aqui se precisar
                                        }}>Alterar senha</a></li>
                                        <li><a class="dropdown-item" href="#" onClick={() => navigateToView('carros')}>Veículos</a></li>
                                        <li>
                                            <hr class="dropdown-divider" />
                                        </li>
                                        <li><a class="dropdown-item" href="#">Something else here</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header;