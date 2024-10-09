import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../Services/firebaseConfig';
import Styles from './Reservas.module.css';
import LogoNew from '../../assets/Images/LogoNewVersion.png';
import CircleUser from '../../assets/Images/CircleUser.png';
import { useNavigate } from 'react-router-dom';
import iconDelete from '../../assets/Images/iconDelete.png';
import { FcCancel } from "react-icons/fc";

function Reservas() {
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [reservationId, setReservationId] = useState(null); // Armazena o ID da reserva a ser cancelada
    const [parkingLots, setParkingLots] = useState([]);
    const [editForm, setEditForm] = useState({
        placa: '',
        local: '',
        entrada: '',
        saida: ''
    });
    const [valorTotal, setValorTotal] = useState(0);
    const currentUser = auth.currentUser;

    function Estacionamentos() {
        navigate('/HomePage');
    }

    function HomePage() {
        navigate('/HomePage');
    }

    function RegisterCar() {
        navigate('/RegisterCar');
    }

    function Profile() {
        navigate('/Profile');
    }

    useEffect(() => {
        const fetchReservas = async () => {
            if (!currentUser) {
                console.error("Usuário não está logado.");
                return;
            }

            try {
                const userRef = doc(db, "Users", currentUser.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setReservas(userData.reservas || []);
                } else {
                    console.error("Documento do usuário não encontrado.");
                    setReservas([]);
                }
            } catch (error) {
                console.error("Erro ao buscar reservas: ", error);
            }
        };

        const fetchParkingLots = async () => {
            try {
                const response = await fetch('/parkinglots.json');
                const data = await response.json();
                setParkingLots(data.parkingLots);
            } catch (error) {
                console.error("Erro ao buscar estacionamentos: ", error);
            }
        };

        fetchReservas();
        fetchParkingLots();
    }, [currentUser]);

    const calcularValorTotal = (entrada, saida, hourlyRate) => {
        if (!entrada || !saida) return 0;

        const horaEntrada = new Date(entrada);
        const horaSaida = new Date(saida);

        if (horaSaida <= horaEntrada) {
            horaSaida.setDate(horaSaida.getDate() + 1);
        }

        const diferencaHoras = (horaSaida - horaEntrada) / (1000 * 60 * 60);
        console.log(`Valor total calculado: ${diferencaHoras * hourlyRate}`);
        return diferencaHoras * hourlyRate;
    };

    useEffect(() => {
        if (editForm.entrada && editForm.saida) {
            const parkingLot = parkingLots.find(lot => lot.name === editForm.local);
            const hourlyRate = parkingLot ? parkingLot.hourlyRate : 0;
            const valor = calcularValorTotal(editForm.entrada, editForm.saida, hourlyRate);
            setValorTotal(valor);
        }
    }, [editForm, parkingLots]);

    const handleDelete = async (id) => {
        try {
            const userRef = doc(db, "Users", currentUser.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const reservasAtualizadas = userDoc.data().reservas.filter(reserva => reserva.id !== id);
                await updateDoc(userRef, { reservas: reservasAtualizadas });
                setReservas(reservasAtualizadas);
            } else {
                console.error("Documento do usuário não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao excluir reserva: ", error);
        }
    };

    const openModal = (id) => {
        setReservationId(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setReservationId(null);
    };

    const confirmDelete = () => {
        handleDelete(reservationId);
        closeModal();
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'Data e Hora inválidas';

        const dateTime = new Date(dateTimeString);
        return dateTime.toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
    };

    return (
        <div>
            <header className={Styles.Cabecalho}>
                <div className={Styles.DivLista}>
                    <ul>
                        <li>
                            <a onClick={HomePage}>
                                <img className={Styles.Logo} src={LogoNew} alt="Logo" />
                            </a>
                        </li>
                        <li><a href="#estacionamentos" onClick={Estacionamentos}>Estacionamentos</a></li>
                        <li><a href="#reservas">Reservas</a></li>
                        <li><a href="#seu-carro" onClick={RegisterCar}>Seu Carro</a></li>
                        <li><a href="#como-funciona">Como Funciona</a></li>
                        <li>
                            <a onClick={Profile}>
                                <img src={CircleUser} alt="User" className={Styles.UserIcon} />
                            </a>
                        </li>
                    </ul>
                </div>
            </header>

            <main className={Styles.ReservasMainContent}>
                {reservas.length > 0 ? (
                    <table className={Styles.ReservasTable}>
                        <thead>
                            <tr>
                                <th>TICKET ID</th>
                                <th>PLACA DO VEÍCULO</th>
                                <th>LOCAL</th>
                                <th>ENTRADA</th>
                                <th>SAÍDA</th>
                                <th>VALOR TOTAL</th>
                                <th>AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.map((reserva) => {
                                const parkingLot = parkingLots.find(lot => lot.name === reserva.local);
                                const valorTotal = calcularValorTotal(
                                    reserva.entrada,
                                    reserva.saida,
                                    parkingLot ? parkingLot.hourlyRate : 0
                                );

                                return (
                                    <tr key={reserva.id}>
                                        <td>{reserva.id}</td>
                                        <td>{reserva.placa}</td>
                                        <td>{reserva.local}</td>
                                        <td>{formatDateTime(reserva.entrada)}</td>
                                        <td>{formatDateTime(reserva.saida)}</td>
                                        <td>R$ {valorTotal.toFixed(2)}</td>
                                        <td>
                                            <button onClick={() => openModal(reserva.id)}>
                                                <FcCancel className={Styles.IconDelete} /> {/* Ícone de deletar */}
                                            </button>                                       
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className={Styles.NoReservas}>
                        <p>*Não há necessidade de imprimir nada! Todas as suas reservas estão aqui.*</p>
                        <p>*Os estacionamentos modernos são equipados com reconhecimento automático de placas (ALPR).*</p>
                    </div>
                )}

                {/* Modal de confirmação */}
                {showModal && (
                    <div className={Styles.Overlay}>
                        <div className={Styles.ModalReserva}>
                            <h2>Confirmar Cancelamento</h2>
                            <p>Tem certeza de que deseja cancelar esta reserva?</p>
                            <button type="button" onClick={confirmDelete}>
                                Confirmar
                            </button>
                            <button type="button" onClick={closeModal}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Reservas;
