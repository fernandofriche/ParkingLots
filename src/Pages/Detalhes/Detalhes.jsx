import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../Services/firebaseConfig";
import Styles from './Detalhes.module.css';
import LogoNew from '../../assets/Images/LogoNewVersion.png';
import CircleUser from '../../assets/Images/CircleUser.png';
import InputMask from 'react-input-mask';
import { FaRegCreditCard, FaUser, FaCalendarAlt } from 'react-icons/fa';
import Header from "../Header/header"


function Detalhes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = auth.currentUser;
    const [currentStep, setCurrentStep] = useState(1);
    const [parkingLot, setParkingLot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [valorTotal, setValorTotal] = useState(0);
    const [cvv, setCvv] = useState("");
    const [isPurchaseConfirmed, setIsPurchaseConfirmed] = useState(false);
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
    const [tipoReserva, setTipoReserva] = useState("hora");
    const userRef = doc(db, "Users", currentUser.uid);
    const reservaRef = collection(userRef, "Reservas");




    useEffect(() => {
        const fetchParkingLot = async () => {
            try {
                const docRef = doc(db, "ParkingLots", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setParkingLot(docSnap.data());
                } else {
                    setError("Estacionamento não encontrado.");
                }
                setLoading(false);
            } catch (err) {
                setError("Erro ao carregar os detalhes do estacionamento.");
                setLoading(false);
            }
        };

        fetchParkingLot();
    }, [id]);


    /* useEffect(() => {
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
    }, [id]); */


    const handleCpfChange = (e) => {
        const value = e.target.value;
        setCpf(value);

        const cpfNumbersOnly = value.replace(/\D/g, '');

        if (cpfNumbersOnly.length === 11) {
            setIsValid(false);
        } else {
            setIsValid(true);
        }
    };

    const handlePlacaChange = (e) => {
        const placaInput = e.target.value.toUpperCase();
        setPlaca(placaInput);

        if (placaInput.length === 7) {
            setPlacaValida(true);
        } else {
            setPlacaValida(false);
        }
    };

    const formatarDataHora = (data) => {
        const date = new Date(data);
        const horas = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dataFormatada = date.toLocaleDateString('pt-BR');
        return `${horas} ${dataFormatada}`;
    };


    const validarStep1 = () => {
        if (!nome || !telefone || !cpf) {
            alert("Preencha todos os dados pessoais para continuar.");
            return false;
        }


        return true;
    };

    const validarStep2 = () => {
        if (placa.length !== 7) {
            alert("A placa deve ter exatamente 7 caracteres.");
            return false;
        }
        return true;
    };

    const validarStep3 = () => {
        if (!entrada || !saida) {
            alert("Preencha os horários de entrada e saída para continuar.");
            return false;
        }

        const horaEntrada = new Date(entrada);
        const horaSaida = new Date(saida);
        const diferencaMs = horaSaida - horaEntrada;
        const diferencaHoras = diferencaMs / (1000 * 60 * 60);
        const diferencaDias = diferencaMs / (1000 * 60 * 60 * 24);

        if (horaEntrada.getTime() <= new Date().getTime()) {
            alert("O horário de entrada não pode ser no passado.");
            return false;
        }

        if (horaSaida <= horaEntrada) {
            alert("O horário de saída deve ser posterior ao de entrada.");
            return false;
        }

        if (diferencaHoras === 0) {
            alert("O horário de entrada não pode ser igual ao de saída.");
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

    const progressBarWidth = () => {
        switch (currentStep) {
            case 1:
                return "0%"; 
            case 2:
                return "25%"; 
            case 3:
                return "50%"; 
            case 4:
                return "75%"; 
            case 5:
                return "100%"; 
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

    const calcularValorTotal = (entrada, saida, hourlyRate, dailyRate) => {
        if (!entrada || !saida) return 0;

        const horaEntrada = new Date(entrada);
        const horaSaida = new Date(saida);

        const diferencaMs = horaSaida - horaEntrada;
        const diferencaHoras = diferencaMs / (1000 * 60 * 60);
        const diferencaDias = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));

        if (tipoReserva === 'hora') {
            if (diferencaDias > 1) {
                alert('Para o tipo de reserva por hora, a data de saída não pode ultrapassar o mesmo dia.');
                return 0;
            }
            return diferencaHoras * hourlyRate;
        } else if (tipoReserva === 'diaria') {
            return diferencaDias * dailyRate;
        }

        return 0;
    };


    const handleSaidaChange = (e) => {
        const saidaValue = e.target.value;
        const horaEntrada = new Date(entrada);
        const horaSaida = new Date(saidaValue);
        const diferencaMs = horaSaida - horaEntrada;
        const diferencaHoras = diferencaMs / (1000 * 60 * 60);
        const diferencaDias = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));

        
        if (horaSaida <= horaEntrada) {
            alert("O horário de saída deve ser posterior ao de entrada.");
            setSaida('');
            return;
        }

        
        if (diferencaDias > 1) {
            setTipoReserva('diaria');
        } else if (diferencaHoras > 3) {
            setTipoReserva('diaria');
        } else {
            setTipoReserva('hora');
        }

        setSaida(saidaValue);
    };


    const calcularDesconto = (entrada, saida, hourlyRate, dailyRate) => {
        const horaEntrada = new Date(entrada);
        const horaSaida = new Date(saida);
        const diferencaMs = horaSaida - horaEntrada;
        const diferencaHoras = diferencaMs / (1000 * 60 * 60);
        const diferencaDias = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));

        let valorHoras = diferencaHoras * hourlyRate;
        let valorTotal = valorHoras;
        let desconto = 0;

        if (diferencaDias > 1 || diferencaHoras > 3) {
            valorTotal = dailyRate * diferencaDias;
            desconto = valorHoras - valorTotal;
        }

        return { valorHoras, desconto, valorTotal };
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

        setShowModal(true);
    };

    const ConfirmarReserva = async () => {
        if (!parkingLot || !parkingLot.ownerId) {
            console.error("Erro: ID do proprietário do estacionamento está indefinido.");
            return;
        }
    
        const valorTotal = calcularValorTotal(entrada, saida, parkingLot.hourlyRate, parkingLot.dailyRate);
    
        const reserva = {
            userId: currentUser.uid,
            placa,
            local: parkingLot.name,
            entrada: new Date(entrada).toISOString(),
            saida: new Date(saida).toISOString(),
            valorTotal, 
            status: "pendente",
            confirmed: false,
            parkingOwnerId: parkingLot.ownerId
        };
    
        console.log("ID do dono do estacionamento (parkingOwnerId):", parkingLot.ownerId);
    
        try {
            
            const reservaRef = collection(db, "Reservas");
    
            
            await addDoc(reservaRef, reserva);
    
            
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

        if (enteredMonth < 1 || enteredMonth > 12) {
            setError('Mês inválido.');
            return;
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
    function Feedback() {
        navigate("/Feedback")
    }
    function Perfil() {
        navigate("/Profile")
    }

    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    
    const formatDateTimeInput = (date) => {
        return date.toISOString().slice(0, 16);
    };

    // Defina os limites de data
    const minDateTime = formatDateTimeInput(new Date());
    const maxDateTime = formatDateTimeInput(new Date(`${nextYear}-12-31T23:59`));


    return (
        <div>
            <Header/>

            <main className={Styles.DetalhesMainContent}>
                {loading && <p>Carregando detalhes...</p>}
                {error && <p>Error: {error}</p>}

                {parkingLot && (
                    <div className={Styles.DetalhesContainer}>
                        <h2>{parkingLot.name}</h2>
                        <p><strong>Endereço:</strong> {parkingLot.address || 'Indisponível'}</p>
                        <p>{parkingLot.description}</p>
                        <hr />
                        <p>
                            Valor da hora: R$ {parkingLot.hourlyRate?.toFixed(2) || 'Indisponível'} ||
                            Valor da diária: R$ {parkingLot.dailyRate?.toFixed(2) || 'Indisponível'}
                        </p>
                         


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
                                                    className={isValid ? '' : 'input-error'}
                                                />
                                            )}
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


                                <div className={Styles.RadioGroup}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="tipoReserva"
                                            value="hora"
                                            checked={tipoReserva === 'hora'}
                                            readOnly
                                        />
                                        Hora
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="tipoReserva"
                                            value="diaria"
                                            checked={tipoReserva === 'diaria'}
                                            readOnly
                                        />
                                        Diária
                                    </label>
                                </div>

                                <div className={Styles.InputGroupHorizontal}>
                                    <div>
                                        <label htmlFor="entrada">Entrada:</label>
                                        <input
                                            type="datetime-local"
                                            id="entrada"
                                            name="entrada"
                                            required
                                            value={entrada}
                                            min={minDateTime}
                                            max={maxDateTime}
                                            step="1800"
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
                                            min={entrada || minDateTime}
                                            max={maxDateTime}
                                            step="1800"
                                            onChange={handleSaidaChange}
                                        />
                                    </div>
                                </div>

                                {entrada && saida && (
                                    (() => {
                                        const { valorHoras, desconto, valorTotal } = calcularDesconto(
                                            entrada,
                                            saida,
                                            parkingLot.hourlyRate,
                                            parkingLot.dailyRate
                                        );

                                        return (
                                            <div className={Styles.ContainerInformacoes}>

                                                <div className={Styles.InformacaoEsquerda}>
                                                    <p>Valor das Horas: R$ {valorHoras.toFixed(2)}</p>
                                                    {desconto > 0 && <p className={Styles.Desconto}>Desconto: R$ {desconto.toFixed(2)}</p>}
                                                </div>


                                                <div className={Styles.InformacaoDireita}>
                                                    <p>Total a Pagar: R$ {valorTotal.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        );
                                    })()
                                )}

                                <button type="button" className={Styles.ButtonDetalhes} onClick={handlePreviousStep}>Voltar</button>
                                <button
                                    type="button"
                                    className={Styles.ButtonDetalhes}
                                    onClick={() => { if (validarStep3()) handleNextStep(); }}
                                >
                                    Prosseguir
                                </button>
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
                                    (() => {
                                        const { valorTotal } = calcularDesconto(
                                            entrada,
                                            saida,
                                            parkingLot.hourlyRate,
                                            parkingLot.dailyRate
                                        );

                                        return (
                                            <div className={Styles.ContainerInformacoesStep4}>
                                                <div className={Styles.InformacaoStep4}>
                                                    <p>Total da Reserva: R$ {valorTotal.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        );
                                    })()
                                )}

                               
                                <button
                                    type="button"
                                    className={Styles.ButtonDetalhes}
                                    onClick={handlePreviousStep}
                                >
                                    Voltar
                                </button>
                                <button
                                    type="button"
                                    className={Styles.ButtonDetalhes}
                                    onClick={() => {
                                        if (validarStep4()) handleNextStep();
                                    }}
                                >
                                    Prosseguir
                                </button>
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

            
            {showModal && (
                <div className={Styles.ModalConfirma}>
                    <div className={Styles.ModalContent}>
                        <h2>Atenção!</h2>
                        <p className={Styles.Aviso}>Revise as informações inseridas! Após a confirmação, os dados não poderão ser alterados.</p>


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
                                {entrada && saida && (
                                    (() => {
                                        const { valorTotal } = calcularDesconto(
                                            entrada,
                                            saida,
                                            parkingLot.hourlyRate,
                                            parkingLot.dailyRate
                                        );

                                        return (
                                            <div className={Styles.ContainerValorModal}>
                                                <span className={Styles.ValueModal}>R$ {valorTotal.toFixed(2)}</span>
                                            </div>
                                        );
                                    })()
                                )}
                            </div>
                        </div>

                        <div className={Styles.ModalButtons}>
                            <button className={Styles.ButtonCancela} onClick={closeModal}>Cancelar</button>
                            <button className={Styles.ButtonConfirma} onClick={ConfirmarReserva}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Detalhes;