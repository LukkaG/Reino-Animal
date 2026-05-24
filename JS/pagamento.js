// Controle visual dos botões de pagamento (Cards Cartão x Pix)
const radiosPagamento = document.querySelectorAll('input[name="pagamento"]');
const divDadosCartao = document.getElementById('dadosCartao');
const labelCartao = document.getElementById('labelCartao');
const labelPix = document.getElementById('labelPix');
const inputsCartao = divDadosCartao.querySelectorAll('input[type="text"]');

radiosPagamento.forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (e.target.value === 'pix') {
      divDadosCartao.style.display = 'none';
      inputsCartao.forEach(input => input.removeAttribute('required'));
      labelPix.style.borderColor = '#16a34a';
      labelPix.style.background = '#f0fdf4';
      labelCartao.style.borderColor = '#e4e4e7';
      labelCartao.style.background = '#fff';
    } else {
      divDadosCartao.style.display = 'block';
      inputsCartao.forEach(input => input.setAttribute('required', 'true'));
      labelCartao.style.borderColor = '#16a34a';
      labelCartao.style.background = '#f0fdf4';
      labelPix.style.borderColor = '#e4e4e7';
      labelPix.style.background = '#fff';
    }
  });
});

// === LÓGICA DE PERSISTÊNCIA DO CARRINHO (LOCALSTORAGE) ===
const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
const resumoSubtotal = document.getElementById('resumoSubtotal');
const resumoTotal = document.getElementById('resumoTotal');

// Se o carrinho estiver vazio, manda o cara de volta pra loja
if(carrinho.length === 0) {
  alert("Seu carrinho está vazio! Adicione produtos antes de finalizar a compra.");
  window.location.href = "./loja.html";
}

// Calcula o total puxando os dados reais dos produtos salvos
let total = 0;
carrinho.forEach(produto => {
  const precoNumero = Number(produto.preco.replace("R$","").replace(".","").replace(",","."));
  total += precoNumero * produto.quantidade;
});

const totalFormatado = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
resumoSubtotal.innerText = totalFormatado;
resumoTotal.innerText = totalFormatado;

// === FINALIZAÇÃO DO PEDIDO ===
document.getElementById('pagamentoForm').addEventListener('submit', function(event) {
  event.preventDefault(); 

  const metodoSelecionado = document.querySelector('input[name="pagamento"]:checked').value;
  const endereco = document.getElementById('endereco').value;

  if (metodoSelecionado === 'pix') {
    alert(`✅ Pedido de ${totalFormatado} confirmado via Pix! A chave/QR Code foi enviada para o seu e-mail. Entrega: ${endereco}`);
  } else {
    const tipoCartao = document.querySelector('input[name="tipoCartao"]:checked').value;
    alert(`✅ Pagamento de ${totalFormatado} aprovado no Cartão de ${tipoCartao.toUpperCase()}! Entrega: ${endereco}`);
  }

  // Limpa o carrinho do navegador após a compra e volta pro início!
  localStorage.removeItem('carrinho');
  window.location.href = "./mainreino.html";
});