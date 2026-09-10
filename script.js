let corteSelecionado = null;

// Converte "HH:MM" para minutos totais
function horaParaMinutos(horaStr) {
  if (!horaStr) return 0;
  const [h, m] = horaStr.split(':').map(Number);
  return h * 60 + m;
}

// Converte minutos totais para formato "HH:MM"
function minutosParaHora(minutos) {
  const h = Math.floor(minutos / 60).toString().padStart(2, '0');
  const m = (minutos % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

// Retorna a data do próximo dia útil (ignorando domingos)
function obterProximoDiaUtil(dataStr) {
  let d = new Date(dataStr + 'T00:00:00');
  d.setDate(d.getDate() + 1);
  if (d.getDay() === 0) { // Se cair no domingo, pula para segunda
    d.setDate(d.getDate() + 1);
  }
  const dia = d.getDate().toString().padStart(2, '0');
  const mes = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${dia}/${mes}/${d.getFullYear()}`;
}

// Atualiza o menu de horários e exibe o alerta caso o dia esteja lotado
function atualizarHorariosDisponiveis() {
  const dataInput = document.getElementById('dataAgendamento').value;
  const barbeiroSelect = document.getElementById('selectBarbeiro');
  const horaSelect = document.getElementById('horaAgendamento');
  const alertaCheio = document.getElementById('alertaDiaCheio');
  const sugestaoTexto = document.getElementById('sugestaoProximoDia');
  const campoHoraContainer = document.getElementById('campoHoraContainer');

  if (!horaSelect || !alertaCheio || !campoHoraContainer) return;

  horaSelect.innerHTML = '';
  alertaCheio.classList.add('hidden');
  campoHoraContainer.classList.remove('hidden');

  if (!dataInput) {
    horaSelect.innerHTML = '<option value="">Selecione primeiro uma data</option>';
    return;
  }

  // Bloqueio de Domingo
  const dataObj = new Date(dataInput + 'T00:00:00');
  if (dataObj.getDay() === 0) {
    horaSelect.innerHTML = '<option value="">Fechado aos Domingos</option>';
    alert('A barbearia fica fechada aos domingos! Por favor, selecione outra data.');
    return;
  }

  const barbeiroNome = barbeiroSelect.options[barbeiroSelect.selectedIndex]?.text || "";
  const agendamentos = JSON.parse(localStorage.getItem('barbearia_agendamentos')) || [];
  
  // Duração do corte atual (padrão 30 minutos)
  const duracaoCorteAtual = corteSelecionado ? (corteSelecionado.duracao || 30) : 30;

  const inicioDia = 7 * 60;  // 07:00
  const fimDia = 18 * 60;    // 18:00

  let horariosLivres = 0;

  for (let min = inicioDia; min <= fimDia; min += 30) {
    const horaStr = minutosParaHora(min);
    const inicioNovo = min;
    const fimNovo = min + duracaoCorteAtual;

    // Se a duração ultrapassar o horário limite de fechamento
    if (fimNovo > fimDia + 30) continue;

    const ocupado = agendamentos.some(item => {
      if (item.barbeiro !== barbeiroNome || item.data !== dataInput) return false;

      const inicioExistente = horaParaMinutos(item.hora);
      const duracaoExistente = item.duracao || 30;
      const fimExistente = inicioExistente + duracaoExistente;

      return (inicioNovo < fimExistente) && (fimNovo > inicioExistente);
    });

    if (!ocupado) {
      const option = document.createElement('option');
      option.value = horaStr;
      option.textContent = `⌚ ${horaStr} - Disponível`;
      horaSelect.appendChild(option);
      horariosLivres++;
    }
  }

  // EXIBIR AVISO CASO NÃO EXISTA NENHUM HORÁRIO LIVRE NO DIA
  if (horariosLivres === 0) {
    campoHoraContainer.classList.add('hidden');
    alertaCheio.classList.remove('hidden');
    const proximoDia = obterProximoDiaUtil(dataInput);
    sugestaoTexto.textContent = `Horário disponível só no dia ${proximoDia}`;
  }
}

// Salvar Corte no Painel do Barbeiro com Duração em Horas e Minutos
document.getElementById('btnSalvarCorte')?.addEventListener('click', () => {
  const nome = document.getElementById('corteNomeInput').value;
  const preco = parseFloat(document.getElementById('cortePrecoInput').value);
  const horas = parseInt(document.getElementById('corteHorasInput').value) || 0;
  const minutos = parseInt(document.getElementById('corteMinutosInput').value) || 0;

  const duracaoTotal = (horas * 60) + minutos;

  if (!nome || isNaN(preco) || duracaoTotal === 0) {
    alert("Por favor, informe o nome, preço e uma duração válida!");
    return;
  }

  alert(`Corte "${nome}" cadastrado com sucesso! Duração total: ${duracaoTotal} minutos.`);
});

// Event Listeners
document.getElementById('dataAgendamento')?.addEventListener('change', atualizarHorariosDisponiveis);
document.getElementById('selectBarbeiro')?.addEventListener('change', atualizarHorariosDisponiveis);

// Ação de Login/Entrar
document.getElementById('btnEntrar')?.addEventListener('click', () => {
  const nome = document.getElementById('clienteNome').value;
  if (!nome) {
    alert("Por favor, informe seu nome para entrar!");
    return;
  }
  document.getElementById('telaLogin').classList.add('hidden');
  document.getElementById('telaAgendamento').classList.remove('hidden');
  document.getElementById('textoSaudacao').textContent = `Olá, ${nome}!`;
});

// Finalizar Agendamento
document.getElementById('btnFinalizar')?.addEventListener('click', () => {
  const dataInput = document.getElementById('dataAgendamento').value;
  const horaInput = document.getElementById('horaAgendamento').value;
  const barbeiroSelect = document.getElementById('selectBarbeiro');
  const barbeiroNome = barbeiroSelect.options[barbeiroSelect.selectedIndex]?.text || "Não informado";

  if (!dataInput || !horaInput) {
    alert("Por favor, selecione uma data e um horário válido!");
    return;
  }

  if (!corteSelecionado) {
    alert("Selecione um corte de cabelo antes de finalizar!");
    return;
  }

  const duracao = corteSelecionado.duracao || 30;

  const novoAgendamento = {
    cliente: document.getElementById('clienteNome')?.value || "Cliente",
    telefone: document.getElementById('clienteTelefone')?.value || "",
    corte: corteSelecionado.nome,
    preco: parseFloat(corteSelecionado.preco).toFixed(2),
    duracao: duracao,
    barbeiro: barbeiroNome,
    data: dataInput,
    hora: horaInput
  };

  let agendamentos = JSON.parse(localStorage.getItem('barbearia_agendamentos')) || [];
  agendamentos.push(novoAgendamento);
  localStorage.setItem('barbearia_agendamentos', JSON.stringify(agendamentos));

  alert(`Agendamento confirmado!\n\nBarbeiro: ${barbeiroNome}\nData: ${dataInput}\nHorário: ${horaInput}`);
  atualizarHorariosDisponiveis();
});
