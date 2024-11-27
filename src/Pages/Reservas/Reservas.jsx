import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../Services/firebaseConfig';
import Styles from './Reservas.module.css';
import LogoNew from '../../assets/Images/LogoNewVersion.png';
import CircleUser from '../../assets/Images/CircleUser.png';
import { useNavigate } from 'react-router-dom';
import { FcCancel } from "react-icons/fc";
import { FaChevronUp, FaChevronDown, FaStar } from 'react-icons/fa';
import Header from "../Header/header"

function Reservas() {
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);
    const [parkingLots, setParkingLots] = useState([]);
    const [collapsedGroups, setCollapsedGroups] = useState({});
    const [selectedMonth, setSelectedMonth] = useState('');
    const [avaliacoes, setAvaliacoes] = useState({});
    const currentUser = auth.currentUser;
    const [selectedYear, setSelectedYear] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [parkingLot, setParkingLot] = useState(null);
    const [address, setAddress] = useState("");
    const [deletingReservas, setDeletingReservas] = useState({});

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const Reservas = () => navigate('/Reservas');
    const VisualizarCarros = () => navigate('/RegisterCar');

    const HomePage = () => navigate('/HomePage');


    useEffect(() => {

        const fetchReservas = async () => {
            if (!currentUser) return;

            try {
                const reservasRef = collection(db, "Reservas");
                const reservasQuery = query(reservasRef, where("userId", "==", currentUser.uid));

                const reservasSnapshot = await getDocs(reservasQuery);

                if (!reservasSnapshot.empty) {
                    const reservas = [];
                    reservasSnapshot.forEach(doc => {
                        reservas.push({
                            ...doc.data(),
                            id: doc.id
                        });
                    });

                    setReservas(reservas);
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
    }, [], [currentUser]
    );

    const formatDate = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleDateString('pt-BR');
    };

    const formatDateTime = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);
        return dateTime.toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
        });
    };

    const handleDelete = async (id) => {
        if (deletingReservas[id]) {
            return;
        }

        setDeletingReservas(prev => ({
            ...prev,
            [id]: true
        }));

        try {
            const reservaParaCancelar = reservas.find(reserva => reserva.id === id);

            if (!reservaParaCancelar) {
                console.error("Reserva não encontrada");
                return;
            }

            if (reservaParaCancelar.userId !== currentUser.uid) {
                console.error("Você não tem permissão para cancelar esta reserva");
                alert("Você não pode cancelar reservas de outros usuários");
                return;
            }

            const reservaRef = doc(db, "Reservas", id);

            await updateDoc(reservaRef, {
                status: "Cancelada",
                canceledBy: currentUser.uid,
                canceledAt: new Date().toISOString()
            });

            setReservas((prevReservas) =>
                prevReservas.map((reserva) =>
                    reserva.id === id ? { ...reserva, status: 'Cancelada' } : reserva
                )
            );

            console.log("Reserva cancelada com sucesso!");
            alert("Reserva cancelada com sucesso!");
        } catch (error) {
            console.error("Erro ao cancelar reserva: ", error);

            if (error.code === 'permission-denied') {
                alert("Você não tem permissão para cancelar esta reserva. Verifique se a reserva pertence a você.");
            } else {
                alert("Erro ao cancelar a reserva. Tente novamente.");
            }
        } finally {
            setDeletingReservas(prev => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
        }
    };



    const toggleGroup = (date) => {
        setCollapsedGroups(prev => ({
            ...prev,
            [date]: !prev[date],
        }));
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleAvaliacao = async (id, nota) => {
        try {
            setAvaliacoes((prev) => ({
                ...prev,
                [id]: nota,
            }));

            const userRef = doc(db, "Users", currentUser.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const reservasAtualizadas = userDoc.data().reservas.map((reserva) =>
                    reserva.id === id ? { ...reserva, avaliacao: nota } : reserva
                );
                await updateDoc(userRef, { reservas: reservasAtualizadas });
                setReservas(reservasAtualizadas);
            }
        } catch (error) {
            console.error("Erro ao salvar avaliação: ", error);
        }
    };

    const renderStars = (id, notaAtual) => {
        const MAX_STARS = 5;
        return (
            <div className={Styles.EstrelasContainer}>
                {[...Array(MAX_STARS)].map((_, index) => {
                    const starValue = index + 1;
                    return (
                        <FaStar
                            key={index}
                            size={20}
                            color={starValue <= (avaliacoes[id] || notaAtual || 0) ? "#ffc107" : "#e4e5e9"}
                            onClick={() => handleAvaliacao(id, starValue)}
                            style={{ cursor: "pointer", marginRight: 5 }}
                        />
                    );
                })}
            </div>
        );
    };

    const filteredReservations = reservas
        .filter(reserva => {
            const date = new Date(reserva.entrada);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();

            return (
                (selectedMonth === '' || selectedMonth === month) &&
                (selectedYear === '' || selectedYear === year.toString())
            );
        })
        .sort((a, b) => new Date(b.entrada) - new Date(a.entrada));

    const groupedReservations = filteredReservations.reduce((acc, reserva) => {
        const date = formatDate(reserva.entrada);
        if (!acc[date]) acc[date] = [];
        acc[date].push(reserva);
        return acc;
    }, {});

    return (
        <div className={Styles.Page}>
            <Header/>

            <main className={Styles.ReservasMainContent}>
                <div className={Styles.Align}>
                    <div className={Styles.FiltroMes}>
                        <label htmlFor="year" className={Styles.LabelFiltroMes}>Filtrar por Ano: </label>
                        <select
                            id="year"
                            value={selectedYear}
                            onChange={handleYearChange}
                            className={Styles.SelectFiltroMes}
                        >
                            <option value="">Todos</option>
                            {[2024, 2025, 2026].map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={Styles.FiltroMes}>
                        <label htmlFor="month" className={Styles.LabelFiltroMes}>Filtrar por Mês: </label>
                        <select
                            id="month"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            className={Styles.SelectFiltroMes}
                        >
                            <option value="">Todos</option>
                            {[...Array(12)].map((_, index) => {
                                const month = (index + 1).toString().padStart(2, '0');
                                return (
                                    <option key={month} value={month}>
                                        {new Date(2000, index).toLocaleString('pt-BR', { month: 'long' })}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                {/* Teste pra testar o save */}
                {Object.keys(groupedReservations).length > 0 ? (
                    Object.keys(groupedReservations).map(date => (
                        <div key={date} className={Styles.paddingReserva}>
                            <div className={Styles.DataContainer}>
                                <h2 onClick={() => toggleGroup(date)}>
                                    {date} {collapsedGroups[date] ? <FaChevronUp /> : <FaChevronDown />}
                                </h2>
                            </div>
                            {!collapsedGroups[date] && (
                                <table className={Styles.ReservasTable}>
                                    <thead>
                                        <tr>
                                            <th>TICKET ID</th>
                                            <th>PLACA</th>
                                            <th>LOCAL</th>
                                            <th>ENTRADA</th>
                                            <th>SAÍDA</th>
                                            <th>TOTAL</th>
                                            <th>STATUS</th>
                                            <th>AÇÕES</th>
                                        </tr>

                                    </thead>
                                    <tbody>
                                        {groupedReservations[date].map((reserva) => (
                                            <tr key={reserva.id}>
                                                <td>{reserva.id}</td>
                                                <td>{reserva.placa}</td>
                                                <td>{reserva.local}</td>
                                                <td>{formatDateTime(reserva.entrada)}</td>
                                                <td>{formatDateTime(reserva.saida)}</td>
                                                <td>{`R$ ${(reserva.valorTotal).toFixed(2)}`}</td>
                                                <td>{reserva.status}</td>

                                                <td>
                                                    <button
                                                        onClick={() => handleDelete(reserva.id)}
                                                        className={Styles.BotaoCancelar}
                                                        disabled={deletingReservas[reserva.id] || reserva.status === 'Cancelada'}
                                                    >
                                                        {deletingReservas[reserva.id] ? 'Cancelando...' : 'Cancelar'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            )}
                        </div>
                    ))
                ) : (
                    <div className={Styles.SemReservas}>
                        <h2>Nenhuma reserva encontrada.</h2>
                    </div>
                )}

            </main>
        </div>
    );
}

export default Reservas;
