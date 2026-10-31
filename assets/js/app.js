/**
 * CONFIGURAÇÕES PRINCIPAIS DA LOJA - VERSO CRIATIVO
 */
const CONFIG = {
  whatsappNumero: "5581999999999",
  nomeLoja: "Verso Criativo",
  dominio: "versocriativo.com.br",
  chaveStorage: "verso_criativo_carrinho_v1",
  tempoCarrosselMs: 5000
};

// Banners Promocionais do Carrossel Inicial
const BANNERS_PROMO = [
  {
    categoriaAlvo: "festas",
    selo: "🔥 Promoção de Festas & Mesversário",
    titulo: "Kits de Festa Personalizados em Qualquer Tema",
    subtitulo: "De Patrulha Canina e Casa Mágica da Gabby a temas adultos: caixinhas 3D, sacolinhas e topo de bolo em papel fotográfico 180g.",
    cta: "Ver Kits de Festas",
    gradiente: "from-[#0B224C] via-[#2B3AE6] to-[#7B2CBF]",
    imagem: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80"
  },
  {
    categoriaAlvo: "pets",
    selo: "🐾 Novidade • Linha PETs",
    titulo: "Au-niversário, Miau-versário e Papelaria Pet Shop",
    subtitulo: "Comemore o aniversário do seu melhor amigo com topo de bolo com foto do Pet, chapéuzinho e caixinhas para petiscos!",
    cta: "Explorar Linha PETs",
    gradiente: "from-[#0B224C] via-[#7B2CBF] to-[#D82B87]",
    imagem: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80"
  },
  {
    categoriaAlvo: "volta-aulas",
    selo: "🎒 Volta às Aulas Organizada",
    titulo: "Etiquetas Escolares Laváveis & Tags de Mochila",
    subtitulo: "Identifique todo o material escolar com etiquetas resistentes à água, chaveiros plastificados rígidos e jogos educativos.",
    cta: "Ver Kits Escolares",
    gradiente: "from-[#0B224C] via-[#0088FF] to-[#2B3AE6]",
    imagem: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80"
  },
  {
    categoriaAlvo: "empresas",
    selo: "🏢 Soluções B2B • Para Empresas",
    titulo: "Destaque sua Marca em Cada Entrega",
    subtitulo: "Adesivos com recorte eletrônico, sacolas personalizadas, lacres de segurança e calendários corporativos 2027.",
    cta: "Ver Linha Corporativa",
    gradiente: "from-[#0B224C] via-[#2B3AE6] to-[#0088FF]",
    imagem: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=900&q=80"
  },
  {
    categoriaAlvo: "natal",
    selo: "🎄 Especial Fim de Ano",
    titulo: "Bolinhas Natalinas com Foto & Lembranças",
    subtitulo: "Eternize momentos na árvore de Natal da família e presenteie com caixinhas temáticas para mini panetones e doces.",
    cta: "Ver Especial de Natal",
    gradiente: "from-[#0B224C] via-[#D82B87] to-[#F47B3E]",
    imagem: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=900&q=80"
  }
];

// Metadados de cada departamento para manter a vitrine organizada
const INFO_CATEGORIAS = {
  festas: {
    titulo: "🎂 Festas & Mesversário",
    descricao: "Kits completos, caixinhas 3D, sacolinhas e topos de bolo personalizados com o tema da sua comemoração."
  },
  pets: {
    titulo: "🐾 Linha PETs (Festas Pet & Pet Shops)",
    descricao: "Kits de Au-niversário e Miau-versário com foto do seu Pet, além de tags e adesivos para Banho & Tosa."
  },
  "volta-aulas": {
    titulo: "🎒 Volta às Aulas & Pedagógicos",
    descricao: "Etiquetas escolares em vinil lavável, tags plastificadas para mochila e jogos educativos personalizados."
  },
  empresas: {
    titulo: "🏢 Papelaria Corporativa (Para Empresas)",
    descricao: "Adesivos em recorte eletrônico, sacolas personalizadas, tags de unboxing e calendários de mesa 2027."
  },
  natal: {
    titulo: "🎄 Especial de Natal & Fim de Ano",
    descricao: "Bolinhas acrílicas com foto da família, caixas para mini panetone e topos de bolo natalinos em lamicote."
  },
  todos: {
    titulo: "✨ Todos os Produtos do Catálogo",
    descricao: "Visualizando todos os departamentos juntos. Use as abas acima para filtrar por ocasião."
  }
};

