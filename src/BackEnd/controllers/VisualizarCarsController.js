// src/BackEnd/VisualizarCarsController.js
import VisualizarCarsService from '../BackEnd/VisualizarCars';
import VisualizarCarsModel from '../Models/VisualizarCarsModel';

class VisualizarCarsController {
    async fetchCars() {
        return await VisualizarCarsService.fetchCars();
    }

    async removeCar(car) {
        return await VisualizarCarsService.removeCar(car);
    }
}

export default new VisualizarCarsController();
