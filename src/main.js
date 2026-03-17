import './style.css';
import Chart from 'chart.js/auto';

const jobs = [
    { role: 'Разработчик "Отчетность и Аналитика"', company: 'Кумтор Голд Компани', dates: 'Окт 2025 — Наст. время', desc: 'Исправление багов, написание программного кода, оптимизация процессов.', img: 'kgc.jpg', icon: 'fa-code' },
    { role: 'Бизнес-аналитик', company: 'Кумтор Голд Компани', dates: 'Авг 2023 — Окт 2025', desc: 'Анализ бизнес процессов, разработка и составление ТЗ, тестирование, документирование.', img: 'kgc.jpg', icon: 'fa-project-diagram' },
    { role: 'Ментор (Data Analysis)', company: 'CodeInfinity', dates: 'Июнь 2024 — Март 2025', desc: 'Обучение по Анализу данных: Excel, SQL, Power BI.', img: 'CodeInfinity.jpg', icon: 'fa-chalkboard-teacher' },
    { role: 'Тренер-консультант', company: 'DenMar', dates: 'Фев 2023 — Янв 2025', desc: 'Преподавание уроков и проведение тренингов по MS Excel (Pro уровень).', img: 'DenMar.jpg', icon: 'fa-file-excel' },
    { role: 'Ведущий специалист', company: 'Газпромнефть Азия', dates: 'Дек 2022 — Май 2023', desc: 'Управленческая отчетность: свод, консолидация информации, глубокий анализ данных.', img: 'gazprom.png', icon: 'fa-gas-pump' },
    { role: 'Тренер Excel', company: 'GoFare', dates: 'Июнь 2022 — Сен 2022', desc: 'Обучение студентов основам и продвинутому анализу данных в MS Excel.', img: 'GoFare.jpg', icon: 'fa-graduation-cap' },
    { role: 'Бизнес аналитик', company: 'Текстиль Транс - Салкын', dates: 'Март 2021 — Май 2023', desc: 'Разработка отчётов, Power BI, Excel VBA. ТЗ для 1С программистов.', img: 'textiletrans.jpg', icon: 'fa-tshirt' },
    { role: 'Бизнес-аналитик', company: 'Маткасымов', dates: 'Окт 2021 — Март 2022', desc: 'Оптимизация производства, отчетность, расчет себестоимости.', img: 'matkasym.jpg', icon: 'fa-store' },
    { role: 'Бухгалтер', company: 'Эквилибри Консалт', dates: 'Фев 2020 — Фев 2021', desc: 'Расчётный бухгалтер, помощник главного бухгалтера.', img: 'equilibri.png', icon: 'fa-calculator' }
];

window.setTheme = function(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
    updateThemeButtons(themeName);
};

window.updateThemeButtons = function(activeTheme) {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.dataset.themeVal === activeTheme) btn.classList.add('active');
    });
};

window.toggleThemeMobile = function() {
    const current = localStorage.getItem('theme') || 'dark';
    let nextTheme = 'light';
    if (current === 'light') nextTheme = 'dark';
    else if (current === 'dark') nextTheme = 'warm';
    window.setTheme(nextTheme);
};

window.toggleContacts = function(source) {
    const id = source === 'mobile' ? 'contact-icons-mobile' : 'contact-icons';
    const el = document.getElementById(id);
    if (el) {
        const isActive = el.classList.toggle('active');
        const btn = document.querySelector(`button[onclick="toggleContacts('${source}')"]`);
        if(btn) btn.setAttribute('aria-expanded', isActive);
    }
};

window.showMoreJobs = function() {
    document.querySelectorAll('.job-hidden').forEach(el => {
        el.classList.remove('job-hidden');
    });
    const wrapper = document.getElementById('show-more-wrapper');
    if(wrapper) wrapper.style.display = 'none';
};

window.openModal = function(src) {
    const modal = document.getElementById('image-modal');
    const img = document.getElementById('modal-img');
    img.src = src;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    modal.setAttribute('aria-hidden', 'false');
};

