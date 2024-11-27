import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash, FaArrowCircleLeft } from 'react-icons/fa';
import Styles from './Register.module.css';
import RegisterController from "../../BackEnd/controllers/RegisterController ";
import Logo7 from '../../assets/Images/Logo7.svg';

function Register() {
    const navigate = useNavigate();
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
    const [userType, setUserType] = useState("user");

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowConfirmedPassword = () => setShowConfirmedPassword(!showConfirmedPassword);

    const Voltar = () => navigate('/');

    const RealizarRegistro = async (e) => {
        e.preventDefault();
        if (password !== confirmedPassword) {
            toast.error("As senhas não coincidem", { position: "top-center" });
            return;
        }

        const result = await RegisterController.handleRegister(nomeCompleto, email, password, userType);
        if (result.success) {
            toast.success(result.message, { position: "top-center" });
            setTimeout(() => navigate('/'), 2000);
        } else {
            toast.error(result.message, { position: "top-center" });
        }
    };

    return (
        <>
            <ToastContainer />
            <form className={Styles.formContainer} onSubmit={RealizarRegistro}>
                <div className={Styles.container}>
                    <div className={Styles.esquerda}>
                        <button className={Styles.btnVoltar} onClick={Voltar}>
                            <FaArrowCircleLeft size={24} /> Voltar
                        </button>
                        <h1>Cadastro</h1>

                        <div className={Styles.radioContainer}>
                            <label>
                                <input
                                    type="radio"
                                    value="user"
                                    checked={userType === "user"}
                                    onChange={() => setUserType("user")}
                                />
                                Usuário
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="partner"
                                    checked={userType === "partner"}
                                    onChange={() => setUserType("partner")}
                                />
                                Parceiro
                            </label>
                        </div>

                        <input 
                            type="text" 
                            placeholder="Nome Completo" 
                            value={nomeCompleto}
                            onChange={(e) => setNomeCompleto(e.target.value)} 
                            className={Styles.input} 
                            required 
                        />
                        <input 
                            type="email" 
                            placeholder="E-mail" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            className={Styles.input} 
                            required 
                        />

                        <div className={Styles.passwordContainer}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={Styles.input}
                                required
                            />
                            <span onClick={toggleShowPassword} className={Styles.passwordToggle}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <div className={Styles.passwordContainer}>
                            <input
                                type={showConfirmedPassword ? "text" : "password"}
                                placeholder="Confirme a senha"
                                value={confirmedPassword}
                                onChange={(e) => setConfirmedPassword(e.target.value)}
                                className={Styles.input}
                                required
                            />
                            <span onClick={toggleShowConfirmedPassword} className={Styles.passwordToggle}>
                                {showConfirmedPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        <button type="submit" className={Styles.btnSubmit}>Criar Conta</button>

                        <p className={Styles.loginLink}>Já possui conta? <a onClick={Voltar} href="#">Entrar</a></p>
                    </div>
                    <div className={Styles.direita}>
                        <img src={Logo7} className={Styles.logo} alt="Logo" />
                    </div>
                </div>
            </form>
        </>
    );
}

export default Register;
