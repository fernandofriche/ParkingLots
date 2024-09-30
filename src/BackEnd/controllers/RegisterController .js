// RegisterController.js
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Services/firebaseConfig";
import UserModel from "../Models/UserModel"

class RegisterController {
    static async handleRegister(nomeCompleto, email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Salvar dados do usuário no Firestore usando o UserModel
            const userModel = new UserModel(user.uid, email, nomeCompleto);
            await userModel.saveToFirestore();

            return { success: true, message: "Usuário cadastrado com sucesso!" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

export default RegisterController;
