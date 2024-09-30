import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"; // Adicione GoogleAuthProvider
import { auth, db } from "../../Services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

class LoginController {
    static async handleLogin(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, message: "Login realizado com sucesso!", user: userCredential.user };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    static async handleLoginWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Verificar se o usuário já está registrado
            const userDocRef = doc(db, "Users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                throw new Error("Este e-mail não está registrado. Realize o cadastro primeiro.");
            }

            return { success: true, message: "Login com Google realizado com sucesso!", user };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

export default LoginController;
