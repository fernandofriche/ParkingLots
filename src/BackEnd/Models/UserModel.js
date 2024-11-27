import { doc, setDoc } from "firebase/firestore";
import { db } from "../../Services/firebaseConfig";

class UserModel {
    constructor(uid, email, nomeCompleto) {
        this.uid = uid;
        this.email = email;
        this.nomeCompleto = nomeCompleto; 
    }

    async saveToFirestore() {
        try {
            const userRef = doc(db, "Users", this.uid);
            await setDoc(userRef, {
                email: this.email,
                nomeCompleto: this.nomeCompleto,
                createdAt: new Date()
            });
            console.log("Usuário salvo com sucesso no Firestore!");
        } catch (error) {
            console.error("Erro ao salvar usuário no Firestore:", error);
        }
    }
}

export default UserModel;
