// src/BackEnd/Profile.js
import { auth, db } from '../Services/firebaseConfig';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
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
        
        // Aqui, use o método updatePassword do Firebase
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
}

export default new ProfileService();
