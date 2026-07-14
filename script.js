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
    
    const contagem = {};
    todosProjetos.forEach(projeto => {
        projeto.tags.forEach(tag => {
            contagem[tag] = (contagem[tag] || 0) + 1;
        });
    });

    const tagsOrdenadas = Object.keys(contagem).sort((a, b) => contagem[b] - contagem[a]);

    let html = '';
    tagsOrdenadas.forEach(tag => {
        html += `<span class="tag" data-tag="${tag}">${tag}</span>`;
    });
    tagsBar.innerHTML = html;

    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            const tagNome = this.dataset.tag;
            
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                tagsAtivas = tagsAtivas.filter(t => t !== tagNome);
            } else {
                this.classList.add('active');
                tagsAtivas.push(tagNome);
            }
            
            if (tagsAtivas.length === 0) {
                renderizarProjetos(todosProjetos);
            } else {
                filtrarProjetos();
            }
        });
    });
}

// ===== FILTRAR PROJETOS =====
function filtrarProjetos() {
    const grid = document.getElementById('projectsGrid');
    
    if (tagsAtivas.includes('todos')) {
        renderizarProjetos(todosProjetos);
        return;
    }
    
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
            
