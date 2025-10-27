// --- Seleção de Elementos do DOM ---
// Usamos 'const' pois essas referências não vão mudar.
const productListContainer = document.getElementById('product-list');
const loadingIndicator = document.getElementById('loading');

// URL da API pública de produtos
const API_URL = 'https://fakestoreapi.com/products';

/**
 * Responsabilidade: Buscar os dados dos produtos na Fake Store API.
 * Utiliza async/await para um código assíncrono mais limpo.
 */
async function fetchProducts() {
    // Exibe o indicador de "carregando" antes de iniciar a busca
    loadingIndicator.classList.remove('hidden');
    
    try {
        // 1. Faz a requisição para a API usando fetch()
        const response = await fetch(API_URL);

        // 2. Verifica se a resposta da rede foi bem-sucedida
        if (!response.ok) {
            // Se a resposta não for 'ok' (ex: erro 404, 500), lança um erro
            throw new Error(`Erro na rede: ${response.statusText}`);
        }

        // 3. Converte a resposta em JSON
        const products = await response.json();

        // 4. Chama a função de exibição, passando os dados
        displayProducts(products);

    } catch (error) {
        // 5. Captura qualquer erro (de rede ou de JSON)
        console.error('Falha ao buscar produtos:', error);
        // Exibe uma mensagem de erro amigável para o usuário
        productListContainer.innerHTML = '<p class="error-message">Não foi possível carregar os produtos. Tente novamente mais tarde.</p>';
    } finally {
        // 6. 'finally' sempre executa, ocorrendo erro ou não.
        // Esconde o indicador de "carregando"
        loadingIndicator.classList.add('hidden');
    }
}

/**
 * Responsabilidade: Receber um array de produtos e exibi-los no DOM.
 * @param {Array} products - O array de objetos de produtos vindo da API.
 */
function displayProducts(products) {
    // Limpa o container caso já tenha algo (ex: mensagem de erro)
    productListContainer.innerHTML = '';

    // 1. Itera sobre cada produto usando forEach
    products.forEach(product => {
        
        // 2. Formata o preço para o padrão BRL (R$ XX,XX)
        const formattedPrice = product.price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        // 3. Cria o HTML de cada card usando Template Literals (``)
        // Isso é mais legível do que criar elemento por elemento (document.createElement)
        const productCardHTML = `
            <article class="product-card">
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p class="price">${formattedPrice}</p>
                <p class="description">${product.description}</p>
                <button>Adicionar ao Carrinho</button>
            </article>
        `;

        // 4. Insere o HTML do novo card dentro do container grid
        // 'insertAdjacentHTML' é eficiente para adicionar strings HTML
        productListContainer.insertAdjacentHTML('beforeend', productCardHTML);
    });
}


// --- Ponto de Entrada da Aplicação ---
// Adiciona um 'escutador' que espera o HTML ser totalmente carregado
// para então executar a função fetchProducts.
document.addEventListener('DOMContentLoaded', fetchProducts);


// --- Reflexão sobre Clean Code (Requisito da Atividade) ---
/*
    ====================================================================
    REFLEXÃO SOBRE APLICAÇÃO DO CLEAN CODE
    ====================================================================

    1. Como apliquei os princípios do Clean Code neste projeto:
    
    * Nomes Significativos: Tentei usar nomes claros e que revelam a intenção. 
        Por exemplo, `fetchProducts` (busca produtos), `displayProducts` (exibe produtos),
        `productListContainer` (o container da lista de produtos).
    
    * Separação de Responsabilidades (SRP - Single Responsibility Principle):
        Criei duas funções principais: `fetchProducts` e `displayProducts`.
        A responsabilidade de `fetchProducts` é *apenas* buscar os dados e tratar erros da API.
        A responsabilidade de `displayProducts` é *apenas* pegar esses dados e formatá-los para o HTML.
        Uma não sabe sobre a implementação interna da outra.
    
    * Funções Pequenas: As funções fazem uma coisa só. `fetchProducts` não manipula o DOM 
        (exceto pelo loading) e `displayProducts` não faz chamadas de rede.
    
    * Evitar "Números Mágicos": A URL da API foi colocada em uma constante `API_URL` no topo,
        em vez de estar "solta" dentro da função fetch.
    
    * Comentários Úteis: Adicionei comentários que explicam o "porquê" de certas decisões
        (ex: por que usar `async/await`, por que o `finally`) em vez de 
        comentários óbvios (ex: `// itera sobre os produtos`).

    2. O que ainda pode melhorar:

    * Manipulação de DOM mais Robusta: Eu usei `innerHTML` e `insertAdjacentHTML` por simplicidade.
        Em um projeto maior, seria melhor criar os elementos do DOM (com `document.createElement`)
        para evitar potenciais falhas de segurança (XSS), embora aqui seja seguro pois os dados
        da API são confiáveis.
    
    * Modularização: Em um projeto real, eu separaria o código em módulos JavaScript (ESM).
        Por exemplo, um `apiService.js` (só com o fetch) e um `ui.js` (só com o display).
    
    * Tratamento de Erro (UX): O tratamento de erro está no console e com uma mensagem simples.
        Poderíamos ter um componente visual de "erro" mais elaborado para o usuário.
*/