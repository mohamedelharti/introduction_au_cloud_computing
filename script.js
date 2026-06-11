
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const slideCounter = document.getElementById('slideCounter');
const progressBar = document.getElementById('progressBar');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const slideList = document.getElementById('slideList');

let currentSlideIndex = 0;

// Générer dynamiquement la liste latérale du sommaire interactif
slides.forEach((slide, idx) => {
    const titleEl = slide.querySelector('.slide-title') || slide.querySelector('h1');
    const titleText = titleEl ? titleEl.textContent.trim().replace(/<br>/g, ' ') : `Slide ${idx + 1}`;

    const li = document.createElement('li');
    li.className = `slide-item ${idx === 0 ? 'active' : ''}`;
    li.textContent = `${idx + 1}. ${titleText}`;
    li.addEventListener('click', () => {
        goToSlide(idx);
        sidebar.classList.remove('open');
    });
    slideList.appendChild(li);
});

const slideItems = document.querySelectorAll('.slide-item');

function updatePresentation() {
    // Cacher toutes les diapositives
    slides.forEach((slide, idx) => {
        slide.classList.remove('active');
        slideItems[idx].classList.remove('active');
    });

    // Activer la slide courante
    slides[currentSlideIndex].classList.add('active');
    slideItems[currentSlideIndex].classList.add('active');

    // Gérer le bar chart si présent sur la slide active
    const barFills = slides[currentSlideIndex].querySelectorAll('.bar-fill');
    if (barFills.length > 0) {
        barFills.forEach(bar => {
            const targetWidth = bar.textContent.includes('%') ? bar.textContent.match(/\d+%/)[0] : bar.style.width;
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 150);
        });
    }

    // Mettre à jour le compteur
    slideCounter.textContent = `${currentSlideIndex + 1} / ${slides.length}`;

    // Mettre à jour la barre de progression
    const progressPercentage = ((currentSlideIndex + 1) / slides.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    // Désactiver / Activer les boutons aux extrêmes
    prevBtn.disabled = currentSlideIndex === 0;
    nextBtn.disabled = currentSlideIndex === slides.length - 1;
    prevBtn.style.opacity = currentSlideIndex === 0 ? '0.5' : '1';
    nextBtn.style.opacity = currentSlideIndex === slides.length - 1 ? '0.5' : '1';
}

function goToSlide(index) {
    if (index >= 0 && index < slides.length) {
        currentSlideIndex = index;
        updatePresentation();
    }
}

function nextSlide() {
    if (currentSlideIndex < slides.length - 1) {
        currentSlideIndex++;
        updatePresentation();
    }
}

function prevSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        updatePresentation();
    }
}

// Écouteurs d'événements
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Navigation au clavier
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
    }
});

// Toggle Sidebar
menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('open');
});

document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

// Initialisation
updatePresentation();