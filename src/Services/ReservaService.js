import { db } from './firebaseConfig';
import Reserva from '../Models/Reserva';

class ReservaService {
    async adicionarReserva(reserva) {
        const reservaRef = db.collection('reservas').doc();
        await reservaRef.set({ ...reserva });
        return { id: reservaRef.id, ...reserva };
    }

    async buscarReservaPorId(id) {
        const reservaRef = db.collection('reservas').doc(id);
        const doc = await reservaRef.get();
        if (!doc.exists) {
            throw new Error('Reserva não encontrada');
        }
        return { id: doc.id, ...doc.data() };
    }

}

export default new ReservaService();
