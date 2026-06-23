// ===== MENU =====
const menuToggle = document.getElementById('menuToggle');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const closeMenu = document.getElementById('closeMenu');
const menuIcon = menuToggle.querySelector('i');

function openMenu() {
    sideMenu.classList.add('open');
    menuOverlay.classList.add('active');
    menuIcon.className = 'fas fa-times';
    menuIcon.classList.add('rotated');
    document.body.style.overflow = 'hidden';
}

function closeMenuFn() {
    sideMenu.classList.remove('open');
    menuOverlay.classList.remove('active');
    menuIcon.className = 'fas fa-bars';
    menuIcon.classList.remove('rotated');
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', () => {
    if (sideMenu.classList.contains('open')) {
        closeMenuFn();
    } else {
        openMenu();
    }
});

closeMenu.addEventListener('click', closeMenuFn);
menuOverlay.addEventListener('click', closeMenuFn);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenu.classList.contains('open')) {
        closeMenuFn();
    }
});

// ===== PROJETOS =====
const projectsData = [{
    id: 1,
    title: "Ecoleta App",
    description: "Aplicativo para conectar pessoas a pontos de coleta de resíduos recicláveis. Inclui mapa interativo, rota de navegação e gamificação.",
    tags: ["React Native", "Firebase", "Mapbox"],
    link: "#",
    images: [
        "https://picsum.photos/id/1015/600/400",
        "https://picsum.photos/id/1016/600/400",
        "https://picsum.photos/id/1018/600/400",
        "https://picsum.photos/id/1020/600/400"
    ]
}, {
    id: 2,
    title: "Dashboard Financeiro",
    description: "Painel analítico para gestão de finanças pessoais com gráficos dinâmicos, categorização automática de gastos e previsão de orçamento.",
    tags: ["Vue.js", "D3.js", "Node.js", "MongoDB"],
    link: "#",
    images: [
        "https://picsum.photos/id/1025/600/400",
        "https://picsum.photos/id/1026/600/400",
        "https://picsum.photos/id/1027/600/400",
        "https://picsum.photos/id/1028/600/400"
    ]
}, {
    id: 3,
    title: "Plataforma de Cursos Online",
    description: "Ambiente educacional com videoaulas, sistema de quizzes, certificados e fórum de dúvidas. Suporte para lives e chat em tempo real.",
    tags: ["Next.js", "Tailwind", "Prisma", "WebRTC"],
    link: "#",
    images: [
        "https://picsum.photos/id/1029/600/400",
        "https://picsum.photos/id/1030/600/400",
        "https://picsum.photos/id/1031/600/400",
        "https://picsum.photos/id/1032/600/400"
    ]
}];

const grid = document.getElementById('projectsGrid');

function renderProjects() {
    grid.innerHTML = '';
    projectsData.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';

        // Carrossel
        const wrapper = document.createElement('div');
        wrapper.className = 'carousel-wrapper';
        const track = document.createElement('div');
        track.className = 'carousel-track';

        project.images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = project.title;
            img.loading = 'lazy';
            track.appendChild(img);
        });

        wrapper.appendChild(track);

        // Header do projeto
        const header = document.createElement('div');
        header.className = 'project-header';
        const title = document.createElement('h2');
        title.textContent = project.title;
        const icon = document.createElement('i');
        icon.className = 'fas fa-chevron-down';
        header.appendChild(title);
        header.appendChild(icon);

        // Detalhes
        const details = document.createElement('div');
        details.className = 'project-details';
        const desc = document.createElement('p');
        desc.textContent = project.description;
        details.appendChild(desc);

        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'tags';
        project.tags.forEach(tag => {
            const span = document.createElement('span');
            span.textContent = tag;
            tagsDiv.appendChild(span);
        });
        details.appendChild(tagsDiv);

        const link = document.createElement('a');
        link.href = project.link;
        link.className = 'btn-link';
        link.textContent = 'Ver projeto →';
        details.appendChild(link);

        card.appendChild(wrapper);
        card.appendChild(header);
        card.appendChild(details);
        grid.appendChild(card);

        // Expandir/recolher
        let isOpen = false;
        header.addEventListener('click', () => {
            isOpen = !isOpen;
            details.classList.toggle('open', isOpen);
            icon.classList.toggle('rotated', isOpen);
        });

        // Arraste do carrossel
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;

        wrapper.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - wrapper.offsetLeft;
            scrollLeft = wrapper.scrollLeft;
            wrapper.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 1.2;
            wrapper.scrollLeft = scrollLeft - walk;
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            wrapper.style.cursor = 'grab';
        });

        // Touch
        let touchStartX = 0;
        let touchScrollLeft = 0;
        wrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].pageX - wrapper.offsetLeft;
            touchScrollLeft = wrapper.scrollLeft;
        }, { passive: true });

        wrapper.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - wrapper.offsetLeft;
            const walk = (x - touchStartX) * 1.2;
            wrapper.scrollLeft = touchScrollLeft - walk;
        }, { passive: true });
    });
}

renderProjects();

// Função para adicionar projetos (use no console)
function adicionarProjeto(projeto) {
    projectsData.push(projeto);
    renderProjects();
    console.log('✅ Projeto adicionado!');
}
