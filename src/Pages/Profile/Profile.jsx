import React, { useState, useEffect } from 'react';
import Styles from './Profile.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ProfileController from "../../BackEnd/controllers/ProfileController";
import { signOut } from 'firebase/auth';
import { auth } from '../../Services/firebaseConfig';
import LogoNew from '../../assets/Images/LogoNewVersion.png';
import CircleUser from '../../assets/Images/CircleUser.png';

function Profile() {
    const [detalhesUsuario, setDetalhesUsuario] = useState(null);
    const [novaSenha, setNovaSenha] = useState('');
    const [senhaAtual, setSenhaAtual] = useState('');
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [senhaAtualVisivel, setSenhaAtualVisivel] = useState(false);
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const navigate = useNavigate();

    const alternarVisibilidadeSenha = () => setSenhaVisivel(!senhaVisivel);
    const alternarVisibilidadeSenhaAtual = () => setSenhaAtualVisivel(!senhaAtualVisivel);
    const alternarMenu = () => setMostrarMenu(!mostrarMenu);

    const dataBaseUsuario = async () => {
        try {
            const usuario = await ProfileController.getUserProfile();
            setDetalhesUsuario(usuario);
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
            toast.error('Erro ao carregar os dados do usuário.', { position: "top-center" });
        }
    };

    useEffect(() => {
        dataBaseUsuario();
    }, []);

    const handleDeleteAccount = async () => {
        const confirmado = window.confirm('Você tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.');
        if (confirmado) {
            try {
                await ProfileController.deleteUserProfile();
                toast.success('Conta deletada com sucesso!', { position: "top-center" });
                navigate('/');
            } catch (error) {
                console.error('Erro ao deletar conta: ', error);
                toast.error('Erro ao deletar a conta. Tente novamente.', { position: "top-center" });
            }
        }
    };

    const AtualizarSenha = async () => {
        try {
            await ProfileController.updateUserPassword(novaSenha, senhaAtual);
            toast.success('Senha atualizada com sucesso!', { position: "top-center" });
        } catch (error) {
            console.error('Erro ao atualizar a senha:', error);
            toast.error(error.message, { position: "top-center" });
        }
    };

    const Sair = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Erro ao fazer logout: ", error);
        }
    };

    return (
        <>
            <ToastContainer />
            <div>
                <header className={Styles.Cabecalho}>
                    <div className={Styles.DivLista}>
                        <ul>
                            <li>
                                <a href="/HomePage">
                                    <img className={Styles.Logo} src={LogoNew} alt="Logo" />
                                </a>
                            </li>
                            <li><a href="#estacionamentos">Estacionamentos</a></li>
                            <li><a href="#reservas" onClick={() => navigate('/Reservas')}>Reservas</a></li>
                            <li><a href="#seu-carro" onClick={() => navigate('/RegisterCar')}>Seu Carro</a></li>
                            <li><a href="#parceiros">Como funciona</a></li>
                            <li>
                                <a href="#usuario" onClick={() => navigate('/Profile')}>
                                    <img src={CircleUser} alt="User" className={Styles.UserIcon} />
                                </a>
                            </li>
                        </ul>
                    </div>
                </header>

                <div className={Styles.nome}>
                    {detalhesUsuario ? (
                        <h3>Olá {detalhesUsuario.nomeCompleto}</h3>
                    ) : (
                        <p>Carregando...</p>
                    )}
                </div>

                <div className={Styles.nome}>
                    {detalhesUsuario ? (
                        <h3>Email: {detalhesUsuario.email}</h3>
                    ) : (
                        <p />
                    )}
                </div>

                <button className={Styles.openModalButton} onClick={alternarMenu}>
                    Editar dados
                </button>
                <button onClick={handleDeleteAccount}>Deletar</button>
                <button onClick={() => navigate('/HomePage')}>Home Page</button>
                <button onClick={() => navigate('/LandingPage')}>LandingPage</button>
                <button onClick={() => navigate('/Feedback')}>Feedback</button>
                <button onClick={Sair}>Sair</button>

                {mostrarMenu && (
                    <div className={Styles.modalBackground}>
                        <div className={Styles.updatePasswordContainer}>
                            <h3>Atualizar Senha</h3>
                            <div className={Styles.passwordContainer}>
                                <input
                                    type={senhaAtualVisivel ? 'text' : 'password'}
                                    placeholder="Senha Atual"
                                    value={senhaAtual}
                                    onChange={(e) => setSenhaAtual(e.target.value)}
                                    className={Styles.passwordInput}
                                    autoComplete="current-password"
                                />
                                <span className={Styles.passwordIcon} onClick={alternarVisibilidadeSenhaAtual}>
                                    {senhaAtualVisivel ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <div className={Styles.passwordContainer}>
                                <input
                                    type={senhaVisivel ? 'text' : 'password'}
                                    placeholder="Nova Senha"
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                    className={Styles.passwordInput}
                                    autoComplete="new-password"
                                />
                                <span className={Styles.passwordIcon} onClick={alternarVisibilidadeSenha}>
                                    {senhaVisivel ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <div>
                                <button className={Styles.attButton} onClick={AtualizarSenha}> Confirmar</button>
                                <button className={Styles.cancelButton} onClick={alternarMenu}>Voltar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Profile;
