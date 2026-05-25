let todosOsProdutos = []; // Lista global que guardará os produtos vindos do MongoDB
const productsGrid = document.getElementById('productsGrid');

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
                
                <button class="info-btn" onclick="toggleInfo(this)">Ver produto</button>
                
                <div class="more-info" style="display: none; background: #f0fdf4; margin: 0 20px 20px; padding: 15px; border-radius: 14px; text-align: left;">
                    <ul style="margin: 0 0 15px 0; padding-left: 20px; color: #14532d; font-size: 0.95rem;">
                        ${listaAtributos}
                    </ul>
                    
                    <button class="add-to-cart-btn" 
                        data-id="${produto._id}" 
                        data-nome="${produto.nomeProduto}" 
                        data-preco="${produto.preco}" 
                        data-imagem="${produto.imagem}" 
                        onclick="adicionarAoCarrinho(this)" 
                        style="width: 100%; margin: 0; padding: 10px;">
                        Adicionar ao carrinho
                    </button>
                </div>
            </div>
        `;
    });
}

// 3. CONTROLE DA JANELA DE INFORMAÇÕES (ISOLADO)
function toggleInfo(botaoClicado) {
    // Pega a caixa verde logo abaixo do botão clicado
    const caixaAtual = botaoClicado.nextElementSibling;
    
    // Checa se a caixa que acabamos de clicar JÁ estava aberta
    const estavaAberta = caixaAtual.style.display === "block";

    // 1. FECHA TODAS: Varre a tela escondendo todas as caixas e resetando os botões
    document.querySelectorAll('.more-info').forEach(caixa => {
        caixa.style.display = "none";
    });
    document.querySelectorAll('.info-btn').forEach(btn => {
        btn.innerText = "Ver produto";
    });

    // 2. ABRE A CLICADA: Se a caixa que você clicou estava fechada, abre ela agora
    if (!estavaAberta) {
        caixaAtual.style.display = "block";
        botaoClicado.innerText = "Fechar detalhes";
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

carregarProdutos();