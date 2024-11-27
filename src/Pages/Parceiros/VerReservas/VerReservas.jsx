import React, { useState, useEffect } from 'react';
import Styles from './VerReservas.module.css';
import { auth, db } from '../../../Services/firebaseConfig';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const VerReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarReservas = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("Usuário não autenticado");
          setLoading(false);
          return;
        }

        const reservasRef = collection(db, 'Reservas');
        const q = query(
          reservasRef, 
          where('parkingOwnerId', '==', user.uid),
          where('status', '==', 'pendente')
        );

        const querySnapshot = await getDocs(q);
        const listaReservas = querySnapshot.docs.map(doc => {
          console.log('Documento raw:', doc);
          
          return {
            id: doc.id,
            ...doc.data()
          };
        });

        setReservas(listaReservas);
        setLoading(false);
      } catch (err) {
        console.error("Erro detalhado ao carregar reservas:", err);
        setError(`Não foi possível carregar as reservas: ${err.message}`);
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        carregarReservas();
      } else {
        setError("Usuário não autenticado");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleStatusReserva = async (reservaId, novoStatus) => {
    try {
      const reservaIdString = String(reservaId);
  
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
  
      console.log('ID da reserva para atualização:', reservaIdString);
  
      const reservaRef = doc(db, 'Reservas', reservaIdString);
      
      await updateDoc(reservaRef, {
        status: novoStatus,
        confirmed: true, 
        updatedAt: serverTimestamp(),
        updatedBy: user.uid
      });
  
      setReservas(atual => 
        atual.filter(reserva => String(reserva.id) !== reservaIdString)
      );
  
    } catch (err) {
      console.error("Erro completo ao atualizar reserva:", err);
      alert(`Erro ao atualizar reserva: ${err.message}`);
    }
  };

  const voltar = () => {
    navigate("/Parceiros");
  };
  if (loading) return <div className={Styles.loading}>Carregando reservas...</div>;
  if (error) return <div className={Styles.error}>Erro: {error}</div>;

  return (

    

    <div className={Styles.container}>
      <h2 className={Styles.title}>Reservas Pendentes</h2>
      
      {reservas.length === 0 ? (
        <p className={Styles.noReservas}>Nenhuma reserva pendente</p>
      ) : (
        reservas.map(reserva => (
          <div 
            key={reserva.id} 
            className={Styles.reservaCard}
          >
            <div className={Styles.reservaInfo}>
              <p><strong>Placa:</strong> {reserva.placa}</p>
              <p><strong>Local:</strong> {reserva.local}</p>
              <p><strong>Valor:</strong> R$ {reserva.valorTotal.toFixed(2)}</p>
              <p><strong>Entrada:</strong> {new Date(reserva.entrada).toLocaleString()}</p>
              <p><strong>Saída:</strong> {new Date(reserva.saida).toLocaleString()}</p>
            </div>
            
            <div className={Styles.buttonGroup}>
              <button 
                onClick={() => handleStatusReserva(reserva.id, 'Aceita')}
                className={Styles.buttonAccept}
              >
                Validar
              </button>
              <button 
                onClick={() => handleStatusReserva(reserva.id, 'Recusada')}
                className={Styles.buttonReject}
              >
                Recusar
              </button>
            </div>
          </div>
        ))
      )}

      <button 
        onClick={voltar} 
        className={Styles.backButton}
      >
        Voltar
      </button>
    </div>
  );
};

export default VerReservas;