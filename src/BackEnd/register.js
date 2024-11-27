import { auth, db } from "../Services/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

class RegisterClass {
    constructor(nomeCompleto, email, password, role = "user", cnpj = "") { 
        this.nomeCompleto = nomeCompleto;
        this.email = email;
        this.password = password;
        this.role = role;
        this.cnpj = cnpj;
    }

    async register() {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
            const user = userCredential.user;

            if (user) {
                console.log("Usuário criado:", user.uid);
                const userData = {
                    email: this.email,
                    nomeCompleto: this.nomeCompleto,
                    role: this.role
                };

                if (this.role === "admin") {
                    userData.cnpj = this.cnpj;
                }

                await setDoc(doc(db, "Users", user.uid), userData);
                console.log("Dados do usuário salvos no Firestore.");
            }

            return { success: true, message: "Usuário cadastrado com sucesso!" };
        } catch (error) {
            return this.handleError(error);
        }
    }

    handleError(error) {
        let errorMessage;

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = "Este e-mail já está sendo utilizado por outra conta.";
                break;
            case 'auth/invalid-email':
                errorMessage = "O e-mail fornecido é inválido.";
                break;
            case 'auth/weak-password':
                errorMessage = "A senha deve ter pelo menos 6 caracteres.";
                break;
            case 'auth/operation-not-allowed':
                errorMessage = "Operação não permitida. Por favor, entre em contato com o suporte.";
                break;
            default:
                errorMessage = "Ocorreu um erro ao registrar o usuário. Verifique se os campos estão preenchidos corretamente.";
        }

        return { success: false, message: errorMessage };
    }
}

export default RegisterClass;
