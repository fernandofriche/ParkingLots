import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../../Services/firebaseConfig";
import Styles from './Detalhes.module.css';
import LogoNew from '../../assets/Images/LogoNewVersion.png';
import CircleUser from '../../assets/Images/CircleUser.png';
import InputMask from 'react-input-mask';


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


    const validarStep1 = () => {
        if (!nome || !telefone || !cpf) {
            alert("Preencha todos os dados pessoais para continuar.");
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
        if (!paymentMethod || !cardNumber || !cardHolder || !expiryDate || !cvv) {
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
        setIsPurchaseConfirmed(true);
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
        // Obter o mês e o ano atuais
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Mês atual (0-indexado)
        const currentYear = currentDate.getFullYear() % 100; // Dois últimos dígitos do ano

        // Separar o mês e o ano da data de validade inserida
        const [enteredMonth, enteredYear] = date.split('/').map(Number);

        // Verificações
        if (enteredYear < currentYear) {
            setError('Ano inválido.');
        } else if (enteredYear === currentYear && enteredMonth < currentMonth) {
            setError('Mês inválido.');
        } else {
            setError(null); // Data válida
        }
    };

    const handleExpiryDateChange = (e) => {
        const newValue = e.target.value;
        setExpiryDate(newValue);

        // Só validar quando o input estiver completo (4 caracteres: MM/YY)
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
                                        value={nome} // Mantém o valor inserido
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
                                            value={telefone} // Mantém o valor inserido
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
                                            value={cpf} // Mantém o valor inserido
                                            onChange={(e) => setCpf(e.target.value)}
                                        >
                                            {(inputProps) => <input {...inputProps} />}
                                        </InputMask>
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
                                        <label htmlFor="modelo">Modelo do Veículo:</label>
                                        <input
                                            type="text"
                                            id="modelo"
                                            name="modelo"
                                            required
                                            value={modelo} // Mantém o valor inserido
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
                                <div className={Styles.CheckboxGroup}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={isMercosul} // Mantém o valor inserido
                                            onChange={(e) => setIsMercosul(e.target.checked)}
                                        />
                                        Placa MERCOSUL
                                    </label>
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
                                            value={entrada} // Mantém o valor inserido
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
                                            value={saida} // Mantém o valor inserido
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
                                <div>
                                    <label>
                                        <input
                                            className={Styles.InputDetalhes}
                                            type="radio"
                                            name="paymentMethod"
                                            value="credit"
                                            checked={paymentMethod === "credit"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        Cartão de Crédito
                                    </label>
                                    <label>
                                        <input
                                            className={Styles.InputDetalhes}
                                            type="radio"
                                            name="paymentMethod"
                                            value="debit"
                                            checked={paymentMethod === "debit"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        Cartão de Débito
                                    </label>
                                </div>

                                <div className={Styles.InputGroupHorizontal}>
                                    <label htmlFor="cardHolder">Titular do Cartão:</label>
                                    <input
                                        className={Styles.InputDetalhes}
                                        type="text"
                                        id="cardHolder"
                                        value={cardHolder} // Salvar o valor
                                        onChange={(e) => setCardHolder(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className={Styles.InputGroupHorizontal}>
                                    <label htmlFor="cardNumber">Número do Cartão:</label>
                                    <InputMask
                                        mask="9999 9999 9999 9999"
                                        id="cardNumber"
                                        value={cardNumber} // Salvar o valor
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        required
                                    >
                                        {(inputProps) => <input {...inputProps} />}
                                    </InputMask>
                                </div>

                                <div className={Styles.InputGroupHorizontal}>
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
                                            value={cvv} // Salvar o valor
                                            onChange={(e) => setCvv(e.target.value)}
                                            required
                                        >
                                            {(inputProps) => <input {...inputProps} />}
                                        </InputMask>
                                    </div>
                                </div>

                                <div className={Styles.CardPreview}>
                                    {/* Real-time preview of card details */}
                                    <div className={Styles.Card}>
                                        <div className={Styles.CardNumber}>{cardNumber || "•••• •••• •••• ••••"}</div>
                                        <div className={Styles.CardHolder}>{cardHolder || "Nome do Titular"}</div>
                                        <div className={Styles.CardExpiry}>{expiryDate || "MM/AA"}</div>
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
                            <div className={Styles.Form}>
                                <h2>5. Confirmação de Reserva</h2>
                                {isPurchaseConfirmed ? (
                                    <div className={Styles.Confirmation}>
                                        <div className={Styles.CheckIcon}></div>
                                        <p>Reserva Confirmada!</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p>Revise sua reserva antes de confirmar.</p>
                                        <button type="button" className={Styles.ButtonDetalhes} onClick={handlePreviousStep}>Voltar</button>
                                        <button type="button" className={Styles.ButtonDetalhes} onClick={confirmPurchase}>Confirmar Reserva</button>
                                    </div>
                                )}
                            </div>
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
                                <span className={Styles.Value}>{entrada}</span>
                            </div>
                            <div className={Styles.InfoRow}>
                                <span className={Styles.Label}>Saída:</span>
                                <span className={Styles.Value}>{saida}</span>
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