// Define a data mínima do calendário como o dia atual automaticamente
const inputData = document.getElementById('data');
const hoje = new Date().toISOString().split('T')[0];
inputData.min = hoje;
inputData.value = hoje;

const btnVerificar = document.getElementById('btnVerificar');
const areaBarbeiro = document.getElementById('areaBarbeiro');
const btnConfirmar = document.getElementById('btnConfirmar');
const mensagem = document.getElementById('mensagem');

// Simulação de vagas (No aplicativo real, esses dados virão do banco de dados)
btnVerificar.addEventListener('click', () => {
  const dataSelecionada = inputData.value;
  
  if (!dataSelecionada) {
    alert("Por favor, selecione uma data.");
    return;
  }

  // Lógica para liberar os barbeiros e serviços
  areaBarbeiro.classList.remove('hidden');
  mensagem.innerText = "";
});

btnConfirmar.addEventListener('click', () => {
  const barbeiro = document.getElementById('selectBarbeiro').value;
  const servico = document.getElementById('selectServico').value;
  const data = inputData.value;

  if (!barbeiro) {
    alert("Selecione um barbeiro disponível.");
    return;
  }

  mensagem.innerText = `Agendamento realizado para ${data} com o barbeiro ${barbeiro} (${servico})!`;
  mensagem.style.color = "#4ade80";
});
