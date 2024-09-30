import { doc, getDoc } from "firebase/firestore"; // Importar doc e getDoc corretamente
import { auth, db } from "./firebaseConfig"; // Certificar-se de que db está importado corretamente
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

class AuthService {
  static async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user) throw new Error("Erro ao realizar login com Google.");

      // Acessar documento do usuário no Firestore usando doc e getDoc
      const userDocRef = doc(db, "Users", user.uid); // Certifique-se de passar o caminho correto para o documento
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error("Este e-mail não está registrado. Realize o cadastro primeiro.");
      }

      return { success: true, message: "Login com Google realizado com sucesso!" };
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  static handleError(error) {
    console.error("Erro ao realizar login:", error.message);
    return { success: false, message: error.message };
  }
}

export default AuthService;
