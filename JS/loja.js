const produtos = [
{
  nome:"Ração Premium Gold",
  preco:"R$ 189,90",
  categoria:"Ração",
  imagem:"https://plus.unsplash.com/premium_photo-1726761692986-6bcde87fc2b8?q=80&w=1200&auto=format&fit=crop",
  descricao:"Ração premium completa para cães adultos.",
  info:["15kg","Alta proteína","Vitaminas essenciais"]
},
{
  nome:"Ração para Filhotes",
  preco:"R$ 149,90",
  categoria:"Ração",
  imagem:"https://images.unsplash.com/photo-1565674244283-993fb27a215f?q=80&w=1200&auto=format&fit=crop",
  descricao:"Nutrição ideal para filhotes.",
  info:["10kg","Crescimento saudável","Ômega 3"]
},
{
  nome:"Brinquedo Mordedor",
  preco:"R$ 39,90",
  categoria:"Brinquedo",
  imagem:"https://images.unsplash.com/photo-1733861231038-f53687076f88?q=80&w=1200&auto=format&fit=crop",
  descricao:"Diversão garantida para cães.",
  info:["Resistente","Ajuda os dentes","Durável"]
},
{
  nome:"Bola Interativa",
  preco:"R$ 59,90",
  categoria:"Brinquedo",
  imagem:"https://images.unsplash.com/photo-1599867685938-9d7701a2d1ab?q=80&w=1200&auto=format&fit=crop",
  descricao:"Brinquedo inteligente para pets ativos.",
  info:["Som interno","Colorida","Alta resistência"]
},
{
  nome:"Coleira LED",
  preco:"R$ 49,90",
  categoria:"Acessório",
  imagem:"https://images.unsplash.com/photo-1627581480785-eb0b104c10e8?q=80&w=1200&auto=format&fit=crop",
  descricao:"Coleira iluminada para passeios noturnos.",
  info:["LED","Ajustável","Segura"]
},
{
  nome:"Peitoral Premium",
  preco:"R$ 79,90",
  categoria:"Acessório",
  imagem:"https://plus.unsplash.com/premium_photo-1668606763482-8dd2042c934e?q=80&w=1200&auto=format&fit=crop",
  descricao:"Conforto e segurança para seu pet.",
  info:["Confortável","Resistente","Ajustável"]
},
{
  nome:"Shampoo Pet",
  preco:"R$ 34,90",
  categoria:"Higiene",
  imagem:"https://images.unsplash.com/photo-1669281392832-9181a2b484af?q=80&w=1200&auto=format&fit=crop",
  descricao:"Limpeza suave e perfumada.",
  info:["pH balanceado","Cheiro agradável","250ml"]
},
{
  nome:"Tapete Higiênico",
  preco:"R$ 69,90",
  categoria:"Higiene",
  imagem:"https://images.unsplash.com/photo-1597674078063-87f8b9e336bc?q=80&w=1200&auto=format&fit=crop",
  descricao:"Alta absorção para o dia a dia.",
  info:["30 unidades","Anti odor","Super absorção"]
},
{
  nome:"Cama Ortopédica",
  preco:"R$ 259,90",
  categoria:"Conforto",
  imagem:"https://images.unsplash.com/photo-1492748046438-4b6d9ebe0c11?q=80&w=687&auto=format&fit=crop",
  descricao:"Conforto premium para descanso.",
  info:["Espuma ortopédica","Lavável","Grande"]
},
{
  nome:"Casinha Luxo",
  preco:"R$ 399,90",
  categoria:"Conforto",
  imagem:"https://images.unsplash.com/photo-1749703050879-ee1c2eb5d5e9?q=80&w=1200&auto=format&fit=crop",
  descricao:"Espaço confortável e bonito.",
  info:["Grande","Impermeável","Premium"]
}
];

const grid = document.getElementById("productsGrid");

function renderProdutos(lista){
  grid.innerHTML = "";
  lista.forEach(produto => {
    grid.innerHTML += `
    <div class="product-card-shop">
      <img src="${produto.imagem}">
      <div class="product-content">
        <span class="category-tag">${produto.categoria}</span>
        <h2>${produto.nome}</h2>
        <p>${produto.descricao}</p>
        <div class="price">${produto.preco}</div>
        <button class="buy-btn" onclick="toggleInfo(this)">Ver produto</button>
        <div class="product-info">
          <ul>
            ${produto.info.map(item => `<li>${item}</li>`).join("")}
          </ul>
          <button class="cart-btn" onclick='addToCart(${JSON.stringify(produto)})'>
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
    `;
  });
}

renderProdutos(produtos);

function filtrarProdutos(categoria){
  if(categoria === "Todos"){
    renderProdutos(produtos);
    return;
  }
  const filtrados = produtos.filter(produto => produto.categoria === categoria);
  renderProdutos(filtrados);
}

function toggleInfo(button){
  const info = button.nextElementSibling;
  info.classList.toggle("active");
}

// === LÓGICA DE PERSISTÊNCIA DO CARRINHO ===
// Tenta puxar o carrinho do LocalStorage. Se não tiver, cria vazio.
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function toggleCart(){
  document.getElementById("cartSidebar").classList.toggle("active");
}

function addToCart(produto){
  const itemExistente = carrinho.find(item => item.nome === produto.nome);
  if(itemExistente){
    itemExistente.quantidade++;
  } else {
    carrinho.push({ ...produto, quantidade:1 });
  }
  atualizarCarrinho();
}

function alterarQuantidade(nome, tipo){
  const item = carrinho.find(produto => produto.nome === nome);
  if(tipo === "mais"){
    item.quantidade++;
  }
  if(tipo === "menos"){
    item.quantidade--;
    if(item.quantidade <= 0){
      carrinho = carrinho.filter(produto => produto.nome !== nome);
    }
  }
  atualizarCarrinho();
}

function atualizarCarrinho(){
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  cartItems.innerHTML = "";
  let total = 0;
  let quantidadeTotal = 0;

  carrinho.forEach(produto => {
    const precoNumero = Number(produto.preco.replace("R$","").replace(".","").replace(",","."));
    total += precoNumero * produto.quantidade;
    quantidadeTotal += produto.quantidade;

    cartItems.innerHTML += `
    <div class="cart-item">
      <img src="${produto.imagem}">
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

  cartTotal.innerText = total.toLocaleString("pt-BR",{ style:"currency", currency:"BRL" });
  cartCount.innerText = quantidadeTotal;

  // SALVA NO LOCALSTORAGE SEMPRE QUE ATUALIZAR
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Renderiza o carrinho ao carregar a página da loja (para já mostrar o que estava salvo)
atualizarCarrinho();