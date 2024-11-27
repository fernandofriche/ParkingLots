import React, { useState, useEffect } from 'react';
import Styles from './Profile.module.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ProfileController from "../../BackEnd/controllers/ProfileController";
import { signOut } from 'firebase/auth';
import { auth } from '../../Services/firebaseConfig';
import LogoNew from '../../assets/Images/LogoNewVersion.png';
import CircleUser from '../../assets/Images/CircleUser.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import iconProfile from '../../assets/Images/iconProfile.png';
import iconPassword from '../../assets/Images/iconPassword.png';
import iconCars from '../../assets/Images/iconCars.png';
import iconSair from '../../assets/Images/sair.png'
import iconExcluir from '../../assets/Images/excluir.png'
import Header from "../Header/header"

function Profile() {
    const [detalhesUsuario, setDetalhesUsuario] = useState(null);
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [carros, setCarros] = useState([]);
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
    const [senhaVisivel, setSenhaVisivel] = useState({ atual: false, nova: false, confirmar: false });
    const [view, setView] = useState('perfil'); 
    const navigate = useNavigate();

    const alternarVisibilidadeSenha = (tipo) => {
        setSenhaVisivel(prev => ({
            ...prev,
            [tipo]: !prev[tipo]
        }));
    };

    function AddCar() {
        navigate('/RegisterCar');
    }

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
            const fetchedCars = await ProfileController.fetchCars();
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

    const handleLogout = async () => {
        const confirmLogout = window.confirm("Tem certeza que deseja sair?");
        if (confirmLogout) {
            await Sair();
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

    const handleDeleteCar = async (carroId) => {
        const confirmado = window.confirm('Tem certeza que deseja deletar este carro?');
        if (confirmado) {
            try {
                await ProfileController.deleteCar(carroId); 
                toast.success('Carro deletado com sucesso!', { position: "top-center" });
                buscarCarros(); 
            } catch (error) {
                console.error('Erro ao deletar carro:', error);
                toast.error('Erro ao deletar o carro. Tente novamente.', { position: "top-center" });
            }
        }
    };



    function Feedback() {
        navigate("/Feedback")
    }

   

    return (
        <>
            <ToastContainer />
            <div className={Styles.container}>
                <Header/>

                <aside className={Styles.sidebar}>
                    <ul className={Styles.menu}>
                        <li className={Styles.menuItem}>
                            <button onClick={() => setView('perfil')}>
                                <img src={iconProfile} alt="Perfil" />
                                Perfil
                            </button>
                        </li>
                        <li className={Styles.menuItem}>
                            <button onClick={() => setView('senha')}>
                                <img src={iconPassword} alt="Alterar Senha" />
                                Alterar Senha
                            </button>
                        </li>
                        <li className={Styles.menuItem}>
                            <button onClick={() => setView('carros')}>
                                <img src={iconCars} alt="Veículos" />
                                Veículos
                            </button>
                        </li>
                        <div className={Styles.btnsExcluirESair}>
                            <hr />
                            <li className={Styles.menuItem}>
                                <button onClick={handleLogout}>
                                    <img src={iconSair} alt="Sair" />
                                    Sair
                                </button>
                            </li>
                            <li className={Styles.menuItem}>
                                <button onClick={handleDeleteAccount}>
                                    <img src={iconExcluir} alt="Excluir Conta" />
                                    Excluir Conta
                                </button>
                            </li>
                        </div>
                    </ul>
                </aside>

                <h1 className={Styles.OlaUser}>Olá {nomeCompleto}</h1>
                
                <div className={Styles.mainContent}>
                    {view === 'perfil' && (
                        <>
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
                                    <label>
                                        Email:
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </label>
                                    <div>
                                        <button className={Styles.attPerfil} onClick={handleUpdateProfile}>Salvar</button>
                                        <button className={Styles.cancelButton} onClick={() => setIsEditing(false)}>Cancelar</button>
                                    </div>
                                </div>

                            ) : (
                                <div className={Styles.userInfo}>
                                    <p><strong>Nome Completo: </strong>{detalhesUsuario?.nomeCompleto}</p>
                                    <hr />
                                    <p><strong>Email: </strong>{detalhesUsuario?.email}</p>
                                    <hr />
                                </div>
                            )}
                        </>
                    )}

                    {view === 'carros' && (
                        <div>
                            <div className={Styles.addVeiculo}>
                                <h2>Meus Carros</h2>
                                <button className={Styles.addCar} onClick={AddCar}>Adicionar Veículo</button> 
                            </div>
                            <div className={Styles.carrosContainer}>
                                {carros.length > 0 ? (
                                    carros.map((carro) => (
                                        <div className={Styles.carroCard} key={carro.id}>
                                            <div className={Styles.carroInfo}>
                                                <p>Modelo: {carro.modelo}</p>
                                                <p>Placa: {carro.placa}</p>
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

                    {view === 'senha' && (
                        <div className={Styles.umTeste}>
                            <h2 className={Styles.titleSenha}>Redefinir Senha</h2>

                            <div className={Styles.RedefinirSenha}>
                                <label>
                                    <input
                                        placeholder='Senha Atual'
                                        type={senhaVisivel.atual ? "text" : "password"}
                                        value={senhaAtual}
                                        onChange={(e) => setSenhaAtual(e.target.value)}
                                    />
                                    <button className={Styles.VisuSenha} onClick={() => alternarVisibilidadeSenha('atual')}>
                                        {senhaVisivel.atual ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </label>
                                <label>
                                    <input
                                        placeholder='Nova Senha'
                                        type={senhaVisivel.nova ? "text" : "password"}
                                        value={novaSenha}
                                        onChange={(e) => setNovaSenha(e.target.value)}
                                    />
                                    <button className={Styles.VisuSenha} onClick={() => alternarVisibilidadeSenha('nova')}>
                                        {senhaVisivel.nova ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </label>
                                <label>
                                    <input
                                        placeholder='Confirme a Nova Senha'
                                        type={senhaVisivel.confirmar ? "text" : "password"}
                                        value={confirmarNovaSenha}
                                        onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                                    />
                                    <button className={Styles.VisuSenha} onClick={() => alternarVisibilidadeSenha('confirmar')}>
                                        {senhaVisivel.confirmar ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </label>
                            </div>
                            <div className={Styles.btnAjuste}>
                                <button onClick={AtualizarSenha} className={Styles.btnRedefinirSenha}>Redefinir Senha</button>
                            </div>
                            
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Profile;
