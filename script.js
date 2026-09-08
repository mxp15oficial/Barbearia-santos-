const inputData = document.getElementById('data');
const hoje = new Date().toISOString().split('T')[0];
inputData.min = hoje;
inputData.value = hoje;

const btnVerificar = document.getElementById('btnVerificar');
const areaAgendamento = document.getElementById('areaAgendamento');
const btnConfirmar = document.getElementById('btnConfirmar');
const mensagem = document.getElementById('mensagem');

// Modal e Seleção
const btnAbrirCortes = document.getElementById('btnAbrirCortes');
const modalCortes = document.getElementById('modalCortes');
const btnFecharModal = document.getElementById('btnFecharModal');
const cardsCorte = document.querySelectorAll('.card-corte');
const textoCorteSelecionado = document.getElementById('textoCorteSelecionado');
const resumoValor = document.getElementById('resumoValor');
const valorTotal = document.getElementById('valorTotal');

let corteSelecionado = null;
let precoSelecionado = 0;

btnVerificar.addEventListener('click', () => {
  if (!inputData.value) {
    alert("Selecione uma data válida.");
    return;
  }
  // Exibe a área de agendamento se a data estiver disponível
  areaAgendamento.classList.remove('hidden');
  mensagem.innerText = "";
});

btnAbrirCortes.addEventListener('click', () => {
  modalCortes.classList.remove('hidden');
});

btnFecharModal.addEventListener('click', () => {
  modalCortes.classList.add('hidden');
});

// Clique nos cards da grade
cardsCorte.forEach(card => {
  card.addEventListener('click', () => {
    corteSelecionado = card.getAttribute('data-corte');
    precoSelecionado = parseFloat(card.getAttribute('data-preco'));

    // Atualiza texto do botão e valor na tela principal
    textoCorteSelecionado.innerText = `${corteSelecionado} - R$ ${precoSelecionado.toFixed(2)}`;
    valorTotal.innerText = `R$ ${precoSelecionado.toFixed(2)}`;
    
    resumoValor.classList.remove('hidden');
    modalCortes.classList.add('hidden');
  });
});

btnConfirmar.addEventListener('click', () => {
  const barbeiro = document.getElementById('selectBarbeiro').value;
  const categoria = document.getElementById('selectCategoria').value;
  const data = inputData.value;

  if (!corteSelecionado) {
    alert("Por favor, clique em 'Estilo do Corte' para escolher o modelo.");
    return;
  }

  mensagem.innerHTML = `
    <br>✅ <strong>Agendamento Concluído!</strong><br>
    📅 Data: ${data}<br>
    💈 Barbeiro: ${barbeiro}<br>
    ✂️ Corte: ${corteSelecionado}<br>
    💰 Valor: R$ ${precoSelecionado.toFixed(2)}
  `;
  mensagem.style.color = "#4ade80";
});
