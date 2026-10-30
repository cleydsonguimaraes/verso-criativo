/**
 * CONFIGURAÇÕES PRINCIPAIS DA LOJA
 * Altere o número abaixo para o seu WhatsApp oficial (apenas números, com 55 + DDD).
 */
const CONFIG = {
  whatsappNumero: "5581999999999",
  nomeLoja: "Verso Criativo",
  dominio: "versocriativo.com.br",
  chaveStorage: "verso_criativo_carrinho_v1"
};

let estado = {
  produtos: [],
  categoriaAtiva: "todos",
  termoBusca: "",
  produtoModalAtual: null,
  carrinho: []
};

// Formata valores para Real Brasileiro
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Inicialização da aplicação
document.addEventListener("DOMContentLoaded", async () => {
  carregarCarrinhoSalvo();
  await carregarProdutos();
  configurarEventos();
  atualizarInterfaceCarrinho();
  lucide.createIcons();
});

// Carrega os produtos do arquivo produtos.json
async function carregarProdutos() {
  const grid = document.getElementById("catalogo-grid");
  try {
    const resposta = await fetch("./data/produtos.json");
    if (!resposta.ok) throw new Error("Falha ao ler produtos.json");
    estado.produtos = await resposta.json();
    renderizarCatalogo();
  } catch (erro) {
    grid.innerHTML = `
      <div class="col-span-full bg-amber-50 border border-amber-200 rounded-2xl p-6 text-sm text-amber-900">
        <strong class="block font-bold mb-1">Atenção ao abrir localmente:</strong>
        Para que o navegador carregue o arquivo <strong>produtos.json</strong>, abra o projeto usando a extensão <strong>Live Server</strong> no VS Code (botão direito no index.html &rarr; Open with Live Server).
      </div>
    `;
  }
}

// Renderiza os cards filtrados por categoria e busca
function renderizarCatalogo() {
  const grid = document.getElementById("catalogo-grid");
  const termo = estado.termoBusca.trim().toLowerCase();

  const filtrados = estado.produtos.filter((item) => {
    const bateCategoria = estado.categoriaAtiva === "todos" || item.categoria === estado.categoriaAtiva;
    const bateBusca =
      !termo ||
      item.nome.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo) ||
      item.categoriaLabel.toLowerCase().includes(termo);
    return bateCategoria && bateBusca;
  });

  if (filtrados.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-200">
        <p class="text-slate-600 font-semibold">Nenhum personalizado encontrado para essa busca.</p>
        <button onclick="limparFiltros()" class="mt-3 text-xs font-bold text-pink-600 underline">Mostrar todos os produtos</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtrados
    .map(
      (prod) => `
      <article class="card-animate bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
        <div class="relative h-48 overflow-hidden bg-slate-100">
          <img src="${prod.imagem}" alt="${prod.nome}" loading="lazy" class="w-full h-full object-cover hover:scale-105 transition duration-300" />
          <span class="absolute top-3 left-3 bg-slate-900/85 backdrop-blur text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            ${prod.destaque}
          </span>
          <span class="absolute bottom-3 right-3 bg-white/95 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
            ⏱ ${prod.prazo}
          </span>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider text-pink-600">${prod.categoriaLabel}</span>
            <h3 class="font-bold text-slate-900 text-base mt-1 leading-snug">${prod.nome}</h3>
            <p class="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">${prod.descricao}</p>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div>
              <span class="block text-[11px] text-slate-400">${prod.unidade}</span>
              <strong class="text-lg font-extrabold text-slate-900">${formatarMoeda(prod.preco)}</strong>
            </div>
            <button
              onclick="abrirModalPersonalizacao('${prod.id}')"
              class="inline-flex items-center gap-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition active:scale-95"
            >
              Personalizar
            </button>
          </div>
        </div>
      </article>
    `
    )
    .join("");

  lucide.createIcons();
}

function limparFiltros() {
  estado.categoriaAtiva = "todos";
  estado.termoBusca = "";
  document.getElementById("input-busca").value = "";
  document.getElementById("input-busca-mobile").value = "";
  atualizarBotoesFiltro();
  renderizarCatalogo();
}

function atualizarBotoesFiltro() {
  document.querySelectorAll(".filtro-btn").forEach((btn) => {
    const ativo = btn.getAttribute("data-categoria") === estado.categoriaAtiva;
    btn.className = ativo
      ? "filtro-btn bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-full whitespace-nowrap transition"
      : "filtro-btn bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-bold px-4 py-2.5 rounded-full whitespace-nowrap transition";
  });
}

