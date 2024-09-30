// src/BackEnd/RegisterCarController.js
import RegisterCarService from '../RegisterCar';
import RegisterCarModel from '../Models/RegisterCarModel';

class RegisterCarController {
    async addCar(modelo, placa) {
        const car = new RegisterCarModel(modelo, placa);
        return await RegisterCarService.addCar(car.modelo, car.placa);
    }
}

export default new RegisterCarController();
