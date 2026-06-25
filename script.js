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

// ===== PROJETOS =====
const projectsData = [{
    id: 1,
    title: "Ecoleta App",
    description: "Aplicativo para conectar pessoas a pontos de coleta de resíduos recicláveis. Inclui mapa interativo, rota de navegação e gamificação.",
    tags: ["React Native", "Firebase", "Mapbox"],
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
    images: [
        "https://picsum.photos/id/1029/600/400",
        "https://picsum.photos/id/1030/600/400",
        "https://picsum.photos/id/1031/600/400",
        "https://picsum.photos/id/1032/600/400"
    ]
}, {
    id: 4,
    title: "App de Delivery",
    description: "Sistema completo para delivery com rastreamento em tempo real, pagamentos integrados e avaliação de entregadores.",
    tags: ["React", "Node.js", "Stripe", "Socket.io"],
    images: [
        "https://picsum.photos/id/1035/600/400",
        "https://picsum.photos/id/1036/600/400",
        "https://picsum.photos/id/1037/600/400",
        "https://picsum.photos/id/1038/600/400"
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

        project.images.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = project.title;
            img.loading = 'lazy';
            img.dataset.index = index;
            track.appendChild(img);
        });

        wrapper.appendChild(track);

        if (project.images.length > 1) {
            const btnPrev = document.createElement('button');
            btnPrev.className = 'carousel-btn prev';
            btnPrev.innerHTML = '‹';  // ← AGORA É UM CARACTERE
            
            const btnNext = document.createElement('button');
            btnNext.className = 'carousel-btn next';
            btnNext.innerHTML = '›';  // ← AGORA É UM CARACTERE
            
            wrapper.appendChild(btnPrev);
            wrapper.appendChild(btnNext);

            const dots = document.createElement('div');
            dots.className = 'carousel-dots';
            project.images.forEach((_, i) => {
                const dot = document.createElement('span');
                if (i === 0) dot.classList.add('active');
                dot.dataset.index = i;
                dots.appendChild(dot);
            });
            wrapper.appendChild(dots);
        }

        const header = document.createElement('div');
        header.className = 'project-header';
        const title = document.createElement('h2');
        title.textContent = project.title;
        const icon = document.createElement('i');
        icon.className = 'fas fa-plus';
        header.appendChild(title);
        header.appendChild(icon);

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

        card.appendChild(wrapper);
        card.appendChild(header);
        card.appendChild(details);
        grid.appendChild(card);

        let currentIndex = 0;
        const totalImages = project.images.length;
        
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

        let isOpen = false;
        header.addEventListener('click', () => {
         isOpen = !isOpen;
         details.classList.toggle('open', isOpen);
         icon.className = isOpen ? 'fas fa-minus' : 'fas fa-plus';

         if (isOpen) {
            header.classList.add('open');   // Título fica pesado
         } else {
            header.classList.remove('open'); // Título volta ao normal
         }
        });

        });
}     

renderProjects();
