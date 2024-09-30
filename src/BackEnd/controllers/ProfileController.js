// src/BackEnd/ProfileController.js
import ProfileService from '../Profile';
import ProfileModel from "../Models/ProfileModel"

class ProfileController {
    async getUserProfile() {
        const userData = await ProfileService.getUserData();
        if (userData) {
            return new ProfileModel(userData.nomeCompleto, userData.email);
        }
        return null;
    }

    async updateUserPassword(novaSenha, senhaAtual) {
        return await ProfileService.updatePassword(novaSenha, senhaAtual);
    }

    async deleteUserProfile() {
        return await ProfileService.deleteUser();
    }
}

export default new ProfileController();
