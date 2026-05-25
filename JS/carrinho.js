let carrinho = JSON.parse(localStorage.getItem('carrinhoReinoAnimal')) || [];

function toggleCart() {
    const sidebar = document.getElementById("cartSidebar");
    if (sidebar) sidebar.classList.add("active"); // Adiciona a classe, não inverte (toggle)
}

// E na função de fechar (quando clicar no 'X' do carrinho), crie esta nova:
function closeCart() {
    const sidebar = document.getElementById("cartSidebar");
    if (sidebar) sidebar.classList.remove("active");
}

// 2. A NOVA FUNÇÃO: Recebe os dados diretamente do botão clicado
function adicionarAoCarrinho(botao) {
    // Extrai os dados que guardamos escondidos no botão HTML
    const id = botao.getAttribute('data-id');
    const nome = botao.getAttribute('data-nome');
    const preco = parseFloat(botao.getAttribute('data-preco')); // Já vem como número puro!
    const imagem = botao.getAttribute('data-imagem');

    const itemExistente = carrinho.find(item => item.id === id);
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ id, nome, preco, imagem, quantidade: 1 });
    }
    
    atualizarCarrinho();
    toggleCart(); // Abre o carrinho na hora para o utilizador ver
}

// 3. Atualiza usando o ID (seguro contra nomes repetidos)
function alterarQuantidade(id, tipo) {
    const item = carrinho.find(produto => produto.id === id);
    if (!item) return;

    if (tipo === "mais") item.quantidade++;
    if (tipo === "menos") item.quantidade--;

    if (item.quantidade <= 0) {
        carrinho = carrinho.filter(produto => produto.id !== id);
    }
    
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = "";
    let total = 0;
    let quantidadeTotal = 0;

    carrinho.forEach(produto => {
        total += produto.preco * produto.quantidade;
        quantidadeTotal += produto.quantidade;

        cartItems.innerHTML += `
        <div class="cart-item">
          <img src="${produto.imagem || 'https://via.placeholder.com/150'}">
          <div class="cart-item-info">
            <h4>${produto.nome}</h4>
            <p>R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
            <div class="quantity-controls">
              <button onclick="alterarQuantidade('${produto.id}', 'menos')">-</button>
              <span>${produto.quantidade}</span>
              <button onclick="alterarQuantidade('${produto.id}', 'mais')">+</button>
            </div>
          </div>
        </div>
        `;
    });

    cartTotal.innerText = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
    if (cartCount) cartCount.innerText = quantidadeTotal;

    localStorage.setItem('carrinhoReinoAnimal', JSON.stringify(carrinho));
}

// Quando a página carregar, desenha o carrinho
document.addEventListener('DOMContentLoaded', atualizarCarrinho);