let estado = {
  produtos: [],
  categoriaAtiva: "festas", // Começa em Festas para não misturar tudo na tela inicial
  subtemaAtivo: "Todos",
  termoBusca: "",
  produtoModalAtual: null,
  carrinho: [],
  slideAtual: 0,
  intervaloCarrossel: null
};

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

document.addEventListener("DOMContentLoaded", async () => {
  carregarCarrinhoSalvo();
  iniciarCarrossel();
  await carregarProdutos();
  configurarEventos();
  atualizarBotoesFiltro();
  atualizarInterfaceCarrinho();
  lucide.createIcons();
});

// ================= LÓGICA DO CARROSSEL PROMOCIONAL =================
function iniciarCarrossel() {
  renderizarSlideCarrossel();
  iniciarAutoPlayCarrossel();

  const container = document.getElementById("hero-carousel");
  container.addEventListener("mouseenter", pararAutoPlayCarrossel);
  container.addEventListener("mouseleave", iniciarAutoPlayCarrossel);

  document.getElementById("carousel-prev").addEventListener("click", () => {
    estado.slideAtual = (estado.slideAtual - 1 + BANNERS_PROMO.length) % BANNERS_PROMO.length;
    renderizarSlideCarrossel();
  });

  document.getElementById("carousel-next").addEventListener("click", () => {
    estado.slideAtual = (estado.slideAtual + 1) % BANNERS_PROMO.length;
    renderizarSlideCarrossel();
  });
}

function iniciarAutoPlayCarrossel() {
  pararAutoPlayCarrossel();
  estado.intervaloCarrossel = setInterval(() => {
    estado.slideAtual = (estado.slideAtual + 1) % BANNERS_PROMO.length;
    renderizarSlideCarrossel();
  }, CONFIG.tempoCarrosselMs);
}

function pararAutoPlayCarrossel() {
  if (estado.intervaloCarrossel) {
    clearInterval(estado.intervaloCarrossel);
    estado.intervaloCarrossel = null;
  }
}

function irParaSlide(indice) {
  estado.slideAtual = indice;
  renderizarSlideCarrossel();
}

function renderizarSlideCarrossel() {
  const banner = BANNERS_PROMO[estado.slideAtual];
  const slidesEl = document.getElementById("carousel-slides");
  const dotsEl = document.getElementById("carousel-dots");

  slidesEl.innerHTML = `
    <div class="card-animate bg-gradient-to-r ${banner.gradiente} p-6 sm:p-10 lg:px-16 lg:py-12 min-h-[340px] sm:min-h-[380px] grid lg:grid-cols-12 gap-8 items-center">
      <div class="lg:col-span-7 space-y-4 text-white z-10">
        <span class="inline-block bg-white/15 backdrop-blur border border-white/25 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full">
          ${banner.selo}
        </span>
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
          ${banner.titulo}
        </h1>
        <p class="text-slate-100 text-sm sm:text-base max-w-xl leading-relaxed">
          ${banner.subtitulo}
        </p>
        <div class="pt-2 flex flex-wrap gap-3">
          <button
            onclick="irParaCategoria('${banner.categoriaAlvo}')"
            class="inline-flex items-center gap-2 bg-white text-vc-navy hover:bg-vc-coral hover:text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-lg transition"
          >
            ${banner.cta}
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
          <button
            onclick="abrirWhatsAppRapido()"
            class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-full transition"
          >
            <i data-lucide="message-circle" class="w-4 h-4"></i>
            Falar no WhatsApp
          </button>
        </div>
      </div>

      <div class="hidden lg:block lg:col-span-5">
        <div class="relative mx-auto max-w-sm">
          <div class="absolute -inset-2 rounded-3xl bg-gradient-marca opacity-60 blur-lg"></div>
          <img
            src="${banner.imagem}"
            alt="${banner.titulo}"
            class="relative w-full h-64 object-cover rounded-3xl border-2 border-white/30 shadow-2xl"
          />
        </div>
      </div>
    </div>
  `;

  dotsEl.innerHTML = BANNERS_PROMO.map(
    (_, idx) => `
      <button
        onclick="irParaSlide(${idx})"
        aria-label="Ir para banner ${idx + 1}"
        class="${
          idx === estado.slideAtual
            ? "w-8 bg-vc-coral"
            : "w-2.5 bg-white/40 hover:bg-white/70"
        } h-2.5 rounded-full transition-all duration-300"
      ></button>
    `
  ).join("");

  lucide.createIcons();
}

