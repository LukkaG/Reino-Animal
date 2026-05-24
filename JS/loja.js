let todosOsProdutos = []; // Lista global que guardará os produtos vindos do MongoDB
const productsGrid = document.getElementById('productsGrid');
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// 2. FUNÇÃO PARA RENDERIZAR OS CARDS NA TELA
function renderProdutos(listaDeProdutos) {
    productsGrid.className = "product-grid"; 
    productsGrid.innerHTML = ""; 

    if (!listaDeProdutos || listaDeProdutos.length === 0) {
        productsGrid.innerHTML = "<p>Nenhum produto disponível nesta categoria.</p>";
        return;
    }

    listaDeProdutos.forEach((produto, index) => {
        const listaAtributos = produto.atributos && produto.atributos.length > 0
            ? produto.atributos.map(item => `<li>${item}</li>`).join("")
            : "<li>Informações indisponíveis</li>";

        productsGrid.innerHTML += `
            <div class="product-card">
                <span class="tag">${produto.categoria}</span>
                <img src="${produto.imagem || 'https://via.placeholder.com/150'}" alt="${produto.nomeProduto}">
                
                <h3>${produto.nomeProduto}</h3>
                <p style="padding: 0 20px; text-align: left; color: #55715f; font-size: 0.95rem;">${produto.descricao}</p>
                <span class="price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                
                <button id="btn-${index}" class="info-btn" onclick="toggleInfo(${index})">Ver produto</button>
                
                <div id="info-${index}" class="more-info" style="display: none; background: #f0fdf4; margin: 0 20px 20px; padding: 15px; border-radius: 14px; text-align: left;">
                    <ul style="margin: 0 0 15px 0; padding-left: 20px; color: #14532d; font-size: 0.95rem;">
                        ${listaAtributos}
                    </ul>
                    
                    <button class="add-to-cart-btn" onclick="addToCartById('${produto._id}')" style="width: 100%; margin: 0; padding: 10px;">
                        Adicionar ao carrinho
                    </button>
                </div>
            </div>
        `;
    });
}

// 3. CONTROLE DA JANELA DE INFORMAÇÕES (ISOLADO)
function toggleInfo(index) {
    // Busca exatamente a caixinha e o botão daquele número
    const infoContainer = document.getElementById(`info-${index}`);
    const button = document.getElementById(`btn-${index}`);
    
    // Segurança caso o elemento não exista
    if (!infoContainer) return;

    // Se estiver escondido, mostra. Se estiver mostrando, esconde.
    if (infoContainer.style.display === "none" || infoContainer.style.display === "") {
        infoContainer.style.display = "block";
        if (button) button.innerText = "Fechar detalhes";
    } else {
        infoContainer.style.display = "none";
        if (button) button.innerText = "Ver produto";
    }
}
// 4. BUSCA OS PRODUTOS DIRETO DA API DO BACK-END (MONGO DB)
async function carregarProdutos() {
    try {
        const resposta = await fetch('http://localhost:3000/produtos');
        todosOsProdutos = await resposta.json();
        
        renderProdutos(todosOsProdutos);
    } catch (err) {
        console.error('Erro ao conectar com o servidor da loja:', err);
        productsGrid.innerHTML = "<p>Erro ao carregar a loja. Verifique se o servidor está ativo.</p>";
    }
}

// 5. FILTRAGEM DE PRODUTOS (SEM REQUISIÇÃO EXTRA)
function filtrarProdutos(categoriaSelecionada) {
    if (categoriaSelecionada === 'Todos') {
        renderProdutos(todosOsProdutos);
    } else {
        const produtosFiltrados = todosOsProdutos.filter(produto => {
            return produto.categoria === categoriaSelecionada;
        });
        renderProdutos(produtosFiltrados);
    }
}

// 6. SISTEMA DO CARRINHO DE COMPRAS
function toggleCart() {
    document.getElementById("cartSidebar").classList.toggle("active");
}

function addToCartById(idProduto) {
    const produtoEncontrado = todosOsProdutos.find(p => p._id === idProduto);
    if (produtoEncontrado) {
        const itemCarrinho = {
            nome: produtoEncontrado.nomeProduto,
            preco: `R$ ${produtoEncontrado.preco.toFixed(2).replace('.', ',')}`,
            imagem: produtoEncontrado.imagem
        };
        
        const itemExistente = carrinho.find(item => item.nome === itemCarrinho.nome);
        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            // CORREÇÃO AQUI: Removida a palavra solta 'House' que causava erro de sintaxe
            carrinho.push({ ...itemCarrinho, quantidade: 1 });
        }
        atualizarCarrinho();
    }
}

function alterarQuantidade(nome, tipo) {
    const item = carrinho.find(produto => produto.nome === nome);
    if (!item) return;

    if (tipo === "mais") {
        item.quantidade++;
    }
    if (tipo === "menos") {
        item.quantidade--;
        if (item.quantidade <= 0) {
            carrinho = carrinho.filter(produto => produto.nome !== nome);
        }
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
        const precoNumero = Number(produto.preco.replace("R$", "").replace(/\./g, "").replace(",", "."));
        total += precoNumero * produto.quantidade;
        quantidadeTotal += produto.quantidade;

        cartItems.innerHTML += `
        <div class="cart-item">
          <img src="${produto.imagem || 'https://via.placeholder.com/150'}">
          <div class="cart-item-info">
            <h4>${produto.nome}</h4>
            <p>${produto.preco}</p>
            <div class="quantity-controls">
              <button onclick="alterarQuantidade('${produto.nome}','menos')">-</button>
              <span>${produto.quantidade}</span>
              <button onclick="alterarQuantidade('${produto.nome}','mais')">+</button>
            </div>
          </div>
        </div>
        `;
    });

    cartTotal.innerText = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    if (cartCount) cartCount.innerText = quantidadeTotal;

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// 7. INICIALIZAÇÃO DA PÁGINA
carregarProdutos();
atualizarCarrinho();