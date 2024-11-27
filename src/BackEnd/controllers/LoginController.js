import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../../Services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

class LoginController {
    static async handleLogin(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDocRef = doc(db, "Users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const role = userDoc.data().role;
                return { success: true, message: "Login realizado com sucesso!", role };
            } else {
                throw new Error("Dados do usuário não encontrados.");
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    static async handleLoginWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userDocRef = doc(db, "Users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                throw new Error("Este e-mail não está registrado. Realize o cadastro primeiro.");
            }

            const role = userDoc.data().role;
            return { success: true, message: "Login com Google realizado com sucesso!", role };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

export default LoginController;
