document.addEventListener('DOMContentLoaded', () => {
    console.log("PC Diagnostics Hub Loaded");

    // ==========================================
    // 1. THEME MANAGEMENT
    // ==========================================
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;

    if (!themeBtn) console.error("Theme button not found!");

    function enableLightMode() {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        localStorage.setItem('theme', 'light');
    }

    function enableDarkMode() {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        localStorage.setItem('theme', 'dark');
    }

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        enableLightMode();
    } else {
        // Default is Dark
        enableDarkMode();
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (body.classList.contains('light-theme')) {
                enableDarkMode();
                showToast('Темная тема включена');
            } else {
                enableLightMode();
                showToast('Светлая тема включена');
            }
        });
    }

    // ==========================================
    // 2. FILTERING
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.tool-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-filter');
            
            cards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'flex';
                    setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });

    // ==========================================
    // 3. LIKES
    // ==========================================
    document.querySelectorAll('.btn-fav').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.classList.replace('fa-regular', 'fa-solid');
                showToast('Добавлено в избранное');
            } else {
                icon.classList.replace('fa-solid', 'fa-regular');
            }
        });
    });

    // ==========================================
    // 4. MODAL SIMULATION
    // ==========================================
    const modal = document.getElementById('simulation-modal');
    const runBtns = document.querySelectorAll('.run-simulation');
    const closeBtns = [document.querySelector('.modal-close'), document.querySelector('.close-modal-btn')];
    const stepLoad = document.querySelector('.step-loading');
    const stepRes = document.querySelector('.step-result');
    const bar = document.getElementById('modal-progress');
    const title = document.getElementById('modal-tool-name');

    runBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(e.target.closest('.close-modal-btn')) return;
            const tool = e.currentTarget.getAttribute('data-tool');
            
            modal.classList.add('open');
            stepLoad.style.display = 'block';
            stepLoad.classList.remove('hidden');
            stepRes.classList.remove('active');
            title.textContent = `Запуск ${tool}`;
            bar.style.width = '0%';
            
            let p = 0;
            if(window.simInterval) clearInterval(window.simInterval);
            
            window.simInterval = setInterval(() => {
                p += Math.random() * 5;
                if(p > 100) p = 100;
                bar.style.width = p + '%';
                
                if(p === 100) {
                    clearInterval(window.simInterval);
                    setTimeout(() => {
                        stepLoad.classList.add('hidden');
                        stepRes.classList.add('active');
                        showToast('Проверка завершена');
                    }, 500);
                }
            }, 100);
        });
    });

    const closeModal = () => modal.classList.remove('open');
    closeBtns.forEach(b => b && b.addEventListener('click', closeModal));
    modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });

    // ==========================================
    // 5. TOASTS
    // ==========================================
    function showToast(msg) {
        const container = document.getElementById('toast-container');
        if(!container) return;
        const t = document.createElement('div');
        t.className = 'toast';
        t.innerHTML = `<i class="fa-solid fa-info-circle"></i> ${msg}`;
        container.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }

    // ==========================================
    // 6. SMOOTH SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
            }
        });
    });
});