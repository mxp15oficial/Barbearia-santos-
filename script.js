// Configuração de Calendário (Hoje até 2027)
const inputData = document.getElementById('dataAgendamento');
const hoje = new Date().toISOString().split('T')[0];
inputData.min = hoje;
inputData.max = "2027-12-31";
inputData.value = hoje;

// Tabela de Cortes com Galeria de 4 Fotos por Modelo
const tabelaCortes = {
  "santos1": [ // Santos 💈
    { 
      id: 1, 
      nome: "Degradê Normal", 
      preco: 40.00, 
      fotos: {
        frente: "https://via.placeholder.com/300?text=Frente+-+Degradê",
        ladoEsq: "https://via.placeholder.com/300?text=Lado+Esq+-+Degradê",
        ladoDir: "https://via.placeholder.com/300?text=Lado+Dir+-+Degradê",
        atras: "https://via.placeholder.com/300?text=Atrás+-+Degradê"
      }
    },
    { 
      id: 2, 
      nome: "Degradê Navalhado", 
      preco: 45.00, 
      fotos: {
        frente: "https://via.placeholder.com/300?text=Frente+-+Navalhado",
        ladoEsq: "https://via.placeholder.com/300?text=Lado+Esq+-+Navalhado",
        ladoDir: "https://via.placeholder.com/300?text=Lado+Dir+-+Navalhado",
        atras: "https://via.placeholder.com/300?text=Atrás+-+Navalhado"
      }
    },
    { 
      id: 3, 
      nome: "Corte + Barba", 
      preco: 65.00, 
      fotos: {
        frente: "https://via.placeholder.com/300?text=Frente+-+Corte+Barba",
        ladoEsq: "https://via.placeholder.com/300?text=Lado+Esq+-+Corte+Barba",
        ladoDir: "https://via.placeholder.com/300?text=Lado+Dir+-+Corte+Barba",
        atras: "https://via.placeholder.com/300?text=Atrás+-+Corte+Barba"
      }
    },
    { 
      id: 4, 
      nome: "Design de Barba", 
      preco: 25.00, 
      fotos: {
        frente: "https://via.placeholder.com/300?text=Frente+-+Barba",
        ladoEsq: "https://via.placeholder.com/300?text=Lado+Esq+-+Barba",
        ladoDir: "https://via.placeholder.com/300?text=Lado+Dir+-+Barba",
        atras: "https://via.placeholder.com/300?text=Atrás+-+Barba"
      }
    }
  ],
  "santos2": [ // Santos 🪮
    { 
      id: 1, 
      nome: "Degradê Normal", 
      preco: 35.00, 
      fotos: {
        frente: "https://via.placeholder.com/300?text=Frente+-+Degradê",
        ladoEsq: "https://via.placeholder.com/300?text=Lado+Esq+-+Degradê",
        ladoDir: "https://via.placeholder.com/300?text=Lado+Dir+-+Degradê",
        atras: "https://via.placeholder.com/300?text=Atrás+-+Degradê"
      }
    },
    { 
      id: 2, 
      nome: "Degradê Navalhado", 
      preco: 40.00, 
      fotos: {
        frente: "https://via.placeholder.com/300?text=Frente+-+Navalhado",
        ladoEsq: "https://via.placeholder.com/300?text=Lado+Esq+-+Navalhado",
        ladoDir: "https://via.placeholder.com/300?text=Lado+Dir+-+Navalhado",
        atras: "https://via.placeholder.com/300?text=Atrás+-+Navalhado"
      }
    },
    { 
      id: 3, 
      nome: "Corte + Barba", 
      preco: 55.00, 
      fotos: {
        frente: "https://via.placeholder.com/300?text=Frente+-+Corte+Barba",
        ladoEsq: "https://via.placeholder.com/300?text=Lado+Esq+-+Corte+Barba",
        ladoDir: "https://via.placeholder.com/300?text=Lado+Dir+-+Corte+Barba",
        atras: "https://via.placeholder.com/300?text=Atrás+-+Corte+Barba"
      }
    },
    { 
      id: 4, 
      nome: "Design de Barba", 
      preco: 20.00, 
      fotos: {
        frente: "https://via.placeholder.com/300?text=Frente+-+Barba",
        ladoEsq: "https://via.placeholder.com/300?text=Lado+Esq+-+Barba",
        ladoDir: "https://via.placeholder.com/300?text=Lado+Dir+-+Barba",
        atras: "https://via.placeholder.com/300?text=Atrás+-+Barba"
      }
    }
  ]
};

// Elementos Principais
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

// Modal de Fotos
const modalFotosCorte = document.getElementById('modalFotosCorte');
const btnFecharGaleria = document.getElementById('btnFecharGaleria');
const tituloGaleria = document.getElementById('tituloGaleria');

let clienteAtual = { nome: '', telefone: '' };
let corteSelecionado = null;
let agendamentosSalvos = [];
let listaAlarmes = [];

// Função para Carregar os Cards de Cortes
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
      <div class="img-box" onclick="abrirGaleriaFotos('${corte.nome}', '${corte.fotos.frente}', '${corte.fotos.ladoEsq}', '${corte.fotos.ladoDir}', '${corte.fotos.atras}')">
        <img src="${corte.fotos.frente}" alt="${corte.nome}">
        <span class="tag-ver">🔍 Ver Fotos</span>
      </div>
      <p class="nome-corte">${corte.nome}</p>
      <p class="preco">R$ ${corte.preco.toFixed(2)}</p>
      <button class="btn-selecionar-corte">Selecionar Corte</button>
    `;

    // Clique no Botão Escolher / Selecionar
    const btnSel = card.querySelector('.btn-selecionar-corte');
    btnSel.addEventListener('click', () => {
      document.querySelectorAll('.card-corte').forEach(c => c.classList.remove('selected'));
      document.querySelectorAll('.btn-selecionar-corte').forEach(b => b.innerText = "Selecionar Corte");
      
      card.classList.add('selected');
      btnSel.innerText = "✓ Selecionado";
      corteSelecionado = corte;
    });

    gridCortes.appendChild(card);
  });
}

selectBarbeiro.addEventListener('change', carregarCortes);

// Função para abrir a Galeria de 4 Imagens
window.abrirGaleriaFotos = function(nome, frente, ladoEsq, ladoDir, atras) {
  tituloGaleria.innerText = `Fotos: ${nome}`;
  document.getElementById('imgFrente').src = frente;
  document.getElementById('imgLadoEsq').src = ladoEsq;
  document.getElementById('imgLadoDir').src = ladoDir;
  document.getElementById('imgAtras').src = atras;

  modalFotosCorte.classList.remove('hidden');
};

btnFecharGaleria.addEventListener('click', () => {
  modalFotosCorte.classList.add('hidden');
});

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

// Agendamento e Ativação de Alarme
btnFinalizar.addEventListener('click', () => {
  if (!corteSelecionado) {
    alert("Clique no botão 'Selecionar Corte' no corte desejado!");
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

  // Ativação do Alarme
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

// Modal Meus Agendamentos
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

// Cancelamento de Agendamento (Desativa Alarme)
window.cancelarAgendamento = function(id) {
  const alarmeObj = listaAlarmes.find(a => a.id === id);
  if (alarmeObj) {
    clearTimeout(alarmeObj.timerId);
    listaAlarmes = listaAlarmes.filter(a => a.id !== id);
  }

  agendamentosSalvos = agendamentosSalvos.filter(a => a.id !== id);
  alert("Agendamento cancelado e alarme desativado!");
  modalMeusAgendamentos.classList.add('hidden');
  mensagem.innerText = "";
};
      
