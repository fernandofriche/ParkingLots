// src/BackEnd/ProfileService.js
// src/BackEnd/ProfileService.js
import { auth, db } from '../Services/firebaseConfig';
import { doc, getDoc, deleteDoc, updateDoc, arrayRemove, collection, getDocs, query, where } from 'firebase/firestore';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';


class ProfileService {
    async getUserData() {
        const usuario = auth.currentUser;
        if (usuario) {
            const docRef = doc(db, "Users", usuario.uid);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
        }
        return null;
    }

    async fetchCars() {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error("Usuário não autenticado.");
        }

        const userDocRef = doc(db, "Users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const carros = userData.cars || []; 
            return carros;
        } else {
            throw new Error("Usuário não encontrado.");
        }
    }

    async deleteUser() {
        const usuario = auth.currentUser;
        if (usuario) {
            const userDocRef = doc(db, 'Users', usuario.uid);
            await deleteDoc(userDocRef);
            await usuario.delete();
        }
    }

    async updatePassword(novaSenha, senhaAtual) {
        const usuario = auth.currentUser;
        if (!usuario) throw new Error('Usuário não autenticado.');

        const credencial = EmailAuthProvider.credential(usuario.email, senhaAtual);
        await reauthenticateWithCredential(usuario, credencial);
        await updatePassword(usuario, novaSenha);
    }

    async updateUserProfile(nomeCompleto, email) {
        const usuario = auth.currentUser;
        if (!usuario) throw new Error('Usuário não autenticado.');

        const userDocRef = doc(db, 'Users', usuario.uid);
        await updateDoc(userDocRef, {
            nomeCompleto: nomeCompleto,
            email: email
        });
    }

    async removeCar(carroId) {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error("Usuário não está logado.");
        }

        const userRef = doc(db, "Users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();

            await updateDoc(userRef, {
                cars: arrayRemove(userData.cars.find(carro => carro.id === carroId))
            });

            return { success: true, message: "Carro removido com sucesso!" };
        } else {
            throw new Error("Usuário não encontrado.");
        }
    }
    
    
}

export default new ProfileService();

