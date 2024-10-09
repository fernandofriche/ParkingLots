// detalhesController.js
import {
    validarPasso1,
    validarPasso2,
    processarPagamento,
    calcularValorTotal,
} from '../DetalhesService';

export const handleSubmitStep1 = (nome, telefone, cpf, setCurrentStep) => {
    if (validarPasso1(nome, telefone, cpf)) {
        setCurrentStep((prev) => prev + 1);
    } else {
        alert("Preencha todos os campos corretamente.");
    }
};

export const handleSubmitStep2 = (modelo, placa, setCurrentStep) => {
    if (validarPasso2(modelo, placa)) {
        setCurrentStep((prev) => prev + 1);
    } else {
        alert("Preencha todos os campos corretamente.");
    }
};

export const handleSubmitPagamento = (entrada, saida, hourlyRate, dadosPagamento) => {
    const total = calcularValorTotal(entrada, saida, hourlyRate);
    console.log(`Valor Total: R$ ${total.toFixed(2)}`);

    const pagamentoSucesso = processarPagamento(dadosPagamento);
    return pagamentoSucesso;
};
