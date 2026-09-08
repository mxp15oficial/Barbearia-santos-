// Configuração de Limites do Calendário (Hoje até o final de 2027)
const inputData = document.getElementById('dataAgendamento');
const hoje = new Date().toISOString().split('T')[0];
inputData.min = hoje;
inputData.max = "2027-12-31";
inputData.value = hoje;

// Tabela de Preços por Barbeiro
const tabelaCortes = {
  "santos1": [ // Santos 💈
    { id: 1, nome: "Degradê Normal", preco: 40.00, img: "https://via.placeholder.com/150?text=Degrade+Normal" },
    { id: 2, nome: "Degradê Navalhado", preco: 45.00, img: "https://via.placeholder.com/150?text=Navalhado" },
    { id: 3, nome: "Corte + Barba", preco: 65.00, img: "https://via.placeholder.com/150?text=Corte+Barba" },
    { id: 4, nome: "Design de Barba", preco: 25.00, img: "https://via.placeholder.com/150?text=Barba" }
  ],
  "santos2": [ // Santos 🪮 (Preços diferenciados)
    { id: 1, nome: "Degradê Normal", preco: 35.00, img: "https://via.placeholder.com/150?text=Degrade+Normal" },
    { id: 2, nome: "Degradê Navalhado", preco: 40.00, img: "https://via.placeholder.com/150?text=Navalhado" },
    { id: 3, nome: "Corte + Barba", preco: 55.00, img: "https://via.placeholder.com/150?text=Corte+Barba" },
    { id: 4, nome: "Design de Barba", preco: 20.00, img: "https://via.placeholder.com/150?text=Barba" }
  ]
};

// Elementos
const telaLogin = document.getElementById('telaLogin');
const telaAgendamento = document.getElementById('telaAgendamento');
const btnEntrar = document.getElementById('btnEntrar');
const clienteNomeInput = document.getElementById('clienteNome');
const clienteTelefoneInput = document.getElementById('clienteTelefone');
const selectBarbeiro = document.getElementById('selectBarbeiro');
const gridCortes = document.getElementById('gridCortes');
const btnFinalizar = document.getElementById('btnFinalizar');
const mensagem = document.getElementById('mensagem');
const somAlarme = document.getElementById('somAlarme');

let clienteAtual = { nome: '', telefone: '' };
let corteSelecionado = null;
let agendamentosSalvos = [];
let listaAlarmes = [];

// Renderizar cortes com base no barbeiro
function carregarCortes() {
  const barbeiroOpcao = selectBarbeiro.options[selectBarbeiro.selectedIndex];
  const barbeiroId = barbeiroOpcao.getAttribute('data-id');
  const lista = tabelaCortes[barbeiroId];

  gridCortes.innerHTML = "";
  corteSelecionado = null;

  lista.forEach(corte => {
    const card = document.createElement('div');
    card.className = 'card-corte';
    card.innerHTML = `
      <div class="img-box"><img src="${corte.img}" alt="${corte.nome}"></div>
      <p class="nome-corte">${corte.nome}</p>
      <p class="preco">R$ ${corte.preco.toFixed(2)}</p>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('.card-corte').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      corteSelecionado = corte;
    });

    gridCortes.appendChild(card);
  });
}

selectBarbeiro.addEventListener('change', carregarCortes);

// Login
btnEntrar.addEventListener('click', () => {
  const nome = clienteNomeInput.value.trim();
  const tel = clienteTelefoneInput.value.trim();

  if (!nome || !tel) {
    alert("Preencha seu nome e telefone!");
    return;
  }

  clienteAtual = { nome, tel };
  document.getElementById('textoSaudacao').innerText = `Como vai, ${nome}!`;
  telaLogin.classList.add('hidden');
  telaAgendamento.classList.remove('hidden');
  carregarCortes();
});

// Agendamento e Ativação do Alarme
btnFinalizar.addEventListener('click', () => {
  if (!corteSelecionado) {
    alert("Selecione um corte de cabelo!");
    return;
  }

  const data = inputData.value;
  const hora = document.getElementById('horaAgendamento').value;
  const barbeiro = selectBarbeiro.value;
  const idAgendamento = Date.now();

  const novoAgendamento = {
    id: idAgendamento,
    cliente: clienteAtual.nome,
    barbeiro: barbeiro,
    corte: corteSelecionado.nome,
    preco: corteSelecionado.preco,
    data: data,
    hora: hora,
    endereco: "Dentro da Rodoviária de Costa Rica - MS"
  };

  agendamentosSalvos.push(novoAgendamento);

  // Configuração do Alarme
  const dataHoraAgendada = new Date(`${data}T${hora}:00`);
  const tempoRestante = dataHoraAgendada.getTime() - new Date().getTime();

  if (tempoRestante > 0) {
    const timerId = setTimeout(() => {
      somAlarme.play();
      alert(`⏰ ALARME! Está na hora do seu corte de cabelo com ${barbeiro}!`);
    }, tempoRestante);

    listaAlarmes.push({ id: idAgendamento, timerId: timerId });
  }

  mensagem.innerHTML = `
    <br>✅ <strong>Agendamento Realizado!</strong><br>
    💈 Barbeiro: ${barbeiro}<br>
    ✂️ Serviço: ${corteSelecionado.nome} (R$ ${corteSelecionado.preco.toFixed(2)})<br>
    📅 Data: ${data} às ${hora}<br>
    📍 <strong>Local:</strong> Dentro da Rodoviária de Costa Rica - MS<br>
    ⏰ <em>Alarme ativado para este horário!</em>
  `;
  mensagem.style.color = "#4ade80";
});

// Modal e Cancelamento de Agendamento (Desativa Alarme)
const modalMeusAgendamentos = document.getElementById('modalMeusAgendamentos');
document.getElementById('btnMeusAgendamentos').addEventListener('click', () => {
  modalMeusAgendamentos.classList.remove('hidden');
  const lista = document.getElementById('listaAgendamentos');

  if (agendamentosSalvos.length === 0) {
    lista.innerHTML = "<p>Nenhum agendamento ativo.</p>";
  } else {
    lista.innerHTML = agendamentosSalvos.map(item => `
      <div style="background:#2a2a2a; padding:10px; border-radius:6px; margin-top:10px;">
        <strong>${item.corte}</strong> - R$ ${item.preco.toFixed(2)}<br>
        💈 ${item.barbeiro} | 📅 ${item.data} às ${item.hora}<br>
        📍 ${item.endereco}<br>
        <button class="btn-cancelar" onclick="cancelarAgendamento(${item.id})">Cancelar Agendamento e Desativar Alarme</button>
      </div>
    `).join('');
  }
});

document.getElementById('btnFecharMeusAgendamentos').addEventListener('click', () => {
  modalMeusAgendamentos.classList.add('hidden');
});

// Função para Cancelar Agendamento e Desativar Alarme
window.cancelarAgendamento = function(id) {
  // Desativa o timer do alarme
  const alarmeObj = listaAlarmes.find(a => a.id === id);
  if (alarmeObj) {
    clearTimeout(alarmeObj.timerId);
    listaAlarmes = listaAlarmes.filter(a => a.id !== id);
  }

  // Remove o agendamento da lista
  agendamentosSalvos = agendamentosSalvos.filter(a => a.id !== id);
  alert("Agendamento cancelado e alarme desativado com sucesso!");
  modalMeusAgendamentos.classList.add('hidden');
  mensagem.innerText = "";
};
