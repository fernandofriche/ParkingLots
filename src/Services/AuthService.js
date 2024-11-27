import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";

class AuthService {
  static async loginWithEmailAndPassword(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user) throw new Error("Erro ao realizar login.");

      const userDocRef = doc(db, "Users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error("Usuário não encontrado.");
      }

      const userData = userDoc.data();
      return {
        success: true,
        message: "Login realizado com sucesso!",
        role: userData.role,
        cnpj: userData.cnpj || null 
    };    
      
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
