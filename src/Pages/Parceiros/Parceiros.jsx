import React, { useState, useEffect } from "react";
import Styles from './Parceiros.module.css';
import { useNavigate } from "react-router-dom";
import { auth, db } from '../../Services/firebaseConfig';
import { doc, getDoc, collection, addDoc, getDocs, deleteDoc, query, where, updateDoc } from 'firebase/firestore';
import LogoNew from '../../assets/Images/LogoNewVersion.png';
import CircleUser from '../../assets/Images/CircleUser.png';
import { signOut } from "firebase/auth";

function Parceiros() {
    const [name, setName] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [dailyRate, setDailyRate] = useState('');
    const [address, setAddress] = useState('');
    const [userParkingLots, setUserParkingLots] = useState([]);
    const [reservasPendentes, setReservasPendentes] = useState([]);
    const navigate = useNavigate();

    const MeusEstacionamentos = () => navigate('/EstacionamentosParceiros');
    const VizuReservas = () => navigate('/VisualizarReservasParceiro');


    const fetchUserParkingLots = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const parkingLotsQuery = query(
                collection(db, "ParkingLots"),
                where("ownerId", "==", user.uid)
            );
            const querySnapshot = await getDocs(parkingLotsQuery);
            const lots = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserParkingLots(lots);
        } catch (error) {
            console.error("Erro ao buscar estacionamentos do parceiro: ", error);
        }
    };

    const fetchReservasPendentes = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const reservasPendentes = [];
        const parkingLotsQuery = query(
            collection(db, "ParkingLots"),
            where("ownerId", "==", user.uid)
        );

        const parkingLotsSnapshot = await getDocs(parkingLotsQuery);

        for (const parkingLotDoc of parkingLotsSnapshot.docs) {
            const parkingLot = parkingLotDoc.data();
            const reservasQuery = query(
                collection(db, "Reservas"),
                where("parkingOwnerId", "==", user.uid),
                where("status", "==", "pendente"),
                where("parkingLotId", "==", parkingLot.id)
            );

            const reservasSnapshot = await getDocs(reservasQuery);
            reservasSnapshot.forEach(doc => {
                reservasPendentes.push(doc.data());
            });
        }

        setReservasPendentes(reservasPendentes);
    };

    useEffect(() => {
        const checkUserRole = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, "Users", user.uid));
                if (!userDoc.exists() || userDoc.data().role !== "partner") {
                    navigate('/no-access');
                }
            } else {
                navigate('/login');
            }
        };

        checkUserRole();
        fetchUserParkingLots();
        fetchReservasPendentes();
    }, [navigate]);

    const addParkingLot = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert("Usuário não autenticado!");
            return;
        }

        if (!name || !hourlyRate || !imageURL || !dailyRate || !address) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const newParkingLot = {
                name,
                hourlyRate: parseFloat(hourlyRate),
                imageURL,
                dailyRate: parseFloat(dailyRate),
                ownerId: user.uid,
                address
            };

            await addDoc(collection(db, "ParkingLots"), newParkingLot);
            alert("Estacionamento adicionado com sucesso!");
            setName('');
            setHourlyRate('');
            setImageURL('');
            setDailyRate('');
            setAddress('');
            fetchUserParkingLots();
        } catch (error) {
            console.error("Erro ao adicionar estacionamento: ", error);
            alert("Erro ao adicionar estacionamento. Tente novamente.");
        }
    };

    const handleLogout = async () => {
        const confirmLogout = window.confirm("Tem certeza que deseja sair?");
        if (confirmLogout) {
            await signOut(auth);
            navigate('/');
        }
    };

    return (
        <>

            <header className={Styles.Cabecalho}>
                <div className={Styles.DivLista}>
                    <ul>
                        <li>
                            <a href="/Parceiros">
                                <img className={Styles.Logo} src={LogoNew} alt="Logo" />
                            </a>
                        </li>
                        <li><a href="#" onClick={MeusEstacionamentos}>Gerenciar</a></li>
                        <li><a href="#" onClick={VizuReservas}>Ver Reservas</a></li>
                        <button onClick={handleLogout} className={Styles.logoutButton}>Sair</button>
                    </ul>
                </div>
                

            </header>

            <main className={Styles.main}>
                {/* 
           <nav className={Styles.menu}>
                <button onClick={() => navigate("/EstacionamentosParceiros")} className={Styles.menuButton}>
                    Meus Estacionamentos
                </button>
                <button onClick={() => navigate("/VisualizarReservasParceiro")} className={Styles.menuButton}>
                    Ver Reservas Realizadas
                </button>
            </nav>
         */}

                <div className={Styles.content}>
                    <h2>Cadastrar Estacionamento</h2>
                    <input
                        type="text"
                        placeholder="Nome do estacionamento"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={Styles.input}
                    />

                    <input
                        type="text"
                        placeholder="Endereço do estacionamento"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={Styles.input}
                    />

                    <input
                        type="number"
                        placeholder="Preço por hora"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        className={Styles.input}
                    />

                    <input
                        type="number"
                        placeholder="Preço da diária"
                        value={dailyRate}
                        onChange={(e) => setDailyRate(e.target.value)}
                        className={Styles.input}
                    />

                    <input
                        type="text"
                        placeholder="URL da imagem"
                        value={imageURL}
                        onChange={(e) => setImageURL(e.target.value)}
                        className={Styles.input}
                    />


                    <button onClick={addParkingLot} className={Styles.btn}>Adicionar Estacionamento</button>
                </div>
            </main>
        </>
    );
}

export default Parceiros;
