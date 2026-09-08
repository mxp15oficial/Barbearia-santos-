// Data atual
const inputData = document.getElementById('data');
const hoje = new Date().toISOString().split('T')[0];
inputData.min = hoje;
inputData.value = hoje;

// Login / Identificação
const telaLogin = document.getElementById('telaLogin');
const telaAgendamento = document.getElementById('telaAgendamento');
const btnEntrar = document.getElementById('btnEntrar');
const clienteNomeInput = document.getElementById('clienteNome');
const clienteTelefoneInput = document.getElementById('clienteTelefone');
const textoSaudacao = document.getElementById('textoSaudacao');

// Agendamento
const btnVerificar = document.getElementById('btnVerificar');
const areaServicos = document.getElementById('areaServicos');
const cardsCorte = document.querySelectorAll('.card-corte');
const btnConfirmar = document.getElementById('btnConfirmar');
const mensagem = document.getElementById('mensagem');

// Meus Agendamentos
const btnMeusAgendamentos = document.getElementById('btnMeusAgendamentos');
const modalMeusAgendamentos = document.getElementById('modalMeusAgendamentos');
const btnFecharMeusAgendamentos = document.getElementById('btnFecharMeusAgendamentos');
const listaAgendamentos = document.getElementById('listaAgendamentos');

let clienteAtual = { nome: '', telefone: '' };
let corteSelecionado = null;
let agendamentosSalvos = [];

// Máscara automática de telefone (00) 00000-0000
clienteTelefoneInput.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
  value = value.replace(/(\d{5})(\d)/, '$1-$2');
  e.target.value = value;
});

// Acessar App com Nome e Telefone
btnEntrar.addEventListener('click', () => {
  const nome = clienteNomeInput.value.trim();
  const telefone = clienteTelefoneInput.value.trim();

  if (!nome || telefone.length < 14) {
    alert("Por favor, preencha seu nome e um número de telefone válido.");
    return;
  }

  clienteAtual = { nome, telefone };
  textoSaudacao.innerText = `Como vai, ${nome}! Que bom ter você aqui!`;
  
  telaLogin.classList.add('hidden');
  telaAgendamento.classList.remove('hidden');
});

// Verificar Vagas
btnVerificar.addEventListener('click', () => {
  areaServicos.classList.remove('hidden');
  mensagem.innerText = "";
});

// Seleção de Corte na Grade 2x2
cardsCorte.forEach(card => {
  card.addEventListener('click', () => {
    cardsCorte.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    corteSelecionado = {
      nome: card.getAttribute('data-corte'),
      preco: card.getAttribute('data-preco'),
      tempo: card.getAttribute('data-tempo')
    };
  });
});

// Confirmar Agendamento
btnConfirmar.addEventListener('click', () => {
  if (!corteSelecionado) {
    alert("Por favor, selecione um serviço!");
    return;
  }

  const barbeiro = document.getElementById('selectBarbeiro').value;
  const data = inputData.value;

  const novoAgendamento = {
    cliente: clienteAtual.nome,
    telefone: clienteAtual.telefone,
    barbeiro: barbeiro,
    corte: corteSelecionado.nome,
    preco: corteSelecionado.preco,
    data: data
  };

  agendamentosSalvos.push(novoAgendamento);

  mensagem.innerHTML = `
    <br>✅ <strong>Agendamento Concluído!</strong><br>
    👤 ${clienteAtual.nome} (${clienteAtual.telefone})<br>
    📅 Data: ${data}<br>
    💈 Barbeiro: ${barbeiro}<br>
    ✂️ Serviço: ${corteSelecionado.nome}<br>
    💰 Valor: R$ ${parseFloat(corteSelecionado.preco).toFixed(2)}
  `;
  mensagem.style.color = "#4ade80";
});

// Modal "Meus Agendamentos"
btnMeusAgendamentos.addEventListener('click', () => {
  modalMeusAgendamentos.classList.remove('hidden');
  
  if (agendamentosSalvos.length === 0) {
    listaAgendamentos.innerHTML = '<p class="empty-msg">Você não possui agendamentos em aberto.</p>';
  } else {
    listaAgendamentos.innerHTML = agendamentosSalvos.map(item => `
      <div style="background:#2a2a2a; padding:10px; border-radius:6px; margin-top:10px;">
        <strong>${item.corte}</strong> - R$ ${parseFloat(item.preco).toFixed(2)}<br>
        <small>📅 ${item.data} | 💈 ${item.barbeiro}</small>
      </div>
    `).join('');
  }
});

btnFecharMeusAgendamentos.addEventListener('click', () => {
  modalMeusAgendamentos.classList.add('hidden');
});
