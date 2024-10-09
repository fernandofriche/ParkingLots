import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../../Services/firebaseConfig";
import Styles from './Detalhes.module.css';
import LogoNew from '../../assets/Images/LogoNewVersion.png';
import CircleUser from '../../assets/Images/CircleUser.png';
import InputMask from 'react-input-mask';
import { FaRegCreditCard, FaUser, FaCalendarAlt } from 'react-icons/fa';



function Detalhes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = auth.currentUser;
    const [currentStep, setCurrentStep] = useState(1); // Track the step in the payment process //new
    const [parkingLot, setParkingLot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState(""); //new
    const [paymentMethod, setPaymentMethod] = useState(""); //new
    const [cardNumber, setCardNumber] = useState(""); //new
    const [cardHolder, setCardHolder] = useState(""); //new
    const [expiryDate, setExpiryDate] = useState(""); //new
    const [cvv, setCvv] = useState(""); //new
    const [isPurchaseConfirmed, setIsPurchaseConfirmed] = useState(false); //new
    const [cidade, setCidade] = useState("");
    const [telefone, setTelefone] = useState("");
    const [cpf, setCpf] = useState("");
    const [modelo, setModelo] = useState("");
    const [placa, setPlaca] = useState("");
    const [placaValida, setPlacaValida] = useState(true);
    const [entrada, setEntrada] = useState("");
    const [saida, setSaida] = useState("");
    const [isMercosul, setIsMercosul] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isValid, setIsValid] = useState(true);


    useEffect(() => {
        fetch('/parkinglots.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha ao buscar os dados.');
                }
                return response.json();
            })
            .then(data => {
                const selectedLot = data.parkingLots.find(lot => lot.id === parseInt(id));
                setParkingLot(selectedLot);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);


    const handleCpfChange = (e) => {
        const value = e.target.value;
        setCpf(value);

        // Remove os caracteres não numéricos para validação
        const cpfNumbersOnly = value.replace(/\D/g, '');

        // Verifica se o nono dígito é 6 (pertence a MG)
        if (cpfNumbersOnly.length === 11 && cpfNumbersOnly[8] !== '6') {
            setIsValid(false);
        } else {
            setIsValid(true);
        }
    };

    const handlePlacaChange = (e) => {
        const placaInput = e.target.value.toUpperCase();
        setPlaca(placaInput);

        // Verificar se a placa tem exatamente 7 caracteres
        if (placaInput.length === 7) {
            setPlacaValida(true);
        } else {
            setPlacaValida(false);
        }
    };

    const formatarDataHora = (data) => {
        const date = new Date(data);
        const horas = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Formato hh:mm
        const dataFormatada = date.toLocaleDateString('pt-BR'); // Formato dd/mm/aaaa
        return `${horas} ${dataFormatada}`;
    };
    

    const validarStep1 = () => {
        if (!nome || !telefone || !cpf) {
            alert("Preencha todos os dados pessoais para continuar.");
            return false;
        }
    
        if (!isValid) {
            alert("O CPF deve ser de Minas Gerais.");
            return false; 
        }
        return true;
    };
    
    const validarStep2 = () => {
        // Verifique se a placa é válida
        if (placa.length !== 7) {
            alert("A placa deve ter exatamente 7 caracteres.");
            return false; // impede de prosseguir se a placa não for válida
        }

        // Adicione outras validações que você precisa aqui

        return true; // Se todas as validações passarem
    };

    const validarStep3 = () => {
        if (!entrada || !saida) {
            alert("Preencha os horários de entrada e saída para continuar.");
            return false;
        }
        return true;
    };

    const validarStep4 = () => {
        if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
            alert("Preencha todos os dados do pagamento para continuar.");
            return false;
        }
        return true;
    };



    // Atualiza Barra de Progresso
    const progressBarWidth = () => {
        switch (currentStep) {
            case 1:
                return "0%"; // Informações pessoais
            case 2:
                return "25%"; // Informações do veículo
            case 3:
                return "50%"; // Detalhes da reserva
            case 4:
                return "75%"; // Detalhe de Pagamento
            case 5:
                return "100%"; // Confirmação de Reserva
            default:
                return "0%";
        }
    };

    const handleNextStep = () => {
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };


    const confirmPurchase = () => {
        setShowModal(true);
    };


    const calcularValorTotal = (entrada, saida, hourlyRate) => {
        if (!entrada || !saida) return 0;

        const horaEntrada = new Date(entrada);
        const horaSaida = new Date(saida);

        if (horaSaida <= horaEntrada) {
            horaSaida.setDate(horaSaida.getDate() + 1);
        }

        const diferencaHoras = (horaSaida - horaEntrada) / (1000 * 60 * 60);

        return diferencaHoras * hourlyRate;
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        if (!currentUser) {
            setError("Você precisa estar logado para fazer uma reserva.");
            return;
        }

        if (!entrada || !saida || !placa) {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        // Exibir o modal de confirmação antes de prosseguir
        setShowModal(true);
    };

    const ConfirmarReserva = async () => {
        const valorTotal = calcularValorTotal(entrada, saida, parkingLot.hourlyRate);

        const reserva = {
            id: Date.now(),
            placa,
            local: parkingLot.name,
            entrada: new Date(entrada).toISOString(),
            saida: new Date(saida).toISOString(),
            valorTotal
        };

        try {
            const userRef = doc(db, "Users", currentUser.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                await updateDoc(userRef, {
                    reservas: arrayUnion(reserva)
                });
            } else {
                await setDoc(userRef, {
                    reservas: [reserva]
                });
            }

            navigate('/reservas');
        } catch (error) {
            console.error("Erro ao salvar a reserva: ", error);
            setError("Erro ao salvar a reserva. Tente novamente.");
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const validateExpiryDate = (date) => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear() % 100;
    
        const [enteredMonth, enteredYear] = date.split('/').map(Number);
    
        // Verifique se o mês está acima de 12
        if (enteredMonth < 1 || enteredMonth > 12) {
            setError('Mês inválido.');
            return; // Saia da função se o mês for inválido
        }
    
        if (enteredYear < currentYear) {
            setError('Ano inválido.');
        } else if (enteredYear === currentYear && enteredMonth < currentMonth) {
            setError('Mês inválido.');
        } else {
            setError(null);
        }
    };
    
    const handleExpiryDateChange = (e) => {
        const newValue = e.target.value;
        setExpiryDate(newValue);
    
        if (newValue.length === 5) {
            validateExpiryDate(newValue);
        }
    };
    
    return (
        <div>
            <header className={Styles.Cabecalho}>
                <div className={Styles.DivLista}>
                    <ul>
                        <li>
                            <a onClick={() => navigate('/HomePage')}>
                                <img className={Styles.Logo} src={LogoNew} alt="Logo" />
                            </a>
                        </li>
                        <li><a onClick={() => navigate('/HomePage')}>Estacionamentos</a></li>
                        <li><a onClick={() => navigate('/Reservas')}>Reservas</a></li>
                        <li><a onClick={() => navigate('/RegisterCar')}>Seu Carro</a></li>
                        <li><a href="#parceiros">Como Funciona</a></li>
                        <li>
                            <a href="#usuario">
                                <img src={CircleUser} alt="User" className={Styles.UserIcon} />
                            </a>
                        </li>
                    </ul>
                </div>
            </header>

            <main className={Styles.DetalhesMainContent}>
                {loading && <p>Carregando detalhes...</p>}
                {error && <p>Error: {error}</p>}

                {parkingLot && (
                    <div className={Styles.DetalhesContainer}>
                        <h2>{parkingLot.name}</h2>
                        <p>{parkingLot.description}</p>
                        <hr />
                        <p>Valor da hora: R$ {parkingLot.hourlyRate.toFixed(2)}</p>

                        <form className={Styles.Form} onSubmit={handleSubmit}></form>

                        {/* Informações Pessoais */}

                        <div className={Styles.ProgressBarContainer}>
                            <div className={Styles.ProgressBar} style={{ width: progressBarWidth() }}></div>
                        </div>

                        {currentStep === 1 && (
                            <fieldset className={Styles.Fieldset}>
                                <legend>1. Informações Pessoais</legend>
                                <div className={Styles.InputGroup}>
                                    <label htmlFor="nome">Nome Completo:</label>
                                    <input
                                        type="text"
                                        id="nome"
                                        name="nome"
                                        required
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                    />
                                </div>

                                <div className={Styles.InputGroupHorizontal}>
                                    <div>
                                        <label htmlFor="telefone">Telefone:</label>
                                        <InputMask
                                            mask="(99) 99999-9999"
                                            id="telefone"
                                            name="telefone"
                                            required
                                            value={telefone}
                                            onChange={(e) => setTelefone(e.target.value)}
                                        >
                                            {(inputProps) => <input {...inputProps} />}
                                        </InputMask>
                                    </div>
                                    <div>
                                        <label htmlFor="cpf">CPF:</label>
                                        <InputMask
                                            mask="999.999.999-99"
                                            id="cpf"
                                            name="cpf"
                                            required
                                            value={cpf}
                                            onChange={handleCpfChange}
                                        >
                                            {(inputProps) => (
                                                <input
                                                    {...inputProps}
                                                    className={isValid ? '' : 'input-error'} // Adiciona uma classe de erro se CPF for inválido
                                                />
                                            )}
                                        </InputMask>
                                        {!isValid && <span className="error-text">CPF deve ser de Minas Gerais</span>}
                                    </div>
                                </div>
                                <button type="button" className={Styles.ButtonDetalhes} onClick={() => { if (validarStep1()) handleNextStep(); }}>Prosseguir</button>
                            </fieldset>
                        )}

                        {currentStep === 2 && (
                            <fieldset className={Styles.Fieldset}>
                                <legend>2. Informações do Veículo</legend>
                                <div className={Styles.InputGroupHorizontal}>
                                    <div>
                                        <label htmlFor="modelo">Modelo e Marca do Veículo:</label>
                                        <input
                                            type="text"
                                            id="modelo"
                                            name="modelo"
                                            required
                                            value={modelo}
                                            onChange={(e) => setModelo(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="placa">Placa do Veículo:</label>
                                        <input
                                            type="text"
                                            id="placa"
                                            name="placa"
                                            required
                                            maxLength={7}
                                            value={placa}
                                            onChange={handlePlacaChange}
                                        />

                                    </div>
                                </div>
                               
                                <button type="button" className={Styles.ButtonDetalhes} onClick={handlePreviousStep}>Voltar</button>
                                <button type="button" className={Styles.ButtonDetalhes} onClick={() => { if (validarStep2()) handleNextStep(); }}>
                                    Prosseguir
                                </button>
                            </fieldset>
                        )}

                        {currentStep === 3 && (
                            <fieldset className={Styles.Fieldset}>
                                <legend>3. Informações da Reserva</legend>
                                <div className={Styles.InputGroupHorizontal}>
                                    <div>
                                        <label htmlFor="entrada">Entrada:</label>
                                        <input
                                            type="datetime-local"
                                            id="entrada"
                                            name="entrada"
                                            required
                                            value={entrada}
                                            min={new Date().toISOString().slice(0, 16)}
                                            onChange={(e) => {
                                                setEntrada(e.target.value);
                                                setSaida('');
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="saida">Saída:</label>
                                        <input
                                            type="datetime-local"
                                            id="saida"
                                            name="saida"
                                            required
                                            value={saida}
                                            min={entrada || new Date().toISOString().slice(0, 16)}
                                            onChange={(e) => {
                                                const saidaValue = e.target.value;
                                                if (new Date(saidaValue) <= new Date(entrada)) {
                                                    alert('O horário de saída deve ser maior que o horário de entrada!');
                                                    e.target.value = '';
                                                } else {
                                                    setSaida(saidaValue);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {entrada && saida && (
                                    <p>Valor Total: R$ {calcularValorTotal(
                                        entrada,
                                        saida,
                                        parkingLot.hourlyRate
                                    ).toFixed(2)}</p>
                                )}

                                <button type="button" className={Styles.ButtonDetalhes} onClick={handlePreviousStep}>Voltar</button>
                                <button type="button" className={Styles.ButtonDetalhes} onClick={() => { if (validarStep3()) handleNextStep(); }}>Prosseguir</button>
                            </fieldset>
                        )}

                        {currentStep === 4 && (
                            <fieldset className={Styles.Fieldset}>
                                <legend>4. Detalhes do Pagamento</legend>
                                <div className={Styles.InputGroupHorizontalDois}>
                                    <label htmlFor="cardHolder">Titular do Cartão:</label>
                                    <input
                                        className={Styles.InputDetalhesDois}
                                        type="text"
                                        id="cardHolder"
                                        value={cardHolder}
                                        onChange={(e) => setCardHolder(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className={Styles.InputGroupHorizontalDois}>
                                    <label htmlFor="cardNumber">Número do Cartão:</label>
                                    <InputMask
                                        mask="9999 9999 9999 9999"
                                        id="cardNumber"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        required
                                    >
                                        {(inputProps) => <input {...inputProps} />}
                                    </InputMask>
                                </div>

                                <div className={Styles.InputGroupHorizontalDoisD}>
                                    <div className={Styles.ValidadeCvvContainer}>
                                        <div>
                                            <label htmlFor="expiryDate">Validade:</label>
                                            <InputMask
                                                mask="99/99"
                                                id="expiryDate"
                                                value={expiryDate}
                                                onChange={handleExpiryDateChange}
                                                required
                                            >
                                                {(inputProps) => <input {...inputProps} />}
                                            </InputMask>
                                            {error && <span style={{ color: 'red' }}>{error}</span>}
                                        </div>

                                        <div>
                                            <label htmlFor="cvv">CVV:</label>
                                            <InputMask
                                                mask="999"
                                                id="cvv"
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value)}
                                                required
                                            >
                                                {(inputProps) => <input {...inputProps} />}
                                            </InputMask>
                                        </div>
                                    </div>
                                </div>


                                <div className={Styles.CardPreview}>
                                    <div className={Styles.Card}>
                                        <div className={Styles.CardIcon}><FaRegCreditCard /></div>
                                        <div className={Styles.CardNumber}>{cardNumber || "•••• •••• •••• ••••"}</div>
                                        <div className={Styles.CardDetails}>
                                            <div className={Styles.CardHolder}>
                                                <FaUser /> {cardHolder || "Nome do Titular"}
                                            </div>
                                            <div className={Styles.CardExpiry}>
                                                <FaCalendarAlt /> {expiryDate || "MM/AA"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {entrada && saida && (
                                    <p>Valor Total da Reserva: R$ {calcularValorTotal(entrada, saida, parkingLot.hourlyRate).toFixed(2)}</p>
                                )}

                                <button type="button" className={Styles.ButtonDetalhes} onClick={handlePreviousStep}>Voltar</button>
                                <button type="button" className={Styles.ButtonDetalhes} onClick={() => { if (validarStep4()) handleNextStep(); }}>Prosseguir</button>
                            </fieldset>
                        )}

                        {currentStep === 5 && (
                            <fieldset>
                            <div className={Styles.Form}>
                                <legend>5. Confirmação de Reserva</legend>
                                {isPurchaseConfirmed ? (
                                    <div className={Styles.Confirmation}>
                                        <div className={Styles.CheckIcon}></div>
                                        <p>Reserva Confirmada!</p>
                                    </div>
                                ) : (
                                    <div>
                                        <label>Revise sua reserva antes de confirmar.</label>
                                        <br />
                                        <button type="button" className={Styles.ButtonDetalhes} onClick={handlePreviousStep}>Voltar</button>
                                        <button type="button" className={Styles.ButtonDetalhes} onClick={confirmPurchase}>Revisar Reserva</button>
                                    </div>
                                )}
                            </div>
                            </fieldset>
                        )}
                    </div>
                )}
            </main>

            {/* Modal de confirmação */}
            {showModal && (
    <div className={Styles.ModalConfirma}>
        <div className={Styles.ModalContent}>
            <h2>Atenção!</h2>
            <p className={Styles.Aviso}>Revise as informações inseridas! Após a confirmação, os dados não poderão ser alterados.</p>

            {/* Container das informações */}
            <div className={Styles.InfoContainer}>
                <div className={Styles.InfoRow}>
                    <span className={Styles.Label}>Nome:</span>
                    <span className={Styles.Value}>{nome}</span>
                </div>
                <div className={Styles.InfoRow}>
                    <span className={Styles.Label}>Telefone:</span>
                    <span className={Styles.Value}>{telefone}</span>
                </div>
                <div className={Styles.InfoRow}>
                    <span className={Styles.Label}>Placa do Veículo:</span>
                    <span className={Styles.Value}>{placa}</span>
                </div>
                <div className={Styles.InfoRow}>
                    <span className={Styles.Label}>Entrada:</span>
                    <span className={Styles.Value}>{formatarDataHora(entrada)}</span>
                </div>
                <div className={Styles.InfoRow}>
                    <span className={Styles.Label}>Saída:</span>
                    <span className={Styles.Value}>{formatarDataHora(saida)}</span>
                </div>
                <div className={Styles.InfoRow}>
                    <span className={Styles.Label}>Valor Total:</span>
                    <span className={Styles.Value}>R$ {calcularValorTotal(entrada, saida, parkingLot.hourlyRate).toFixed(2)}</span>
                </div>
            </div>

            {/* Botões de confirmação */}
            <div className={Styles.ModalButtons}>
                <button onClick={ConfirmarReserva}>Confirmar</button>
                <button onClick={closeModal}>Cancelar</button>
            </div>
        </div>
    </div>
)}

        </div>
    );
}

export default Detalhes;