window.closeModal = function() {
    const modal = document.getElementById('image-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
    modal.setAttribute('aria-hidden', 'true');
};

function renderJobs() {
    const container = document.getElementById('experience-container');
    if(!container) return; 

    const jobsToShowInitial = 3;
    
    const html = jobs.map((job, index) => {
        const isHidden = index >= jobsToShowInitial ? 'job-hidden' : '';
        const alignLeft = index % 2 !== 0;

        const mobileLayout = `
            <div class="md:hidden flex gap-4 pl-4 relative pb-8">
                 <div class="absolute left-[29px] top-8 bottom-0 w-0.5 bg-muted" aria-hidden="true"></div>
                <div class="flex-shrink-0 w-3 h-3 bg-accent rounded-full mt-6 -ml-[22px] border-4 border-surface shadow-sm z-20" aria-hidden="true"></div>
                <div class="bg-surface p-5 rounded-xl border border-muted shadow-sm w-full">
                    <span class="text-xs font-bold text-accent uppercase mb-1 block">${job.dates}</span>
                    <h3 class="font-bold text-lg text-primary">${job.role}</h3>
                    
                    <div class="flex items-center gap-3 my-3">
                        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-surface border border-muted shadow-sm flex items-center justify-center relative overflow-hidden">
                            <img src="${job.img}" class="w-full h-full object-cover" alt="Логотип ${job.company}" onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden');">
                            <div class="hidden absolute inset-0 flex items-center justify-center bg-white text-secondary" aria-hidden="true">
                                <i class="fas ${job.icon} text-sm"></i>
                            </div>
                        </div>
                        <div class="text-sm font-semibold text-secondary">${job.company}</div>
                    </div>
                    
                    <p class="text-sm text-muted">${job.desc}</p>
                </div>
            </div>
        `;

        const desktopLayout = `
            <div class="hidden md:flex items-center justify-between group w-full">
                <div class="w-5/12 ${!alignLeft ? 'text-right pr-8' : 'text-left pl-8 order-last'}">
                    ${!alignLeft 
                        ? `<div class="bg-surface p-5 rounded-xl border border-muted shadow-sm hover:border-accent transition-all relative">
                             <div class="absolute top-1/2 right-[-9px] w-4 h-4 bg-surface border-t border-r border-muted transform rotate-45" aria-hidden="true"></div>
                             <h3 class="font-bold text-lg text-primary">${job.role}</h3>
                             <div class="text-sm font-semibold text-secondary mb-2">${job.company}</div>
                             <p class="text-sm text-muted leading-relaxed">${job.desc}</p>
                           </div>`
                        : `<div class="py-2 px-4 rounded-lg border-2 border-dashed border-muted inline-block bg-surface/50">
                             <i class="far fa-clock text-accent mr-2" aria-hidden="true"></i> <span class="font-mono font-bold text-secondary text-sm">${job.dates}</span>
                           </div>`
                    }
                </div>

                <div class="flex-shrink-0 w-14 h-14 rounded-full bg-surface border-4 border-muted shadow-md flex items-center justify-center relative cursor-pointer hover:scale-110 transition-transform z-20" onclick="openModal('${job.img}')" role="button" tabindex="0" aria-label="Увеличить логотип ${job.company}">
                    <div class="w-full h-full rounded-full overflow-hidden relative bg-white">
                        <img src="${job.img}" class="w-full h-full object-cover" alt="Логотип ${job.company}" onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden');">
                        <div class="hidden absolute inset-0 flex items-center justify-center bg-white text-secondary" aria-hidden="true">
                            <i class="fas ${job.icon} text-2xl"></i>
                        </div>
                    </div>
                    <div class="absolute top-1/2 -left-4 w-4 h-0.5 bg-muted" aria-hidden="true"></div>
                    <div class="absolute top-1/2 -right-4 w-4 h-0.5 bg-muted" aria-hidden="true"></div>
                </div>

                <div class="w-5/12 ${!alignLeft ? 'text-left pl-8' : 'text-right pr-8 order-first'}">
                     ${alignLeft 
                        ? `<div class="bg-surface p-5 rounded-xl border border-muted shadow-sm hover:border-accent transition-all relative">
                             <div class="absolute top-1/2 left-[-9px] w-4 h-4 bg-surface border-l border-b border-muted transform rotate-45" aria-hidden="true"></div>
                             <h3 class="font-bold text-lg text-primary">${job.role}</h3>
                             <div class="text-sm font-semibold text-secondary mb-2">${job.company}</div>
                             <p class="text-sm text-muted leading-relaxed">${job.desc}</p>
                           </div>`
                        : `<div class="py-2 px-4 rounded-lg border-2 border-dashed border-muted inline-block bg-surface/50">
                             <i class="far fa-clock text-accent mr-2" aria-hidden="true"></i> <span class="font-mono font-bold text-secondary text-sm">${job.dates}</span>
                           </div>`
                    }
                </div>
            </div>
        `;
        
        return `<div class="relative z-10 reveal-text visible ${isHidden}">${mobileLayout}${desktopLayout}</div>`;
    }).join('');

    const centerLine = container.innerHTML; 
    container.innerHTML = centerLine + html; 
    
    const hiddenCount = jobs.length - jobsToShowInitial;
    const btnText = document.getElementById('show-more-text');
    if(btnText) btnText.innerText = `Показать ещё (${hiddenCount})`;
}

document.addEventListener("DOMContentLoaded", function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    window.setTheme(savedTheme);

    renderJobs();

    window.addEventListener('click', function(e) {
        const btnDesk = document.querySelector('button[onclick="toggleContacts(\'desktop\')"]');
        const dropDesk = document.getElementById('contact-icons');
        if (btnDesk && dropDesk && !btnDesk.contains(e.target) && !dropDesk.contains(e.target)) {
            dropDesk.classList.remove('active');
            btnDesk.setAttribute('aria-expanded', 'false');
        }
        
        const btnMob = document.querySelector('button[onclick="toggleContacts(\'mobile\')"]');
        const dropMob = document.getElementById('contact-icons-mobile');
        if (btnMob && dropMob && !btnMob.contains(e.target) && !dropMob.contains(e.target)) {
            dropMob.classList.remove('active');
            btnMob.setAttribute('aria-expanded', 'false');
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-text').forEach(el => observer.observe(el));

    const sections = document.querySelectorAll('section');
    const desktopLinks = document.querySelectorAll('.nav-link-desktop');
    const mobileLinks = document.querySelectorAll('.nav-link-mobile');

    window.addEventListener('scroll', () => {
        let current = '';
        if (window.scrollY < 100) current = '#about'; 
        else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= (sectionTop - 300)) current = '#' + section.getAttribute('id');
            });
        }

        desktopLinks.forEach(link => {
            link.classList.remove('active-nav');
            if (link.getAttribute('href') === current) link.classList.add('active-nav');
        });
        
        mobileLinks.forEach(link => {
            link.classList.remove('active-mobile-nav');
            if (link.getAttribute('href') === current) link.classList.add('active-mobile-nav');
        });
    });

    const createChart = (ctxId, color, value) => {
        const canvas = document.getElementById(ctxId);
        if(!canvas) return;
        
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Skill', 'Rest'],
                datasets: [{
                    data: [value, 100 - value],
                    backgroundColor: [color, 'rgba(148, 163, 184, 0.1)'],
                    borderWidth: 0,
                }]
            },
            options: {
                cutout: '80%',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                animation: { animateScale: true, animateRotate: true }
            }
        });
    };

    const chartObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            createChart('chartPowerBI', '#f59e0b', 95);
            createChart('chartPython', '#3b82f6', 80);
            createChart('chartSQL', '#14b8a6', 90);
            createChart('chartExcel', '#16a34a', 100);
            chartObserver.disconnect();
        }
    }, { threshold: 0.1 }); 
    
    const skillsSection = document.getElementById('skills');
    if(skillsSection) chartObserver.observe(skillsSection);

    // Эффект частиц IT/Data за курсором
    let lastParticleTime = 0;
    const throttleMs = 40; 
    const symbols = ['0', '1', '{ }', '</>', 'SELECT', 'JOIN', 'NULL', 'import', 'DAX'];

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastParticleTime < throttleMs) return;
        if (Math.random() > 0.5) return;
        
        lastParticleTime = now;

        const particle = document.createElement('div');
        particle.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        
        particle.className = 'pointer-events-none fixed z-[100] text-accent font-mono text-xs font-bold select-none';
        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;
        
        const tx = (Math.random() - 0.5) * 100;
        const ty = (Math.random() - 1) * 80 - 20; 
        
        particle.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.8 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0.4)`, opacity: 0 }
        ], {
            duration: 800 + Math.random() * 600,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
        });

        document.body.appendChild(particle);

        particle.getAnimations()[0].onfinish = () => {
            particle.remove();
        };
    });
});