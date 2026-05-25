let todasAsRacas = [];
const grid = document.getElementById("breedsGrid");

// 1. FUNÇÃO PARA BUSCAR DO MONGODB (BACK-END)
async function carregarRacas() {
    try {
        const resposta = await fetch('/racas');
        todasAsRacas = await resposta.json();
        renderRacas(todasAsRacas);
    } catch (err) {
        console.error('Erro ao conectar com o banco de dados:', err);
        grid.innerHTML = "<p>Erro ao carregar as raças.</p>";
    }
}

// 2. FUNÇÃO PARA RENDERIZAR OS CARDS MANTENDO A SUA ESTRUTURA
function renderRacas(listaRacas) {
    grid.innerHTML = ""; // Limpa o grid antes de renderizar

    if (!listaRacas || listaRacas.length === 0) {
        grid.innerHTML = "<p>Nenhuma raça encontrada.</p>";
        return;
    }

    listaRacas.forEach(raca => {
        grid.innerHTML += `
        <div class="breed-card">
            <img src="${raca.imagem || 'https://via.placeholder.com/150'}" alt="${raca.nomeRaca}">
            
            <div class="breed-content">
                <span class="${raca.classe}">
                    ${raca.tipo}
                </span>
                
                <h2>${raca.nomeRaca}</h2>
                <p>${raca.descricao}</p>
                
                <div class="breed-details">
                    <span>${raca.porte}</span>
                    <span>${raca.expectativaVida}</span>
                </div>

                <button class="info-btn" onclick="toggleInfo(this)">
                    Ver mais informações
                </button>

                <div class="more-info" style="display: none;">
                    <h3>Cuidados</h3>
                    <ul>
                        ${raca.cuidados && raca.cuidados.length > 0 ? raca.cuidados.map(item => `<li>${item}</li>`).join("") : "<li>Não informado</li>"}
                    </ul>

                    <h3>Dicas</h3>
                    <ul>
                        ${raca.dicas && raca.dicas.length > 0 ? raca.dicas.map(item => `<li>${item}</li>`).join("") : "<li>Não informado</li>"}
                    </ul>
                </div>
            </div>
        </div>
        `;
    });
}

// 3. A FUNÇÃO ACORDEÃO (A mesma lógica blindada da Loja)
function toggleInfo(botaoClicado) {
    const caixaAtual = botaoClicado.nextElementSibling;
    const estavaAberta = caixaAtual.style.display === "block";

    // 1. FECHA TODAS as caixas de informações
    document.querySelectorAll('.breed-card .more-info').forEach(caixa => {
        caixa.style.display = "none";
    });
    
    // 2. RESETA o texto de todos os botões
    document.querySelectorAll('.breed-card .info-btn').forEach(btn => {
        btn.innerText = "Ver mais informações";
    });

    // 3. ABRE apenas a caixa que foi clicada (se já não estivesse aberta)
    if (!estavaAberta) {
        caixaAtual.style.display = "block";
        botaoClicado.innerText = "Fechar informações";
    }
}

// 4. Inicializa a página buscando as raças no banco de dados
carregarRacas();

// 5. SISTEMA DE FILTROS (Cães / Gatos)
function filtrarRacas(tipoSelecionado) {
    if (tipoSelecionado === 'Todos') {
        // Se escolheu "Todos", desenha a lista completa original
        renderRacas(todasAsRacas);
    } else {
        // Se escolheu Cão ou Gato, filtra a lista procurando pela palavra
        const racasFiltradas = todasAsRacas.filter(raca => {
            return raca.tipo.includes(tipoSelecionado);
        });
        
        // Desenha na tela apenas a lista filtrada
        renderRacas(racasFiltradas);
    }
}