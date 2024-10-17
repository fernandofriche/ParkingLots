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
import Reservas from '../Reservas/Reservas'; // Importando o componente Reservas

function Profile() {
    const [detalhesUsuario, setDetalhesUsuario] = useState(null);
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const [carros, setCarros] = useState([]);
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
    const [senhaVisivel, setSenhaVisivel] = useState({
        atual: false,
        nova: false,
        confirmar: false
    });
    const [mostrarCarros, setMostrarCarros] = useState(false);
    const [mostrarInfoUsuario, setMostrarInfoUsuario] = useState(true);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarReservas, setMostrarReservas] = useState(false); // Estado para mostrar as reservas

    const navigate = useNavigate();

    const alternarVisibilidadeSenha = (tipo) => {
        setSenhaVisivel(prev => ({
            ...prev,
            [tipo]: !prev[tipo]
        }));
    };

    const alternarMenu = () => setMostrarMenu(!mostrarMenu);
    const alternarMostrarCarros = () => {
        setMostrarCarros(!mostrarCarros);
        setMostrarInfoUsuario(false); // Oculta a exibição das informações do usuário
        setMostrarSenha(false); // Oculta a exibição da senha
        setMostrarReservas(false); // Oculta a exibição das reservas
    };

    const exibirInfoUsuario = () => {
        setMostrarInfoUsuario(true);
        setMostrarCarros(false);
        setMostrarSenha(false); // Oculta a exibição da senha
        setMostrarReservas(false); // Oculta a exibição das reservas
    };

    const exibirSenha = () => {
        setMostrarSenha(true); // Exibe as informações da senha
        setMostrarCarros(false); // Oculta a exibição dos carros
        setMostrarInfoUsuario(false); // Oculta as informações do usuário
        setMostrarReservas(false); // Oculta a exibição das reservas
    };

    const exibirReservas = () => {
        setMostrarReservas(true); // Exibe as reservas
        setMostrarCarros(false); // Oculta a exibição dos carros
        setMostrarInfoUsuario(false); // Oculta as informações do usuário
        setMostrarSenha(false); // Oculta a exibição da senha
    };

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
        buscarCarros();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            await ProfileController.updateUserProfile(nomeCompleto, email);
            toast.success('Dados atualizados com sucesso!', { position: "top-center" });
            setIsEditing(false);
            dataBaseUsuario();
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
        if (novaSenha !== confirmarNovaSenha) {
            toast.error('As novas senhas não coincidem.', { position: "top-center" });
            return;
        }

        try {
            await ProfileController.updateUserPassword(novaSenha, senhaAtual);
            toast.success('Senha atualizada com sucesso!', { position: "top-center" });
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarNovaSenha('');
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

    // Função para deletar carro
    const handleDeleteCar = async (carroId) => {
        const confirmado = window.confirm('Tem certeza que deseja deletar este carro?');
        if (confirmado) {
            try {
                await VisualizarCarsController.deleteCar(carroId); // Certifique-se de que você tenha este método no seu controlador
                toast.success('Carro deletado com sucesso!', { position: "top-center" });
                buscarCarros(); // Atualiza a lista de carros
            } catch (error) {
                console.error('Erro ao deletar carro:', error);
                toast.error('Erro ao deletar o carro. Tente novamente.', { position: "top-center" });
            }
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

                <aside className={Styles.sidebar}>
                    <ul className={Styles.menu}>
                        <li><button onClick={exibirInfoUsuario}><img src={iconProfile} /> Perfil</button></li>
                        <li><button onClick={exibirReservas}><img src={iconHistorico} /> Histórico</button></li>
                        <li><button onClick={exibirSenha}><img src={iconPassword} /> Alterar Senha</button></li>
                        <li><button onClick={alternarMostrarCarros}><img src={iconCars} /> Veículos</button></li>
                        <li><button onClick={Sair}>Sair</button></li>
                        <li><button onClick={handleDeleteAccount}>Excluir Conta</button></li>
                    </ul>
                </aside>

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
                        mostrarInfoUsuario && (
                            <div className={Styles.userInfo}>
                                <p><strong>Nome Completo: </strong>{detalhesUsuario?.nomeCompleto}</p>
                                <hr />
                                <p><strong>Email: </strong>{detalhesUsuario?.email}</p>
                                <button className={Styles.editButton} onClick={() => setIsEditing(true)}>Editar</button>
                            </div>
                        )
                    )}

                    {mostrarCarros && (
                        <div>
                            <h2>Meus Carros</h2>
                            <div className={Styles.carrosContainer}>
                                {carros.length > 0 ? (
                                    carros.map((carro) => (
                                        <div className={Styles.carroCard} key={carro.id}>
                                            <div className={Styles.carroInfo}>
                                                <p>Marca: {carro.marca}</p>
                                                <p>Modelo: {carro.modelo}</p>
                                            </div>
                                            <button onClick={() => handleDeleteCar(carro.id)}>Deletar Carro</button>
                                        </div>
                                    ))
                                ) : (
                                    <p>Nenhum carro cadastrado.</p>
                                )}
                            </div>
                        </div>
                    )}




                    {mostrarSenha && (
                        <div>
                            <h2>Alterar Senha</h2>
                            <label>
                                Senha Atual:
                                <input
                                    type={senhaVisivel.atual ? "text" : "password"}
                                    value={senhaAtual}
                                    onChange={(e) => setSenhaAtual(e.target.value)}
                                />
                                <button onClick={() => alternarVisibilidadeSenha('atual')}>
                                    {senhaVisivel.atual ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </label>
                            <label>
                                Nova Senha:
                                <input
                                    type={senhaVisivel.nova ? "text" : "password"}
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                />
                                <button onClick={() => alternarVisibilidadeSenha('nova')}>
                                    {senhaVisivel.nova ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </label>
                            <label>
                                Confirmar Nova Senha:
                                <input
                                    type={senhaVisivel.confirmar ? "text" : "password"}
                                    value={confirmarNovaSenha}
                                    onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                                />
                                <button onClick={() => alternarVisibilidadeSenha('confirmar')}>
                                    {senhaVisivel.confirmar ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </label>
                            <button onClick={AtualizarSenha}>Salvar Senha</button>
                        </div>
                    )}

                    {mostrarReservas && (
                        <div>
                            <h2>Histórico de Reservas</h2>
                            <Reservas />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Profile;
