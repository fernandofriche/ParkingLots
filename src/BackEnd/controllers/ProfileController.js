// src/BackEnd/ProfileController.js

import ProfileService from '../Profile';
import ProfileModel from "../Models/ProfileModel";

class ProfileController {
    async getUserProfile() {
        const userData = await ProfileService.getUserData();
        if (userData) {
            return new ProfileModel(userData.nomeCompleto, userData.email);
        }
        return null;
    }

    async fetchCars() {
        
        return await ProfileService.fetchCars(); 
    }

    async updateUserProfile(nomeCompleto, email) {
        return await ProfileService.updateUserProfile(nomeCompleto, email);
    }

    async updateUserPassword(novaSenha, senhaAtual) {
        return await ProfileService.updatePassword(novaSenha, senhaAtual);
    }

    async deleteUserProfile() {
        return await ProfileService.deleteUser();
    }

    async deleteCar(carroId) {
        return await ProfileService.removeCar(carroId);
    }
}

export default new ProfileController();