// ================= NAVEGAÇÃO POR CATEGORIAS E SUBTEMAS =================
function irParaCategoria(categoria) {
  estado.categoriaAtiva = categoria;
  estado.subtemaAtivo = "Todos";
  estado.termoBusca = "";
  document.getElementById("input-busca").value = "";
  document.getElementById("input-busca-mobile").value = "";

  atualizarBotoesFiltro();
  renderizarCatalogo();

  document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
}

function selecionarSubtema(subtema) {
  estado.subtemaAtivo = subtema;
  renderizarCatalogo();
}

async function carregarProdutos() {
  const grid = document.getElementById("catalogo-grid");
  try {
    const resposta = await fetch("./data/produtos.json");
    if (!resposta.ok) throw new Error("Falha ao ler ./data/produtos.json");
    estado.produtos = await resposta.json();
    renderizarCatalogo();
  } catch (erro) {
    grid.innerHTML = `
      <div class="col-span-full bg-amber-50 border border-amber-200 rounded-2xl p-6 text-sm text-vc-navy">
        <strong class="block font-bold mb-1">Atenção ao abrir localmente:</strong>
        Verifique se o arquivo <strong>produtos.json</strong> está dentro da pasta <strong>/data/produtos.json</strong> e se o projeto está aberto com o <strong>Live Server</strong>.
      </div>
    `;
  }
}

function renderizarSubfiltros(produtosDaCategoria) {
  const container = document.getElementById("subfiltros-container");
  const subtemasUnicos = ["Todos", ...new Set(produtosDaCategoria.map((p) => p.subtema).filter(Boolean))];

  if (subtemasUnicos.length <= 2) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = subtemasUnicos
    .map((sub) => {
      const ativo = estado.subtemaAtivo === sub;
      return `
        <button
          onclick="selecionarSubtema('${sub}')"
          class="${
            ativo
              ? "bg-vc-purple text-white shadow-sm"
              : "bg-slate-100 text-vc-navy hover:bg-slate-200"
          } text-xs font-bold px-3.5 py-2 rounded-xl whitespace-nowrap transition"
        >
          ${sub}
        </button>
      `;
    })
    .join("");
}

