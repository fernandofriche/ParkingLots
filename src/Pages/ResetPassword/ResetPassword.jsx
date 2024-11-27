import React, { useState } from "react";
import Styles from './ResetPassword.module.css';
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Logo7 from '../../assets/Images/Logo7.svg';
import { FaArrowCircleLeft } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";  
import ResetPasswordController from '../../BackEnd/controllers/ResetPasswordController'; 

function ResetPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const ResetSenha = async (e) => {
        e.preventDefault();
        const response = await ResetPasswordController.resetPassword(email); 
        if (response.success) {
            toast.success(response.message);
            setEmail(""); 
        } else {
            toast.error(response.message);
        }
    };

    function VoltarLogin() {
        navigate('/');
    }

    return (
        <>
            <ToastContainer />
            <div className={Styles.container}>
                <div className={Styles.leftSide}>
                    <button className={Styles.backButton} onClick={VoltarLogin}>
                        <FaArrowCircleLeft size={24} /> Voltar
                    </button>
                    <h1 className={Styles.title}>Esqueceu a senha?</h1>
                    <p className={Styles.instructions}>
                        Insira seu e-mail e nós iremos te enviar <br /> todas instruções para redefinir a sua senha
                    </p>
                    <form className={Styles.form} onSubmit={ResetSenha}>
                        <input
                            type="email"
                            placeholder="Email *"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            className={Styles.input}
                        />
                        <button type="submit" className={Styles.submitButton}>
                            Enviar Link de Redefinição
                        </button>
                    </form>
                    <p className={Styles.registerText}>
                        Ainda não possui uma conta? <a href="/register">Registrar</a>
                    </p>
                </div>
                <div className={Styles.rightSide}>
                    <img src={Logo7} alt="Logo Parking Lots" className={Styles.Logo} />
                </div>
            </div>
        </>
    );
}

export default ResetPassword;
