import React, { useState, useEffect } from "react";
import Styles from './Login.module.css';
import Logo7 from '../../assets/Images/Logo7.svg';
import logoGoogle from '../../assets/Images/logoGoogle.png';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginController from "../../BackEnd/controllers/LoginController";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.successMessage) {
            toast.success(location.state.successMessage, { position: "top-center" });
        }
    }, [location.state]);

    const RealizarLogin = async (e) => {
        e.preventDefault();
        const result = await LoginController.handleLogin(email, password);

        if (result.success) {
            toast.success("Login realizado com sucesso!", { position: "top-center" });
            if (result.role === "partner") {
                navigate("/Parceiros"); 
            } else {
                navigate("/profile"); 
            }
        } else {
            toast.error(result.message, { position: "top-center" });
        }
    };

    const RealizarLoginGoogle = async (e) => {
        e.preventDefault();
        const result = await LoginController.handleLoginWithGoogle();

        if (result.success) {
            toast.success(result.message, { position: "top-center" });
            if (result.role === "partner") {
                navigate("/Parceiros");
            } else {
                navigate("/profile");
            }
        } else {
            toast.error(result.message, { position: "top-center" });
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <ToastContainer />
            <form className={Styles.container} onSubmit={RealizarLogin}>
                <div className={Styles.tudo}>
                    <div className={Styles.esquerda}>
                        <div className={Styles.DivInputs}>
                            <h1>Acesse sua conta</h1>
                            <div className={Styles.DivGoogle}>
                                <button
                                    type="button"
                                    className={Styles.BtnGoogle}
                                    onClick={RealizarLoginGoogle}
                                >
                                    <img src={logoGoogle} alt="Google logo" /> Entrar com Google
                                </button>
                            </div>
                            <div className={Styles.separador}>
                                <hr className={Styles.line} />
                                <span className={Styles.teste2}>OU</span>
                                <hr className={Styles.line} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="E-mail *"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                            <div className={Styles.PasswordContainer}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Senha *"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                <span onClick={toggleShowPassword} className={Styles.PasswordToggle}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <a href="" className={Styles.esqueceuSenha} onClick={() => navigate('/ResetPassword')}>
                                Esqueceu a senha?
                            </a>
                            <button type="submit" className={Styles.BtnEntrar}>Entrar</button>
                            <p className={Styles.Registrar}>
                                Ainda não possui uma conta? <a onClick={() => navigate('/Register')} className={Styles.linkRegistrar}>Registrar</a>
                            </p>
                        </div>
                    </div>

                    <div className={Styles.direita}>
                        <div className={Styles.logo}>
                            <img src={Logo7} alt="Logo" />
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default Login;
