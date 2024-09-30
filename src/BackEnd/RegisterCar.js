// BackEnd/RegisterCar.js
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../Services/firebaseConfig';

class RegisterCar {
    async addCar(carModel, carPlate) {
        const currentUser = auth.currentUser;

        if (carModel && carPlate && currentUser) {
            try {
                const userId = currentUser.uid;
                const userRef = doc(db, "Users", userId);

                await updateDoc(userRef, {
                    cars: arrayUnion({
                        modelo: carModel,
                        placa: carPlate
                    })
                });

                return { success: true, message: "Carro cadastrado com sucesso!" };
            } catch (error) {
                console.error("Erro ao adicionar documento: ", error.message);
                return { success: false, message: "Erro ao cadastrar carro." };
            }
        } else {
            return { success: false, message: "Por favor, preencha todos os campos e certifique-se de estar logado." };
        }
    }
}

export default new RegisterCar();
