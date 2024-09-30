// BackEnd/VisualizarCars.js
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../Services/firebaseConfig';

class VisualizarCars {
    async fetchCars() {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error("Usuário não está logado.");
        }

        const userRef = doc(db, "Users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return userDoc.data().cars || [];
        } else {
            throw new Error("Documento do usuário não encontrado.");
        }
    }

    async removeCar(car) {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error("Usuário não está logado.");
        }

        const userRef = doc(db, "Users", currentUser.uid);
        await updateDoc(userRef, {
            cars: arrayRemove(car)
        });
    }
}

export default new VisualizarCars();
