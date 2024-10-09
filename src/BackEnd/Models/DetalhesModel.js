// detalhesModel.js

export const calcularValorTotal = (entrada, saida, hourlyRate) => {
    const entradaDate = new Date(entrada);
    const saidaDate = new Date(saida);
    const totalHours = Math.ceil((saidaDate - entradaDate) / (1000 * 60 * 60));
    return totalHours * hourlyRate;
};

export const formatarDataHora = (dataHora) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dataHora).toLocaleString('pt-BR', options);
};

export const validarCpf = (cpf) => {
    // Adicione sua lógica de validação de CPF aqui
    // Exemplo básico de validação:
    return cpf.startsWith('3'); // Exemplo: CPF deve ser de Minas Gerais
};

export const validarPasso1 = (nome, telefone, cpf) => {
    return nome && telefone && validarCpf(cpf);
};

export const validarPasso2 = (modelo, placa) => {
    return modelo && placa.length === 7; // Exemplo de validação da placa
};

// E assim por diante para outras validações...
