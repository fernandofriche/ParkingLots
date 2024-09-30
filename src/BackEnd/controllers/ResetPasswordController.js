import ResetPasswordService from '../resetPassword';

class ResetPasswordController {
    async resetPassword(email) {
        return await ResetPasswordService.resetPassword(email);
    }
}

export default new ResetPasswordController();
