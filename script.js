// Data Limite
const inputData = document.getElementById('dataAgendamento');
const hoje = new Date().toISOString().split('T')[0];
inputData.min = hoje;
inputData.max = "2027-12-31";
inputData.value = hoje;

// Lista de Barbeiros (Salva no Navegador/LocalStorage)
let listaBarbeiros = JSON.parse(localStorage.getItem('barbearia_barbeiros')) || {
  "santos1": { nome: "Santos 💈", titulo: "Profissional", senha: "111" },
  "santos2": { nome: "Santos 🪮", titulo: "Especialista", senha: "222" }
};

// Tabela de Cortes por Barbeiro
let tabelaCortes = JSON.parse(localStorage.getItem('barbearia_cortes_v3')) || {
  "santos1": [
    { 
      id: 1, nome: "Degradê Normal", preco: 40.00, 
      fotos: {
        frente: "https://via.placeholder.com/300?text=Frente",
        ladoEsq: "https://via.placeholder.com/300?text=Esq",
        ladoDir: "https://via.placeholder.com/300?text=Dir",
        atras: "https://via.placeholder.com/300?text=Atras"
      }
    }
  ]
};

// Elementos Principais
const telaLogin = document.getElementById('telaLogin');
const telaAgendamento = document.getElementById('telaAgendamento');
const telaDono = document.getElementById('telaDono');
const selectBarbeiro = document.getElementById('selectBarbeiro');
const gridCortes = document.getElementById('gridCortes');

const btnModoDono = document.getElementById('btnModoDono');
const btnSairDono = document.getElementById('btnSairDono');
const btnSalvarCorte = document.getElementById('btnSalvarCorte');
const btnCadastrarBarbeiro = document.getElementById('btnCadastrarBarbeiro');
const tituloPainelBarbeiro = document.getElementById('tituloPainelBarbeiro');
const listaMeusCortesAdmin = document.getElementById('listaMeusCortesAdmin');

let barbeiroLogadoId = null;
let corteSelecionado = null;

// Função para Preencher o Select de Barbeiros na Tela do Cliente
function atualizarSelectBarbeirosCliente() {
  selectBarbeiro.innerHTML = "";
  for (let id in listaBarbeiros) {
    const b = listaBarbeiros[id];
    const option = document.createElement('option');
    option.value = id;
    option.innerText = `${b.nome} (${b.titulo})`;
    selectBarbeiro.appendChild(option);
  }
}

// Cadastrar Novo Barbeiro (Admin)
btnCadastrarBarbeiro.addEventListener('click', () => {
  const nome = document.getElementById('novoBarbeiroNome').value.trim();
  const titulo = document.getElementById('novoBarbeiroTitulo').value.trim() || "Profissional";
  const senha = document.getElementById('novoBarbeiroSenha').value.trim();

  if (!nome || !senha) {
    alert("Informe pelo menos o nome e a senha do novo barbeiro!");
    return;
  }

  const idBarbeiro = "b_" + Date.now();
  listaBarbeiros[idBarbeiro] = { nome, titulo, senha };
  
  // Cria entrada na tabela de cortes
  tabelaCortes[idBarbeiro] = [];

  // Salva no LocalStorage
  localStorage.setItem('barbearia_barbeiros', JSON.stringify(listaBarbeiros));
  localStorage.setItem('barbearia_cortes_v3', JSON.stringify(tabelaCortes));

  alert(`Barbeiro ${nome} cadastrado com sucesso!`);
  
  // Limpar campos
  document.getElementById('novoBarbeiroNome').value = "";
  document.getElementById('novoBarbeiroTitulo').value = "";
  document.getElementById('novoBarbeiroSenha').value = "";

  atualizarSelectBarbeirosCliente();
});

// Login do Barbeiro / Admin
btnModoDono.addEventListener('click', () => {
  let opcoes = "Selecione a conta para acessar o painel:\n";
  let idsMap = [];
  let index = 1;

  for (let id in listaBarbeiros) {
    opcoes += `${index} - ${listaBarbeiros[id].nome}\n`;
    idsMap[index] = id;
    index++;
  }

  const escolha = prompt(opcoes);
  const selectedIndex = parseInt(escolha);

  if (idsMap[selectedIndex]) {
    const targetId = idsMap[selectedIndex];
    const senhaInserida = prompt(`Digite a senha de ${listaBarbeiros[targetId].nome}:`);

    if (senhaInserida === listaBarbeiros[targetId].senha) {
      barbeiroLogadoId = targetId;
      tituloPainelBarbeiro.innerText = `Painel: ${listaBarbeiros[targetId].nome}`;

      telaLogin.classList.add('hidden');
      telaAgendamento.classList.add('hidden');
      telaDono.classList.remove('hidden');

      carregarListaMeusCortesAdmin();
    } else if (senhaInserida !== null) {
      alert("Senha incorreta!");
    }
  } else if (escolha !== null) {
    alert("Opção inválida!");
  }
});

