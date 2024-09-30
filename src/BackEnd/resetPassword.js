import { auth } from "../Services/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

class ResetPasswordService {
    static async resetPassword(email) {
        try {
            if (!email) {
                throw new Error("Por favor, insira um e-mail.");
            }
            await sendPasswordResetEmail(auth, email);
            return { success: true, message: "E-mail de redefinição de senha enviado!" };
        } catch (error) {
            let errorMessage;
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = "O e-mail fornecido é inválido.";
                    break;
                case 'auth/user-not-found':
                    errorMessage = "Nenhum usuário encontrado com este e-mail.";
                    break;
                default:
                    errorMessage = "Erro ao enviar e-mail: " + error.message;
            }
            return { success: false, message: errorMessage };
        }
    }
}

export default ResetPasswordService;