import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash, FaArrowCircleLeft } from 'react-icons/fa';
import Styles from './Register.module.css';
import RegisterController from "../../BackEnd/controllers/RegisterController "
import 'react-toastify/dist/ReactToastify.css';
import Logo7 from '../../assets/Images/Logo7.svg';

function Register() {
    const navigate = useNavigate();
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmedPassword = () => {
        setShowConfirmedPassword(!showConfirmedPassword);
    };

    const Voltar = () => {
        navigate('/');
    };

    const RealizarRegistro = async (e) => {
        e.preventDefault();

        if (password !== confirmedPassword) {
            toast.error("As senhas não coincidem", { position: "top-center" });
        } else {
            const result = await RegisterController.handleRegister(nomeCompleto, email, password);
            if (result.success) {
                toast.success(result.message, { position: "top-center" });
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                toast.error(result.message, { position: "top-center" });
            }
        }
    };

    return (
        <>
            <ToastContainer />
            <form onSubmit={RealizarRegistro}>
                <div className={Styles.container}>
                    <div className={Styles.esquerda}>
                        <button className={Styles.btnVoltar} onClick={Voltar}>
                            <FaArrowCircleLeft size={24} />Voltar
                        </button>
                        <h1>Cadastro de Usuário</h1>
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
                        
                        <div className={Styles.PasswordContainer}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={Styles.input}
                                required
                            />
                            <span onClick={toggleShowPassword} className={Styles.PasswordToggle}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <div className={Styles.PasswordContainer}>
                            <input
                                type={showConfirmedPassword ? "text" : "password"}
                                placeholder="Confirme a senha"
                                value={confirmedPassword}
                                onChange={(e) => setConfirmedPassword(e.target.value)}
                                className={Styles.input}
                                required
                            />
                            <span onClick={toggleShowConfirmedPassword} className={Styles.PasswordToggle}>
                                {showConfirmedPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        <button onClick={RealizarRegistro} className={Styles.BtnEntrar}>Criar Conta</button>
                        <p className={Styles.possuiConta}>Já possui conta?<a onClick={Voltar} href="">Entrar</a></p>
                    </div>
                    <div className={Styles.direita}>
                        <img src={Logo7} className={Styles.logo} />
                    </div>
                </div>
            </form>
        </>
    );
}

export default Register;
