// detalhesService.js

// Função para calcular o valor total com base na entrada e saída
export const calcularValorTotal = (entrada, saida, hourlyRate) => {
    const entradaDate = new Date(entrada);
    const saidaDate = new Date(saida);
    const totalHours = Math.ceil((saidaDate - entradaDate) / (1000 * 60 * 60));
    return totalHours * hourlyRate;
};

// Função para formatar a data e hora
export const formatarDataHora = (dataHora) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dataHora).toLocaleString('pt-BR', options);
};

// Função para validar o CPF
export const validarCpf = (cpf) => {
    // Adicione sua lógica de validação de CPF aqui
    return cpf.startsWith('3'); // Exemplo: CPF deve ser de Minas Gerais
};

// Função para validar as informações do passo 1
export const validarPasso1 = (nome, telefone, cpf) => {
    return nome && telefone && validarCpf(cpf);
};

// Função para validar as informações do passo 2
export const validarPasso2 = (modelo, placa) => {
    return modelo && placa.length === 7; // Exemplo de validação da placa
};

// Função para realizar o pagamento (exemplo)
export const processarPagamento = (dadosPagamento) => {
    // Aqui você pode integrar com uma API de pagamento
    console.log("Processando pagamento", dadosPagamento);
    return true; // Simulação de sucesso
};