function renderizarCatalogo() {
  const grid = document.getElementById("catalogo-grid");
  const termo = estado.termoBusca.trim().toLowerCase();

  // Se o cliente digitar algo na busca, pesquisa em todas as categorias automaticamente
  const categoriaParaFiltrar = termo ? "todos" : estado.categoriaAtiva;
  const info = INFO_CATEGORIAS[categoriaParaFiltrar] || INFO_CATEGORIAS.festas;

  document.getElementById("titulo-categoria-ativa").textContent = termo
    ? `🔍 Resultado da busca por "${estado.termoBusca}"`
    : info.titulo;
  document.getElementById("descricao-categoria-ativa").textContent = info.descricao;

  const produtosDaCategoria = estado.produtos.filter(
    (item) => categoriaParaFiltrar === "todos" || item.categoria === categoriaParaFiltrar
  );

  renderizarSubfiltros(produtosDaCategoria);

  const filtrados = produtosDaCategoria.filter((item) => {
    const bateSubtema = estado.subtemaAtivo === "Todos" || item.subtema === estado.subtemaAtivo;
    const bateBusca =
      !termo ||
      item.nome.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo) ||
      item.categoriaLabel.toLowerCase().includes(termo) ||
      (item.subtema && item.subtema.toLowerCase().includes(termo));
    return bateSubtema && bateBusca;
  });

  document.getElementById("contador-produtos").textContent = `${filtrados.length} ${
    filtrados.length === 1 ? "item" : "itens"
  }`;

  if (filtrados.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-200">
        <p class="text-vc-navy font-semibold">Nenhum personalizado encontrado com esse filtro.</p>
        <button onclick="limparFiltros()" class="mt-3 text-xs font-bold text-vc-magenta underline">Voltar para Festas</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtrados
    .map(
      (prod) => `
      <article class="card-animate bg-white rounded-3xl border border-slate-200/80 hover:border-vc-purple/40 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
        <div class="relative h-48 overflow-hidden bg-slate-100">
          <img src="${prod.imagem}" alt="${prod.nome}" loading="lazy" class="w-full h-full object-cover hover:scale-105 transition duration-300" />
          <span class="absolute top-3 left-3 bg-vc-navy/90 backdrop-blur text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            ${prod.destaque}
          </span>
          <span class="absolute bottom-3 right-3 bg-white/95 text-vc-navy text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            ⏱ ${prod.prazo}
          </span>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-[11px] font-extrabold uppercase tracking-wider text-vc-purple">${prod.categoriaLabel}</span>
              ${prod.subtema ? `<span class="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">${prod.subtema}</span>` : ""}
            </div>
            <h3 class="font-bold text-vc-navy text-base mt-1.5 leading-snug">${prod.nome}</h3>
            <p class="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">${prod.descricao}</p>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div>
              <span class="block text-[11px] text-slate-400">${prod.unidade}</span>
              <strong class="text-lg font-extrabold text-vc-navy">${formatarMoeda(prod.preco)}</strong>
            </div>
            <button
              onclick="abrirModalPersonalizacao('${prod.id}')"
              class="inline-flex items-center gap-1.5 bg-vc-magenta hover:bg-vc-purple text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition active:scale-95"
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
  estado.categoriaAtiva = "festas";
  estado.subtemaAtivo = "Todos";
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
      ? "filtro-btn flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-extrabold bg-gradient-marca text-white shadow-md transition"
      : "filtro-btn flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-extrabold bg-white text-vc-navy hover:bg-slate-100 border border-slate-200 transition";
  });
}

// ================= MODAL E CARRINHO =================
function abrirModalPersonalizacao(produtoId) {
  const produto = estado.produtos.find((p) => p.id === produtoId);
  if (!produto) return;

  estado.produtoModalAtual = produto;

  document.getElementById("modal-categoria").textContent = `${produto.categoriaLabel} • ${produto.subtema || ""}`;
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
          <strong class="text-xs font-extrabold text-vc-navy">${item.quantidade}x ${item.nome}</strong>
          <button onclick="removerItemCarrinho('${item.uid}')" class="text-slate-400 hover:text-vc-magenta text-xs font-bold">Remover</button>
        </div>
        <p class="text-[11px] text-vc-purple font-bold">Acabamento: ${item.opcao}</p>
        <p class="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100">Personalização: ${item.briefing}</p>
        ${item.enviaraArquivo ? `<span class="inline-block text-[10px] font-bold text-vc-royal bg-vc-cyan/10 px-2 py-0.5 rounded">📎 Enviará foto/logo no WhatsApp</span>` : ""}
        <div class="text-right text-xs font-extrabold text-vc-navy pt-1">
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

function abrirWhatsAppRapido() {
  const msg = `Olá, *${CONFIG.nomeLoja}*! Vim pelo site ${CONFIG.dominio} e gostaria de tirar uma dúvida sobre personalizados.`;
  window.open(`https://wa.me/${CONFIG.whatsappNumero}?text=${encodeURIComponent(msg)}`, "_blank");
}

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

function configurarEventos() {
  document.querySelectorAll(".filtro-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      estado.categoriaAtiva = btn.getAttribute("data-categoria");
      estado.subtemaAtivo = "Todos";
      atualizarBotoesFiltro();
      renderizarCatalogo();
    });
  });

  const atualizarBusca = (e) => {
    estado.termoBusca = e.target.value;
    estado.subtemaAtivo = "Todos";
    renderizarCatalogo();
  };
  document.getElementById("input-busca").addEventListener("input", atualizarBusca);
  document.getElementById("input-busca-mobile").addEventListener("input", atualizarBusca);

  document.getElementById("btn-fechar-modal").addEventListener("click", fecharModalPersonalizacao);
  document.getElementById("btn-cancelar-modal").addEventListener("click", fecharModalPersonalizacao);
  document.getElementById("btn-confirmar-item").addEventListener("click", confirmarAdicaoCarrinho);

  document.getElementById("btn-abrir-carrinho").addEventListener("click", abrirCarrinho);
  document.getElementById("btn-fechar-carrinho").addEventListener("click", fecharCarrinho);
  document.getElementById("drawer-overlay").addEventListener("click", fecharCarrinho);
  document.getElementById("btn-finalizar-whatsapp").addEventListener("click", enviarPedidoWhatsApp);

  document.getElementById("btn-b2b-whatsapp").addEventListener("click", () => {
    const msg = `Olá, *${CONFIG.nomeLoja}*! Vim pelo site ${CONFIG.dominio} e gostaria de solicitar um tema personalizado / orçamento corporativo.`;
    window.open(`https://wa.me/${CONFIG.whatsappNumero}?text=${encodeURIComponent(msg)}`, "_blank");
  });
}