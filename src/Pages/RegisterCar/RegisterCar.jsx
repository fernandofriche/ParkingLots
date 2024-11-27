import React, { useState } from 'react';
import Styles from './RegisterCar.module.css';
import LogoNew from '../../assets/Images/LogoNewVersion.png';
import CircleUser from '../../assets/Images/CircleUser.png';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaRegEye } from 'react-icons/fa';
import { MdOutlineAdd } from 'react-icons/md';
import RegisterCarController from '../../BackEnd/controllers/RegisterCarController';
import Header from "../Header/header"


function RegisterCar() {
    const navigate = useNavigate();
    const [carModel, setCarModel] = useState("");
    const [carPlate, setCarPlate] = useState("");

    const HomePage = () => navigate('/HomePage');
    const Reservas = () => navigate('/Reservas');
    const ShowCars = () => navigate('/Profile');
    const Profile = () => navigate('/Profile');

    const AdicionarCar = async () => {
        const response = await RegisterCarController.addCar(carModel, carPlate);
        alert(response.message);
        if (response.success) {
            setCarModel("");
            setCarPlate("");
        }
    };

    return (
        <>
            <Header />

            <main className={Styles.main}>
                <h1 className={Styles.title}>
                    <FaCar className={Styles.icon} /> Cadastrar veículo
                </h1>
                <div className={Styles.container}>
                    <div className={Styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="Modelo do carro"
                            value={carModel}
                            onChange={(e) => setCarModel(e.target.value)}
                        />
                    </div>
                    <div className={Styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="Placa do carro"
                            value={carPlate}
                            onChange={(e) => setCarPlate(e.target.value.toUpperCase())}
                            maxLength={7}
                        />
                    </div>
                    <button onClick={AdicionarCar} className={Styles.addButton}>
                        <MdOutlineAdd /> Adicionar Veículo
                    </button>
                </div>
                <a href="#" onClick={ShowCars} className={Styles.viewVehicles}>
                    <FaRegEye /> Visualizar Veículos Cadastrados
                </a>
            </main>
        </>
    );
}

export default RegisterCar;
