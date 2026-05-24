document.getElementById('agendamentoForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Evita que a página recarregue

  // Coleta os dados do formulário
  const nomePet = document.getElementById('nomePet').value;
  const tipoServico = document.getElementById('tipoServico').value;
  const dataAgendamento = document.getElementById('dataAgendamento').value;
  const horaAgendamento = document.getElementById('horaAgendamento').value;
  const observacoes = document.getElementById('observacoes').value;

  // Monta o objeto (Isso aqui é o que seria convertido em JSON para enviar pro back-end)
  const payloadAgendamento = {
    pet: nomePet,
    servico: tipoServico,
    data: dataAgendamento,
    hora: horaAgendamento,
    obs: observacoes
  };

  // Simulação no console para mostrar na apresentação/documentação
  console.log("JSON pronto para envio HTTP POST:", JSON.stringify(payloadAgendamento));

  // Feedback para o usuário
  alert(`✅ Agendamento de ${tipoServico} para o pet ${nomePet} confirmado para o dia ${dataAgendamento} às ${horaAgendamento}!`);
  
  // Limpa o formulário
  this.reset();
});