btnSairDono.addEventListener('click', () => {
  barbeiroLogadoId = null;
  telaDono.classList.add('hidden');
  telaLogin.classList.remove('hidden');
});

// Converter Foto Local para URL
function obterFotoUrl(fileInputId, textInputId) {
  return new Promise((resolve) => {
    const fileInput = document.getElementById(fileInputId);
    const textInput = document.getElementById(textInputId).value.trim();

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(fileInput.files[0]);
    } else if (textInput !== "") {
      resolve(textInput);
    } else {
      resolve("https://via.placeholder.com/300?text=Sem+Foto");
    }
  });
}

// Salvar Corte para o Barbeiro Logado
btnSalvarCorte.addEventListener('click', async () => {
  if (!barbeiroLogadoId) return;

  const nome = document.getElementById('corteNomeInput').value.trim();
  const preco = parseFloat(document.getElementById('cortePrecoInput').value);

  if (!nome || isNaN(preco)) {
    alert("Preencha o Nome e o Valor do corte!");
    return;
  }

  const fotoFrente = await obterFotoUrl('fileFrente', 'urlFrente');
  const fotoEsq = await obterFotoUrl('fileEsq', 'urlEsq');
  const fotoDir = await obterFotoUrl('fileDir', 'urlDir');
  const fotoAtras = await obterFotoUrl('fileAtras', 'urlAtras');

  const novoCorte = {
    id: Date.now(),
    nome: nome,
    preco: preco,
    fotos: { frente: fotoFrente, ladoEsq: fotoEsq, ladoDir: fotoDir, atras: fotoAtras }
  };

  if (!tabelaCortes[barbeiroLogadoId]) tabelaCortes[barbeiroLogadoId] = [];
  tabelaCortes[barbeiroLogadoId].push(novoCorte);

  localStorage.setItem('barbearia_cortes_v3', JSON.stringify(tabelaCortes));

  alert("Corte salvo com sucesso!");
  
  // Limpar formulário
  document.getElementById('corteNomeInput').value = "";
  document.getElementById('cortePrecoInput').value = "";

  carregarListaMeusCortesAdmin();
});

// Lista de Cortes no Painel Admin
function carregarListaMeusCortesAdmin() {
  const lista = tabelaCortes[barbeiroLogadoId] || [];
  listaMeusCortesAdmin.innerHTML = "";

  if (lista.length === 0) {
    listaMeusCortesAdmin.innerHTML = "<p style='font-size:12px; color:#aaa;'>Nenhum corte cadastrado ainda.</p>";
    return;
  }

  lista.forEach(corte => {
    const div = document.createElement('div');
    div.className = 'item-admin-corte';
    div.innerHTML = `
      <span><strong>${corte.nome}</strong> - R$ ${corte.preco.toFixed(2)}</span>
      <button class="btn-cancelar" onclick="excluirCorte(${corte.id})">Excluir</button>
    `;
    listaMeusCortesAdmin.appendChild(div);
  });
}

window.excluirCorte = function(corteId) {
  tabelaCortes[barbeiroLogadoId] = tabelaCortes[barbeiroLogadoId].filter(c => c.id !== corteId);
  localStorage.setItem('barbearia_cortes_v3', JSON.stringify(tabelaCortes));
  carregarListaMeusCortesAdmin();
};

// Renderizar Cortes no Lado do Cliente
function carregarCortes() {
  const barbeiroId = selectBarbeiro.value;
  const lista = tabelaCortes[barbeiroId] || [];

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

// Modal Fotos
window.abrirGaleriaFotos = function(nome, frente, ladoEsq, ladoDir, atras) {
  document.getElementById('tituloGaleria').innerText = `Fotos: ${nome}`;
  document.getElementById('imgFrente').src = frente;
  document.getElementById('imgLadoEsq').src = ladoEsq;
  document.getElementById('imgLadoDir').src = ladoDir;
  document.getElementById('imgAtras').src = atras;
  document.getElementById('modalFotosCorte').classList.remove('hidden');
};

document.getElementById('btnFecharGaleria').addEventListener('click', () => {
  document.getElementById('modalFotosCorte').classList.add('hidden');
});

// Login do Cliente
document.getElementById('btnEntrar').addEventListener('click', () => {
  const nome = document.getElementById('clienteNome').value.trim();
  const tel = document.getElementById('clienteTelefone').value.trim();

  if (!nome || !tel) {
    alert("Preencha seu nome e telefone!");
    return;
  }

  document.getElementById('textoSaudacao').innerText = `Como vai, ${nome}!`;
  telaLogin.classList.add('hidden');
  telaAgendamento.classList.remove('hidden');
  atualizarSelectBarbeirosCliente();
  carregarCortes();
});
    
