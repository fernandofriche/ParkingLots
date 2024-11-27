import React, { useState, useEffect } from "react";
import Styles from './Estacionamentos.module.css';
import { auth, db } from "../../../Services/firebaseConfig";
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

function Estacionamentos() {

    const navigate = useNavigate();
    const [userParkingLots, setUserParkingLots] = useState([]);

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

    // Função para excluir um estacionamento
    const handleDelete = async (parkingLotId) => {
        try {
            await deleteDoc(doc(db, "ParkingLots", parkingLotId));
            // Atualizar a lista de estacionamentos após a exclusão
            setUserParkingLots((prevLots) => prevLots.filter((lot) => lot.id !== parkingLotId));
        } catch (error) {
            console.error("Erro ao excluir estacionamento:", error);
        }
    };

    useEffect(() => {
        fetchUserParkingLots();
    }, []);

    return (
        <div className={Styles.container}>
            <h2>Seus Estacionamentos</h2>
            {userParkingLots.length === 0 ? (
                <p className={Styles.emptyState}>Você ainda não possui estacionamentos cadastrados.</p>
            ) : (
                userParkingLots.map((lot) => (
                    <div key={lot.id} className={Styles.parkingLotCard}>
                        <p><strong>Nome:</strong> {lot.name}</p>
                        <p><strong>Endreço:</strong>{lot.address}</p>
                        <p><strong>Preço por hora:</strong> R$ {lot.hourlyRate}</p>
                        <p><strong>Preço da diária:</strong> R$ {lot.dailyRate}</p>
                        <img src={lot.imageURL} alt={lot.name} className={Styles.parkingLotImage} />
                        <button onClick={() => handleDelete(lot.id)} className={Styles.deleteButton}>
                            Excluir
                        </button>
                    </div>
                ))
            )}

            <button
                onClick={() => navigate("/Parceiros")}
                className={Styles.backButton}
            >
                Voltar
            </button>        
        </div>
    );
}

export default Estacionamentos;
