// ===== MENU MOBILE =====
const menuToggle = document.getElementById('menuToggle');
const menuOverlay = document.getElementById('menuOverlay');
const menuIcon = menuToggle.querySelector('i');

function openMenu() {
    menuOverlay.classList.add('active');
    menuIcon.className = 'fas fa-times';
    menuIcon.classList.add('rotated');
    document.body.style.overflow = 'hidden';
}

function closeMenuFn() {
    menuOverlay.classList.remove('active');
    menuIcon.className = 'fas fa-bars';
    menuIcon.classList.remove('rotated');
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', () => {
    if (menuOverlay.classList.contains('active')) {
        closeMenuFn();
    } else {
        openMenu();
    }
});

document.querySelectorAll('.fullscreen-menu a').forEach(link => {
    link.addEventListener('click', closeMenuFn);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
        closeMenuFn();
    }
});

// ===== CARREGAR PROJETOS =====
const URL_PLANILHA_PROJETOS = 'https://raw.githubusercontent.com/viniguimaraes-design/portfolio/refs/heads/main/assets/portfolio.csv';

let todosProjetos = [];
let tagsAtivas = ['todos'];

async function carregarProjetos() {
    try {
        const response = await fetch(URL_PLANILHA_PROJETOS);
        const csv = await response.text();

        const linhas = csv.split('\n').filter(linha => linha.trim() !== '');
        const cabecalho = linhas[0].split(',').map(item => item.trim().toLowerCase());
        
        const idxTitulo = cabecalho.indexOf('titulo');
        const idxDescricao = cabecalho.indexOf('descricao');
        const idxTags = cabecalho.indexOf('tags');
        const idxImagens = cabecalho.indexOf('imagens');

        todosProjetos = [];

        for (let i = 1; i < linhas.length; i++) {
            const campos = [];
            let campoAtual = '';
            let dentroAspas = false;

            for (let char of linhas[i]) {
                if (char === '"') {
                    dentroAspas = !dentroAspas;
                } else if (char === ',' && !dentroAspas) {
                    campos.push(campoAtual.trim());
                    campoAtual = '';
                } else {
                    campoAtual += char;
                }
            }
            campos.push(campoAtual.trim());

            const titulo = (campos[idxTitulo] || '').replace(/^"|"$/g, '').trim();
            const descricao = (campos[idxDescricao] || '').replace(/^"|"$/g, '').trim();
            const tags = (campos[idxTags] || '').replace(/^"|"$/g, '').split(',').map(t => t.trim().toLowerCase()).filter(t => t !== '');
            const imagens = (campos[idxImagens] || '').replace(/^"|"$/g, '').split(',').map(i => i.trim());

            if (titulo) {
                todosProjetos.push({ titulo, descricao, tags, imagens });
            }
        }

        // Gera as tags automaticamente
        gerarTags();
        filtrarProjetos();

    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        document.getElementById('projectsGrid').innerHTML = '<p>Erro ao carregar projetos.</p>';
    }
}

// ===== GERAR TAGS AUTOMATICAMENTE =====
function gerarTags() {
    const tagsBar = document.getElementById('tagsBar');
    
    // Conta a frequência de cada tag
    const contagem = {};
    todosProjetos.forEach(projeto => {
        projeto.tags.forEach(tag => {
            contagem[tag] = (contagem[tag] || 0) + 1;
        });
    });

    // Ordena as tags por frequência (da mais comum para a menos comum)
    const tagsOrdenadas = Object.keys(contagem).sort((a, b) => contagem[b] - contagem[a]);

    // Cria a tag "Todos" e as demais
    let html = `<span class="tag active" data-tag="todos">Todos</span>`;
    tagsOrdenadas.forEach(tag => {
        html += `<span class="tag" data-tag="${tag}">${tag}</span>`;
    });
    tagsBar.innerHTML = html;

    // Configura os eventos de clique
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const tagNome = tag.dataset.tag;
            
            if (tagNome === 'todos') {
                // Limpa todas as tags e ativa apenas "Todos"
                tags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                tagsAtivas = ['todos'];
            } else {
                // Remove "Todos" se estiver ativo
                if (tagsAtivas.includes('todos')) {
                    tagsAtivas = [];
                    document.querySelector('.tag[data-tag="todos"]').classList.remove('active');
                }
                
                // Alterna a tag clicada
                if (tag.classList.contains('active')) {
                    tag.classList.remove('active');
                    tagsAtivas = tagsAtivas.filter(t => t !== tagNome);
                } else {
                    tag.classList.add('active');
                    tagsAtivas.push(tagNome);
                }
                
                // Se não houver tags ativas, volta para "Todos"
                if (tagsAtivas.length === 0) {
                    tagsAtivas = ['todos'];
                    document.querySelector('.tag[data-tag="todos"]').classList.add('active');
                }
            }
            
            filtrarProjetos();
        });
    });
}

