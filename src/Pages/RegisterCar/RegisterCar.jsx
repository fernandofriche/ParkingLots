import React, { useState } from 'react';
import Styles from './RegisterCar.module.css';
import LogoNew from '../../assets/Images/LogoNewVersion.png';
import CircleUser from '../../assets/Images/CircleUser.png';
import { useNavigate } from 'react-router-dom';
import RegisterCarController from '../../BackEnd/controllers/RegisterCarController'; 

function RegisterCar() {
    const navigate = useNavigate();
    const [carModel, setCarModel] = useState("");
    const [carPlate, setCarPlate] = useState("");

    const TelaLogin = () => {
        navigate('/');
    };

    const HomePage = () => {
        navigate('/HomePage');
    };

    const Reservas = () => {
        navigate('/Reservas');
    };

    const ShowCars = () => {
        navigate('/VisualizarCars');
    };

    const AdicionarCar = async () => {
        const response = await RegisterCarController.addCar(carModel, carPlate); // Chamada ao controlador
        alert(response.message);
        if (response.success) {
            setCarModel("");
            setCarPlate("");
        }
    };

    return (
        <>
            <header className={Styles.Cabecalho}>
                <div className={Styles.DivLista}>
                    <ul>
                        <li>
                            <a onClick={HomePage} href="#HomePage">
                                <img className={Styles.Logo} src={LogoNew} alt="Logo" />
                            </a>
                        </li>
                        <li><a href="#" onClick={HomePage}><li>Estacionamentos</li></a></li>
                        <li><a href="#" onClick={Reservas}><li>Reservas</li></a></li>
                        <li><a href="#" onClick={ShowCars}><li>Seu Carro</li></a></li>
                        <li><a href="#"><li>Como Funciona</li></a></li>
                        <li><a href="#"><img src={CircleUser} alt="User" /></a></li>
                    </ul>
                </div>
            </header>
           
            <main className={Styles.main}>
                <h1 className={Styles.title}>Cadastrar veículo</h1>
                <div className={Styles.container}>
                    <div className={Styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="INSIRA O MODELO DO CARRO"
                            value={carModel}
                            onChange={(e) => setCarModel(e.target.value)}
                        />
                    </div>
                    <div className={Styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="INSIRA A PLACA DO CARRO"
                            value={carPlate}
                            onChange={(e) => setCarPlate(e.target.value)}
                        />
                    </div>
                    <button onClick={AdicionarCar}>ADD</button>
                </div>
                <a href="#" onClick={ShowCars} className={Styles.viewVehicles}>Visualizar Veículos Cadastrados</a>
            </main>
        </>
    );
}

export default RegisterCar;
