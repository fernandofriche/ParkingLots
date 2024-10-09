import React, { useState, useEffect } from 'react';
import Styles from './Profile.module.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ProfileController from "../../BackEnd/controllers/ProfileController";
import VisualizarCarsController from "../../BackEnd/VisualizarCars";
import { signOut } from 'firebase/auth';
import { auth } from '../../Services/firebaseConfig';
import LogoNew from '../../assets/Images/LogoNewVersion.png';
import CircleUser from '../../assets/Images/CircleUser.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import iconProfile from '../../assets/Images/iconProfile.png';
import iconHistorico from '../../assets/Images/iconHistorico.png';
import iconPassword from '../../assets/Images/iconPassword.png';
import iconCars from '../../assets/Images/iconCars.png';

function Profile() {
    const [detalhesUsuario, setDetalhesUsuario] = useState(null);
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false); // Para o modo de edição
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const [mostrarModalVeiculos, setMostrarModalVeiculos] = useState(false); // Para o modal de veículos
    const [carros, setCarros] = useState([]); // Estado para armazenar os carros registrados
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [senhaAtualVisivel, setSenhaAtualVisivel] = useState(false);

    const navigate = useNavigate();

    // Função para alternar a visibilidade do menu de alterar senha
    const alternarVisibilidadeSenha = () => setSenhaVisivel(!senhaVisivel);
    const alternarVisibilidadeSenhaAtual = () => setSenhaAtualVisivel(!senhaAtualVisivel);
    const alternarMenu = () => setMostrarMenu(!mostrarMenu);

    // Função para alternar a visibilidade do modal de veículos
    const alternarModalVeiculos = () => setMostrarModalVeiculos(!mostrarModalVeiculos);

    const dataBaseUsuario = async () => {
        try {
            const usuario = await ProfileController.getUserProfile();
            setDetalhesUsuario(usuario);
            setNomeCompleto(usuario.nomeCompleto);
            setEmail(usuario.email);
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
            toast.error('Erro ao carregar os dados do usuário.', { position: "top-center" });
        }
    };

    const buscarCarros = async () => {
        try {
            const fetchedCars = await VisualizarCarsController.fetchCars();
            setCarros(fetchedCars);
        } catch (error) {
            console.error("Erro ao buscar os carros: ", error);
            toast.error('Erro ao carregar os veículos registrados.', { position: "top-center" });
        }
    };

    useEffect(() => {
        dataBaseUsuario();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            await ProfileController.updateUserProfile(nomeCompleto, email);
            toast.success('Dados atualizados com sucesso!', { position: "top-center" });
            setIsEditing(false); // Fechar o modo de edição
            dataBaseUsuario(); // Atualizar os dados
        } catch (error) {
            console.error('Erro ao atualizar os dados do perfil:', error);
            toast.error('Erro ao atualizar os dados. Tente novamente.', { position: "top-center" });
        }
    };

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

            <div className={Styles.container}>
                <header className={Styles.Cabecalho}>
                    <div className={Styles.DivLista}>
                        <ul>
                            <li><a href=""><img src={LogoNew} alt="" /></a></li>
                            <li><a href="#estacionamentos" onClick={() => navigate('/HomePage')}>Estacionamentos</a></li>
                            <li><a href="#reservas">Reservas</a></li>
                            <li><a href="#seu-carro">Seu Carro</a></li>
                            <li><a href="#parceiros">Como funciona</a></li>
                            <li>
                                <a href="#usuario" onClick={Profile}>
                                    <img src={CircleUser} alt="User" className={Styles.UserIcon} />
                                </a>
                            </li>
                        </ul>
                    </div>
                </header>

                {/* Menu lateral */}
                <aside className={Styles.sidebar}>
                    <ul className={Styles.menu}>
                        <li><button onClick={() => navigate('/Profile')}><img src={iconProfile}/> Perfil</button></li>
                        <li><button><img src={iconHistorico}/> Histórico</button></li>
                        <li><button onClick={alternarMenu}><img src={iconPassword}/>Alterar Senha</button></li>
                        <li><button onClick={async () => { alternarModalVeiculos(); await buscarCarros(); }}><img src={iconCars}/>Veículos</button></li>
                        <li><button onClick={Sair}>Sair</button></li>
                        <li><button onClick={handleDeleteAccount}>Excluir Conta</button></li>
                    </ul>
                </aside>

                {/* Conteúdo principal */}
                <div className={Styles.mainContent}>
                    <h2>Informações de Cadastro</h2>
                    {isEditing ? (
                        <div className={Styles.userInfo}>
                            <label>
                                Nome Completo:
                                <input 
                                    type="text"
                                    value={nomeCompleto}
                                    onChange={(e) => setNomeCompleto(e.target.value)}
                                />
                            </label>
                            <hr />
                            <label>
                                Email:
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </label>
                            <hr />
                            <button className={Styles.attPerfil} onClick={handleUpdateProfile}>Salvar</button>
                            <button className={Styles.cancelButton} onClick={() => setIsEditing(false)}>Cancelar</button>
                        </div>
                    ) : (
                        <div className={Styles.userInfo}>
                            <p><strong>Nome Completo: </strong>{detalhesUsuario?.nomeCompleto}</p>
                            <hr />
                            <p><strong>Email: </strong>{detalhesUsuario?.email}</p>
                            <hr />
                            <button className={Styles.attPerfil} onClick={() => setIsEditing(true)}>Atualizar Perfil</button>
                        </div>
                    )}
                </div>

                {/* Modal de Veículos */}
                {mostrarModalVeiculos && (
                    <div className={Styles.modalBackground}>
                        <div className={Styles.modalContainer}>
                            <h3>Seus Veículos Registrados</h3>
                            {carros.length > 0 ? (
                                carros.map((carro, index) => (
                                    <div key={index} className={Styles.carroItem}>
                                        <p><strong>Modelo: </strong>{carro.modelo}</p>
                                        <p><strong>Placa: </strong>{carro.placa}</p>
                                        <hr />
                                    </div>
                                ))
                            ) : (
                                <p>Você não possui veículos registrados.</p>
                            )}
                            <button className={Styles.closeButton} onClick={alternarModalVeiculos}>Fechar</button>
                        </div>
                    </div>
                )}

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
                                />
                                <button onClick={alternarVisibilidadeSenhaAtual}>
                                    {senhaAtualVisivel ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <div className={Styles.passwordContainer}>
                                <input
                                    type={senhaVisivel ? 'text' : 'password'}
                                    placeholder="Nova Senha"
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                />
                                <button onClick={alternarVisibilidadeSenha}>
                                    {senhaVisivel ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <button onClick={AtualizarSenha} className={Styles.attPerfil}>Atualizar Senha</button>
                            <button onClick={alternarMenu} className={Styles.cancelButton}>Cancelar</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Profile;
