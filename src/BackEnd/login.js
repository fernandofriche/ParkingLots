import { auth, db } from "../Services/firebaseConfig";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

class Logar {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    
    async login() {
        try {
            if (!this.email || !this.password) {
                throw new Error("Preencha os campos abaixo corretamente.");
            }

            
            await signInWithEmailAndPassword(auth, this.email, this.password);
            return { success: true, message: "Login realizado com sucesso!" };
        } catch (error) {
            return this.handleError(error);
        }
    }

   
    static async loginWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (!user) throw new Error("Erro ao realizar login com Google.");

            
            const userDocRef = doc(db, "Users", user.uid);
            const userDoc = await getDoc(userDocRef);

            
            if (!userDoc.exists()) {
                await user.delete();
                throw new Error("Este e-mail não está registrado. Realize o cadastro primeiro.");
            }

            return { success: true, message: "Login com Google realizado com sucesso!" };
        } catch (error) {
            return this.handleError(error);
        }
    }

    handleError(error) {
        let errorMessage;

        switch (error.code) {
            case 'auth/wrong-password':
                errorMessage = "Senha incorreta. Por favor, tente novamente.";
                break;
            case 'auth/user-not-found':
                errorMessage = "E-mail não cadastrado. Realize o cadastro primeiro.";
                break;
            case 'auth/invalid-email':
                errorMessage = "O e-mail fornecido é inválido.";
                break;
            case 'auth/invalid-credential':
                errorMessage = "Credenciais inválidas fornecidas.";
                break;
            default:
                errorMessage = "Erro ao realizar login: " + error.message;
        }

        return { success: false, message: errorMessage };
    }
}

export default Logar;
