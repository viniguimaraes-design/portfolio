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

// ===== CARREGAR PROJETOS DO GOOGLE SHEETS =====
const URL_PLANILHA_PROJETOS = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRY-iRbNiuud4l3m93tk2I4wK4OgWj55HaXimi5x-gSNUCQMbZnV7RBhHfPbJsgYZlVTvJiGzcw_FeM/pub?gid=1415118680&single=true&output=csv';

let todosProjetos = [];

async function carregarProjetos() {
    try {
        const response = await fetch(URL_PLANILHA_PROJETOS);
        const csv = await response.text();

        // Converte CSV em array
        const linhas = csv.split('\n').filter(linha => linha.trim() !== '');
        const cabecalho = linhas[0].split(',').map(item => item.trim().toLowerCase());
        
        const idxTitulo = cabecalho.indexOf('titulo');
        const idxDescricao = cabecalho.indexOf('descricao');
        const idxTags = cabecalho.indexOf('tags');
        const idxImagens = cabecalho.indexOf('imagens');

        todosProjetos = [];

        for (let i = 1; i < linhas.length; i++) {
            // Parser respeitando aspas
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
            const tags = (campos[idxTags] || '').replace(/^"|"$/g, '').split(',').map(t => t.trim()).filter(t => t !== '');
            const imagens = (campos[idxImagens] || '').replace(/^"|"$/g, '').split(',').map(i => i.trim());

            if (titulo) {
                todosProjetos.push({ titulo, descricao, tags, imagens });
            }
        }

        renderizarProjetos(todosProjetos);

    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        document.getElementById('projectsGrid').innerHTML = '<p>Erro ao carregar projetos. Verifique a planilha.</p>';
    }
}

function renderizarProjetos(projetos) {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';

    projetos.forEach((projeto, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';

        // ===== CARROSSEL =====
        const wrapper = document.createElement('div');
        wrapper.className = 'carousel-wrapper';

        const track = document.createElement('div');
        track.className = 'carousel-track';

        projeto.imagens.forEach((src, imgIndex) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = projeto.titulo;
            img.loading = 'lazy';
            img.dataset.index = imgIndex;
            track.appendChild(img);
        });

        wrapper.appendChild(track);

        // Botões de navegação (se houver mais de 1 imagem)
        if (projeto.imagens.length > 1) {
            const btnPrev = document.createElement('button');
            btnPrev.className = 'carousel-btn prev';
            btnPrev.innerHTML = '‹';
            
            const btnNext = document.createElement('button');
            btnNext.className = 'carousel-btn next';
            btnNext.innerHTML = '›';
            
            wrapper.appendChild(btnPrev);
            wrapper.appendChild(btnNext);

            // Dots
            const dots = document.createElement('div');
            dots.className = 'carousel-dots';
            projeto.imagens.forEach((_, i) => {
                const dot = document.createElement('span');
                if (i === 0) dot.classList.add('active');
                dot.dataset.index = i;
                dots.appendChild(dot);
            });
            wrapper.appendChild(dots);
        }

        // ===== HEADER =====
        const header = document.createElement('div');
        header.className = 'project-header';
        const title = document.createElement('h2');
        title.textContent = projeto.titulo;
        const icon = document.createElement('i');
        icon.className = 'fas fa-plus';
        header.appendChild(title);
        header.appendChild(icon);

        // ===== DETALHES =====
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

        // ===== MONTAGEM =====
        card.appendChild(wrapper);
        card.appendChild(header);
        card.appendChild(details);
        grid.appendChild(card);

        // ===== LÓGICA DO CARROSSEL =====
        let currentIndex = 0;
        const totalImages = projeto.imagens.length;
        
        if (totalImages > 1) {
            const prevBtn = wrapper.querySelector('.prev');
            const nextBtn = wrapper.querySelector('.next');
            const dots = wrapper.querySelectorAll('.carousel-dots span');

            function updateCarousel(index) {
                currentIndex = index;
                const offset = -currentIndex * 100;
                track.style.transform = `translateX(${offset}%)`;
                
                dots.forEach((dot, i) => {
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

            dots.forEach((dot, i) => {
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    updateCarousel(i);
                });
            });
        }

        // ===== EXPANDIR/RECOLHER =====
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