// ===== FILTRAR PROJETOS =====
function filtrarProjetos() {
    const grid = document.getElementById('projectsGrid');
    
    // Se "todos" estiver ativo, mostra todos
    if (tagsAtivas.includes('todos')) {
        renderizarProjetos(todosProjetos);
        return;
    }
    
    // Filtra projetos que tenham pelo menos uma das tags ativas
    const projetosFiltrados = todosProjetos.filter(projeto => {
        return projeto.tags.some(tag => tagsAtivas.includes(tag));
    });
    
    renderizarProjetos(projetosFiltrados);
}

// ===== RENDERIZAR PROJETOS =====
function renderizarProjetos(projetos) {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';

    if (projetos.length === 0) {
        grid.innerHTML = '<p style="color: #888; text-align: center; padding: 2rem 0;">Nenhum projeto encontrado com as tags selecionadas.</p>';
        return;
    }

    projetos.forEach(projeto => {
        const card = document.createElement('div');
        card.className = 'project-card';

        // Carrossel
        const wrapper = document.createElement('div');
        wrapper.className = 'carousel-wrapper';
        const track = document.createElement('div');
        track.className = 'carousel-track';

        projeto.imagens.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = projeto.titulo;
            img.loading = 'lazy';
            img.dataset.index = index;
            track.appendChild(img);
        });

        wrapper.appendChild(track);

        if (projeto.imagens.length > 1) {
            const btnPrev = document.createElement('button');
            btnPrev.className = 'carousel-btn prev';
            btnPrev.innerHTML = '‹';
            
            const btnNext = document.createElement('button');
            btnNext.className = 'carousel-btn next';
            btnNext.innerHTML = '›';
            
            wrapper.appendChild(btnPrev);
            wrapper.appendChild(btnNext);
        }

        // Header
        const header = document.createElement('div');
        header.className = 'project-header';
        const title = document.createElement('h2');
        title.textContent = projeto.titulo;
        const icon = document.createElement('i');
        icon.className = 'fas fa-plus';
        header.appendChild(title);
        header.appendChild(icon);

        // Detalhes
        const details = document.createElement('div');
        details.className = 'project-details';
        const desc = document.createElement('p');
        desc.textContent = projeto.descricao;
        details.appendChild(desc);

        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'tags';
        projeto.tags.forEach(tag => {
            const span = document.createElement('span');
            span.textContent = tag;
            tagsDiv.appendChild(span);
        });
        details.appendChild(tagsDiv);

        card.appendChild(wrapper);
        card.appendChild(header);
        card.appendChild(details);
        grid.appendChild(card);

        // Lógica do carrossel
        let currentIndex = 0;
        const totalImages = projeto.imagens.length;
        
        if (totalImages > 1) {
            const prevBtn = wrapper.querySelector('.prev');
            const nextBtn = wrapper.querySelector('.next');
            const dots = document.createElement('div');
            dots.className = 'carousel-dots';
            projeto.imagens.forEach((_, i) => {
                const dot = document.createElement('span');
                if (i === 0) dot.classList.add('active');
                dot.dataset.index = i;
                dots.appendChild(dot);
            });
            wrapper.appendChild(dots);

            function updateCarousel(index) {
                currentIndex = index;
                const offset = -currentIndex * 100;
                track.style.transform = `translateX(${offset}%)`;
                
                dots.querySelectorAll('span').forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            }

            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const newIndex = (currentIndex - 1 + totalImages) % totalImages;
                updateCarousel(newIndex);
            });

            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const newIndex = (currentIndex + 1) % totalImages;
                updateCarousel(newIndex);
            });

            dots.querySelectorAll('span').forEach((dot, i) => {
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    updateCarousel(i);
                });
            });
        }

        // Expandir/recolher
        let isOpen = false;
        header.addEventListener('click', () => {
            isOpen = !isOpen;
            details.classList.toggle('open', isOpen);
            icon.className = isOpen ? 'fas fa-minus' : 'fas fa-plus';

            if (isOpen) {
                header.classList.add('open');
            } else {
                header.classList.remove('open');
            }
        });
    });
}

// ===== INICIAR =====
carregarProjetos();
