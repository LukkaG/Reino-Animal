let carrinho = JSON.parse(localStorage.getItem('carrinhoReinoAnimal')) || [];

document.getElementById('iconeUsuario').addEventListener('click', function(event) {
    event.preventDefault();
    
    const token = localStorage.getItem('tokenReinoAnimal');

    if (token) {
        // Se estiver logado, pergunta se quer sair
        const confirmar = confirm("Deseja sair da sua conta?");
        if (confirmar) {
            localStorage.removeItem('tokenReinoAnimal');
            localStorage.removeItem('carrinhoReinoAnimal'); // Limpa o carrinho ao sair
            alert("Você saiu com sucesso!");
            window.location.href = "./Index.html";
        }
    } else {
        // Se não estiver logado, leva para o login
        window.location.href = "./login.html";
    }
});

function toggleCart() {
    const sidebar = document.getElementById("cartSidebar");
    if (sidebar) sidebar.classList.add("active");
}

function closeCart() {
    const sidebar = document.getElementById("cartSidebar");
    if (sidebar) sidebar.classList.remove("active");
}

function adicionarAoCarrinho(botao) {
    const id = botao.getAttribute('data-id');
    const nome = botao.getAttribute('data-nome');
    const preco = parseFloat(botao.getAttribute('data-preco'));
    const imagem = botao.getAttribute('data-imagem');

    const itemExistente = carrinho.find(item => item.id === id);
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ id, nome, preco, imagem, quantidade: 1 });
    }
    
    atualizarCarrinho();
    toggleCart();
}

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

document.addEventListener('DOMContentLoaded', atualizarCarrinho);