// Abre o modal de personalização de um item
function abrirModalPersonalizacao(produtoId) {
  const produto = estado.produtos.find((p) => p.id === produtoId);
  if (!produto) return;

  estado.produtoModalAtual = produto;

  document.getElementById("modal-categoria").textContent = produto.categoriaLabel;
  document.getElementById("modal-imagem").src = produto.imagem;
  document.getElementById("modal-titulo").textContent = produto.nome;
  document.getElementById("modal-preco").textContent = `${formatarMoeda(produto.preco)} (${produto.unidade})`;
  document.getElementById("modal-descricao").textContent = produto.descricao;

  const selectOpcao = document.getElementById("select-opcao");
  selectOpcao.innerHTML = produto.opcoes.map((op) => `<option value="${op}">${op}</option>`).join("");

  const inputBriefing = document.getElementById("input-briefing");
  inputBriefing.value = "";
  inputBriefing.placeholder = produto.placeholderBriefing;

  document.getElementById("input-quantidade").value = 1;
  document.getElementById("check-anexo").checked = false;

  const modal = document.getElementById("modal-produto");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function fecharModalPersonalizacao() {
  const modal = document.getElementById("modal-produto");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  estado.produtoModalAtual = null;
}

// Adiciona o item configurado ao carrinho
function confirmarAdicaoCarrinho() {
  const prod = estado.produtoModalAtual;
  if (!prod) return;

  const opcao = document.getElementById("select-opcao").value;
  const briefing = document.getElementById("input-briefing").value.trim() || "Definir detalhes pelo WhatsApp";
  const quantidade = Math.max(1, parseInt(document.getElementById("input-quantidade").value, 10) || 1);
  const enviaraArquivo = document.getElementById("check-anexo").checked;

  estado.carrinho.push({
    uid: Date.now().toString(),
    id: prod.id,
    nome: prod.nome,
    precoUnitario: prod.preco,
    quantidade,
    opcao,
    briefing,
    enviaraArquivo
  });

  salvarCarrinho();
  atualizarInterfaceCarrinho();
  fecharModalPersonalizacao();
  abrirCarrinho();
}

function removerItemCarrinho(uid) {
  estado.carrinho = estado.carrinho.filter((item) => item.uid !== uid);
  salvarCarrinho();
  atualizarInterfaceCarrinho();
}

function salvarCarrinho() {
  localStorage.setItem(CONFIG.chaveStorage, JSON.stringify(estado.carrinho));
}

function carregarCarrinhoSalvo() {
  try {
    const salvo = localStorage.getItem(CONFIG.chaveStorage);
    if (salvo) estado.carrinho = JSON.parse(salvo);
  } catch (e) {
    estado.carrinho = [];
  }
}

function atualizarInterfaceCarrinho() {
  const badge = document.getElementById("badge-carrinho");
  const lista = document.getElementById("lista-carrinho");
  const totalEl = document.getElementById("valor-total-carrinho");

  const totalItens = estado.carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  const valorTotal = estado.carrinho.reduce((acc, item) => acc + item.precoUnitario * item.quantidade, 0);

  badge.textContent = totalItens;
  totalEl.textContent = formatarMoeda(valorTotal);

  if (estado.carrinho.length === 0) {
    lista.innerHTML = `
      <div class="text-center py-12 text-slate-400 text-xs">
        Seu pedido ainda está vazio. Escolha os itens no catálogo e personalize com seu tema ou marca.
      </div>
    `;
    return;
  }

  lista.innerHTML = estado.carrinho
    .map(
      (item) => `
      <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1.5">
        <div class="flex items-start justify-between gap-2">
          <strong class="text-xs font-extrabold text-slate-900">${item.quantidade}x ${item.nome}</strong>
          <button onclick="removerItemCarrinho('${item.uid}')" class="text-slate-400 hover:text-rose-600 text-xs font-bold">Remover</button>
        </div>
        <p class="text-[11px] text-pink-600 font-semibold">Acabamento: ${item.opcao}</p>
        <p class="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100">Personalização: ${item.briefing}</p>
        ${item.enviaraArquivo ? `<span class="inline-block text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">📎 Enviará foto/logo no WhatsApp</span>` : ""}
        <div class="text-right text-xs font-extrabold text-slate-900 pt-1">
          Subtotal: ${formatarMoeda(item.precoUnitario * item.quantidade)}
        </div>
      </div>
    `
    )
    .join("");
}

function abrirCarrinho() {
  document.getElementById("drawer-carrinho").classList.remove("hidden");
}

function fecharCarrinho() {
  document.getElementById("drawer-carrinho").classList.add("hidden");
}

// Monta a mensagem formatada e redireciona para o WhatsApp
function enviarPedidoWhatsApp() {
  if (estado.carrinho.length === 0) {
    alert("Adicione pelo menos 1 item personalizado ao seu pedido antes de enviar.");
    return;
  }

  const nomeCliente = document.getElementById("cliente-nome").value.trim() || "Cliente do Site";
  const dataEvento = document.getElementById("cliente-data-evento").value.trim() || "A combinar";
  const total = estado.carrinho.reduce((acc, item) => acc + item.precoUnitario * item.quantidade, 0);

  let linhas = [
    `Olá, *${CONFIG.nomeLoja}*! Fiz meu pedido pelo site *${CONFIG.dominio}*:`,
    ``,
    `👤 *Cliente:* ${nomeCliente}`,
    `📅 *Data do Evento/Necessidade:* ${dataEvento}`,
    `------------------------------`
  ];

  estado.carrinho.forEach((item, index) => {
    linhas.push(`*${index + 1}. ${item.quantidade}x ${item.nome}*`);
    linhas.push(`   • Opção: ${item.opcao}`);
    linhas.push(`   • Personalização: ${item.briefing}`);
    if (item.enviaraArquivo) {
      linhas.push(`   • Anexo: Vou enviar a foto/logo aqui na conversa`);
    }
    linhas.push(`   • Subtotal: ${formatarMoeda(item.precoUnitario * item.quantidade)}`);
    linhas.push(``);
  });

  linhas.push(`------------------------------`);
  linhas.push(`💰 *Total Estimado:* ${formatarMoeda(total)} *(+ frete/retirada a confirmar)*`);
  linhas.push(`💳 Aguardo a confirmação do prazo e o *Link de Pagamento da InfinitePay*!`);

  const url = `https://wa.me/${CONFIG.whatsappNumero}?text=${encodeURIComponent(linhas.join("\n"))}`;
  window.open(url, "_blank");
}

// Registra os ouvintes de eventos da interface
function configurarEventos() {
  // Filtros de categoria
  document.querySelectorAll(".filtro-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      estado.categoriaAtiva = btn.getAttribute("data-categoria");
      atualizarBotoesFiltro();
      renderizarCatalogo();
    });
  });

  // Busca Desktop e Mobile
  const atualizarBusca = (e) => {
    estado.termoBusca = e.target.value;
    renderizarCatalogo();
  };
  document.getElementById("input-busca").addEventListener("input", atualizarBusca);
  document.getElementById("input-busca-mobile").addEventListener("input", atualizarBusca);

  // Controles do Modal
  document.getElementById("btn-fechar-modal").addEventListener("click", fecharModalPersonalizacao);
  document.getElementById("btn-cancelar-modal").addEventListener("click", fecharModalPersonalizacao);
  document.getElementById("btn-confirmar-item").addEventListener("click", confirmarAdicaoCarrinho);

  // Controles do Carrinho
  document.getElementById("btn-abrir-carrinho").addEventListener("click", abrirCarrinho);
  document.getElementById("btn-fechar-carrinho").addEventListener("click", fecharCarrinho);
  document.getElementById("drawer-overlay").addEventListener("click", fecharCarrinho);
  document.getElementById("btn-finalizar-whatsapp").addEventListener("click", enviarPedidoWhatsApp);

  // Botões diretos de WhatsApp (Hero e B2B)
  document.getElementById("btn-orcamento-rapido").addEventListener("click", () => {
    const msg = `Olá, *${CONFIG.nomeLoja}*! Vim pelo site ${CONFIG.dominio} e gostaria de tirar uma dúvida sobre personalizados.`;
    window.open(`https://wa.me/${CONFIG.whatsappNumero}?text=${encodeURIComponent(msg)}`, "_blank");
  });

  document.getElementById("btn-b2b-whatsapp").addEventListener("click", () => {
    const msg = `Olá, *${CONFIG.nomeLoja}*! Vim pelo site ${CONFIG.dominio} e gostaria de solicitar um orçamento corporativo (adesivos, sacolas ou calendários para empresa).`;
    window.open(`https://wa.me/${CONFIG.whatsappNumero}?text=${encodeURIComponent(msg)}`, "_blank");
  });
}