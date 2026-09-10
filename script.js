let corteSelecionado = null;

// Converter string "HH:MM" para minutos a partir da meia-noite
function horaParaMinutos(horaStr) {
  const [h, m] = horaStr.split(':').map(Number);
  return h * 60 + m;
}

// Converter minutos a partir da meia-noite para formato "HH:MM"
function minutosParaHora(minutos) {
  const h = Math.floor(minutos / 60).toString().padStart(2, '0');
  const m = (minutos % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

// Atualizar os horários disponíveis no <select> dinamicamente
function atualizarHorariosDisponiveis() {
  const dataInput = document.getElementById('dataAgendamento').value;
  const barbeiroSelect = document.getElementById('selectBarbeiro');
  const horaSelect = document.getElementById('horaAgendamento');
  
  horaSelect.innerHTML = '';

  if (!dataInput) {
    horaSelect.innerHTML = '<option value="">Selecione primeiro uma data</option>';
    return;
  }

  // Trava de Domingo
  const dataObj = new Date(dataInput + 'T00:00:00');
  if (dataObj.getDay() === 0) {
    horaSelect.innerHTML = '<option value="">Fechado aos Domingos</option>';
    alert('A barbearia não abre aos domingos. Por favor, escolha outra data!');
    return;
  }

  const barbeiroNome = barbeiroSelect.options[barbeiroSelect.selectedIndex]?.text || "";
  const agendamentos = JSON.parse(localStorage.getItem('barbearia_agendamentos')) || [];
  
  // Duração do corte atualmente selecionado (ou padrão 30 min)
  const duracaoCorteAtual = corteSelecionado ? (corteSelecionado.duracao || 30) : 30;

  // Gerar horários das 07:00 (420 min) até 18:00 (1080 min) a cada 30 min
  const inicioDia = 7 * 60;
  const fimDia = 18 * 60;

  let encontrouDisponivel = false;

  for (let min = inicioDia; min <= fimDia; min += 30) {
    const horaStr = minutosParaHora(min);
    const inicioNovo = min;
    const fimNovo = min + duracaoCorteAtual;

    // Verificar se este intervalo choca com algum agendamento do barbeiro na data
    const ocupado = agendamentos.some(item => {
      if (item.barbeiro !== barbeiroNome || item.data !== dataInput) return false;

      const inicioExistente = horaParaMinutos(item.hora);
      const duracaoExistente = item.duracao || 30;
      const fimExistente = inicioExistente + duracaoExistente;

      return (inicioNovo < fimExistente) && (fimNovo > inicioExistente);
    });

    const option = document.createElement('option');
    option.value = horaStr;

    if (ocupado) {
      option.textContent = `⌚ ${horaStr} (Ocupado)`;
      option.disabled = true;
    } else {
      option.textContent = `⌚ ${horaStr} - Disponível`;
      encontrouDisponivel = true;
    }

    horaSelect.appendChild(option);
  }

  if (!encontrouDisponivel) {
    horaSelect.innerHTML = '<option value="">Nenhum horário disponível para esta data</option>';
  }
}

// Event Listeners para recarregar horários
document.getElementById('dataAgendamento')?.addEventListener('change', atualizarHorariosDisponiveis);
document.getElementById('selectBarbeiro')?.addEventListener('change', atualizarHorariosDisponiveis);

// Evento de Finalizar Agendamento
document.getElementById('btnFinalizar')?.addEventListener('click', () => {
  const dataInput = document.getElementById('dataAgendamento').value;
  const horaInput = document.getElementById('horaAgendamento').value;
  const barbeiroSelect = document.getElementById('selectBarbeiro');
  const barbeiroNome = barbeiroSelect.options[barbeiroSelect.selectedIndex]?.text || "Não informado";

  if (!dataInput) {
    alert("Por favor, selecione uma data válida!");
    return;
  }

  if (!horaInput) {
    alert("Por favor, escolha um horário disponível!");
    return;
  }

  if (!corteSelecionado) {
    alert("Por favor, selecione um corte de cabelo antes de finalizar!");
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

  alert(`Agendamento confirmado com sucesso!\nBarbeiro: ${barbeiroNome}\nData: ${dataInput} às ${horaInput}\nDuração: ${duracao} min`);
  
  // Atualiza a lista de horários após o agendamento
  atualizarHorariosDisponiveis();
});
