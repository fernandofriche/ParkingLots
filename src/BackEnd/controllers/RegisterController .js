import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../Services/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

class RegisterController {
    static async handleRegister(nomeCompleto, email, password, role = "user") {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userData = {
                email: email,
                nomeCompleto: nomeCompleto,
                role: role,
            };

            await setDoc(doc(db, "Users", user.uid), userData);

            return { success: true, message: "Usuário cadastrado com sucesso!" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

export default RegisterController;
