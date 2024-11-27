import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../Services/firebaseConfig';
import { v4 as uuidv4 } from 'uuid'; // Importando o UUID para gerar um ID único

class RegisterCar {
    async addCar(carModel, carPlate) {
        const currentUser = auth.currentUser;

        if (carModel && carPlate && currentUser) {
            try {
                const userId = currentUser.uid;
                const userRef = doc(db, "Users", userId);

                const carId = uuidv4();

                await updateDoc(userRef, {
                    cars: arrayUnion({
                        id: carId,
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
