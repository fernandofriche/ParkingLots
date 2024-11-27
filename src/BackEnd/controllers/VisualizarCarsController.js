import VisualizarCarsService from '../VisualizarCars';

class VisualizarCarsController {
    async fetchCars() {
        return await VisualizarCarsService.fetchCars();
    }

    async deleteCar(carroId) {
        return await VisualizarCarsService.removeCar(carroId); 
    }
}

export default new VisualizarCarsController();
