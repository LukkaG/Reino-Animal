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


const itensDoCarrinho = JSON.parse(localStorage.getItem('carrinhoReinoAnimal')) || [];
console.log("Conteúdo do carrinho no localStorage:", itensDoCarrinho);
const resumoSubtotal = document.getElementById('resumoSubtotal');
const resumoTotal = document.getElementById('resumoTotal');

if(itensDoCarrinho.length === 0) {
  alert("Seu carrinho está vazio! ...");
  window.location.href = "./loja.html";
}

let total = 0;
itensDoCarrinho.forEach(produto => {
    const preco = typeof produto.preco === 'number' ? produto.preco : parseFloat(produto.preco);
    total += preco * produto.quantidade;
});

const totalFormatado = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
resumoSubtotal.innerText = totalFormatado;
resumoTotal.innerText = totalFormatado;

document.getElementById('pagamentoForm').addEventListener('submit', async function(event) {
  event.preventDefault(); 
  const token = localStorage.getItem('tokenReinoAnimal');
  
  if (!token) {
      alert("Você precisa estar logado para finalizar a compra.");
      window.location.href = "./login.html";
      return;
  }
  try {
    const resposta = await fetch('/finalizar-compra', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
            itens: itensDoCarrinho,
            total: total
        })
    });

    if (resposta.ok) {
        localStorage.removeItem('carrinhoReinoAnimal');
        alert("✅ Pedido finalizado com sucesso e salvo no sistema!");
        window.location.href = "./Index.html";
    } else {
        const dadosErro = await resposta.json();
        alert("Erro ao finalizar: " + (dadosErro.erro || "Tente novamente"));
    }
  } catch (erro) {
    console.error("Erro na comunicação:", erro);
    alert("Erro ao conectar com o servidor.");
  }
});

function renderizarResumoItens() {
    const container = document.getElementById('resumo-itens-container');
    if (!container) return;

    container.innerHTML = '';

    itensDoCarrinho.forEach(produto => {
        container.innerHTML += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>${produto.quantidade}x ${produto.nome}</span>
                <span>R$ ${(produto.preco * produto.quantidade).toFixed(2).replace('.', ',')}</span>
            </div>
        `;
    });
}

renderizarResumoItens();