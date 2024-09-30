import React, { useState, useEffect } from 'react';
import Styles from './VisualizarCars.module.css';
import { useNavigate } from 'react-router-dom';
import VisualizarCarsController from "../../BackEnd/VisualizarCars"

function VisualizarCars() {
    const [cars, setCars] = useState([]);
    const navigate = useNavigate();

    const HomePage = () => {
        navigate('/HomePage');
    };

    const AdicionarCarro = () => {
        navigate('/RegisterCar');
    };

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const fetchedCars = await VisualizarCarsController.fetchCars(); 
                setCars(fetchedCars);
            } catch (error) {
                console.error("Erro ao buscar carros: ", error);
            }
        };

        fetchCars();
    }, []);

    const RemoverCarro = async (car) => {
        const Confirmar = window.confirm("Tem certeza de que deseja excluir este carro?");
        
        if (Confirmar) {
            try {
                await VisualizarCarsController.removeCar(car); 
                setCars(cars.filter(c => c.placa !== car.placa));
            } catch (error) {
                console.error("Erro ao excluir carro: ", error);
            }
        }
    };

    return (
        <div className={Styles.container}>
            <h1>Seus Carros</h1>
            <div className={Styles.cardsContainer}>
                {cars.length > 0 ? (
                    cars.map((car, index) => (
                        <div key={index} className={Styles.card}>
                            <h2>{car.modelo}</h2>
                            <p>Placa: {car.placa}</p>
                            <button onClick={() => RemoverCarro(car)} className={Styles.deleteButton}>Excluir</button>
                        </div>
                    ))
                ) : (
                    <p>Não há carros cadastrados.</p>
                )}
                <button onClick={AdicionarCarro}>Adicionar Carro</button>
            </div>
            <button onClick={HomePage}>Voltar</button>
        </div>
    );
}

export default VisualizarCars;
