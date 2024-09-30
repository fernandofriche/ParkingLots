// src/BackEnd/Profile.js
import { auth, db } from '../Services/firebaseConfig';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

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
        await usuario.updatePassword(novaSenha);
    }
}

export default new ProfileService();

