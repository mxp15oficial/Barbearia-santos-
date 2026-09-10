let corteSelecionado = null;

// Converte "HH:MM" para minutos
function horaParaMinutos(horaStr) {
  const [h, m] = horaStr.split(':').map(Number);
  return h * 60 + m;
}

// Converte minutos para "HH:MM"
function minutosParaHora(minutos) {
  const h = Math.floor(minutos / 60).toString().padStart(2, '0');
  const m = (minutos % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

// Calcula o próximo dia útil disponível
function obterProximoDiaUtil(dataStr) {
  let d = new Date(dataStr + 'T00:00:00');
  d.setDate(d.getDate() + 1);
  // Se for domingo (0), avança para segunda (1)
  if (d.getDay() === 0) {
    d.setDate(d.getDate() + 1);
  }
  const dia = d.getDate().toString().padStart(2, '0');
  const mes = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${dia}/${mes}/${d.getFullYear()}`;
}

// Atualizar a lista de horários livres
function atualizarHorariosDisponiveis() {
  const dataInput = document.getElementById('dataAgendamento').value;
  const barbeiroSelect = document.getElementById('selectBarbeiro');
  const horaSelect = document.getElementById('horaAgendamento');
  const alertaCheio = document.getElementById('alertaDiaCheio');
  const sugestaoTexto = document.getElementById('sugestaoProximoDia');
  const campoHoraContainer = document.getElementById('campoHoraContainer');

  horaSelect.innerHTML = '';
  alertaCheio.classList.add('hidden');
  campoHoraContainer.classList.remove('hidden');

  if (!dataInput) {
    horaSelect.innerHTML = '<option value="">Selecione primeiro uma data</option>';
    return;
  }

  // Trava de Domingo
  const dataObj = new Date(dataInput + 'T00:00:00');
  if (dataObj.getDay() === 0) {
    horaSelect.innerHTML = '<option value="">Fechado aos Domingos</option>';
    alert('A barbearia não abre aos domingos!');
    return;
  }

  const barbeiroNome = barbeiroSelect.options[barbeiroSelect.selectedIndex]?.text || "";
  const agendamentos = JSON.parse(localStorage.getItem('barbearia_agendamentos')) || [];
  
  // Calcula duração em minutos do corte selecionado (padrão 30 min caso não tenha escolhido)
  const duracaoCorteAtual = corteSelecionado ? (corteSelecionado.duracao || 30) : 30;

  const inicioDia = 7 * 60; // 07:00
  const fimDia = 18 * 60;   // 18:00

  let horariosLivresContador = 0;

  for (let min = inicioDia; min <= fimDia; min += 30) {
    const horaStr = minutosParaHora(min);
    const inicioNovo = min;
    const fimNovo = min + duracaoCorteAtual;

    // Se ultrapassar as 18h, não exibe
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
      horariosLivresContador++;
    }
  }

  // MENSAGEM DE DIA CHEIO
  if (horariosLivresContador === 0) {
    campoHoraContainer.classList.add('hidden');
    alertaCheio.classList.remove('hidden');
    const proximoDia = obterProximoDiaUtil(dataInput);
    sugestaoTexto.textContent = `Horário disponível só no dia ${proximoDia}`;
  }
}

// Salvar corte com tempo de duração (Horas + Minutos)
document.getElementById('btnSalvarCorte')?.addEventListener('click', () => {
  const nome = document.getElementById('corteNomeInput').value;
  const preco = parseFloat(document.getElementById('cortePrecoInput').value);
  const horas = parseInt(document.getElementById('corteHorasInput').value) || 0;
  const minutos = parseInt(document.getElementById('corteMinutosInput').value) || 0;

  const duracaoTotalMinutos = (horas * 60) + minutos;

  if (!nome || isNaN(preco) || duracaoTotalMinutos === 0) {
    alert("Por favor, preencha o nome, valor e informe um tempo de duração válido!");
    return;
  }

  // Lógica para salvar o corte na conta do barbeiro...
  alert(`Corte "${nome}" cadastrado com sucesso! Duração: ${duracaoTotalMinutos} minutos.`);
});

// Eventos de alteração
document.getElementById('dataAgendamento')?.addEventListener('change', atualizarHorariosDisponiveis);
document.getElementById('selectBarbeiro')?.addEventListener('change', atualizarHorariosDisponiveis);

// Finalizar Agendamento
document.getElementById('btnFinalizar')?.addEventListener('click', () => {
  const dataInput = document.getElementById('dataAgendamento').value;
  const horaInput = document.getElementById('horaAgendamento').value;
  const barbeiroSelect = document.getElementById('selectBarbeiro');
  const barbeiroNome = barbeiroSelect.options[barbeiroSelect.selectedIndex]?.text || "Não informado";

  if (!dataInput || !horaInput) {
    alert("Escolha uma data e um horário disponível!");
    return;
  }

  if (!corteSelecionado) {
    alert("Selecione um corte antes de finalizar!");
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

  alert(`Agendamento confirmado!\nBarbeiro: ${barbeiroNome}\nData: ${dataInput} às ${horaInput}`);
  atualizarHorariosDisponiveis();
});
    
