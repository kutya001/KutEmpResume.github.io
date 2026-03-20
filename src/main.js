import './style.css';
import Chart from 'chart.js/auto';
import resumeData from './data.json';

let currentLang = localStorage.getItem('lang') || 'ru';

// --- Глобальные функции управления интерфейсом ---

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

// --- Интернационализация ---

window.setLang = function(lang) {
    if (!resumeData[lang]) return;
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    updateLangButtons();
    renderContent();
};

function updateLangButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('bg-accent', 'text-white');
        btn.classList.add('text-muted');
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('bg-accent', 'text-white');
            btn.classList.remove('text-muted');
        }
    });
}

function renderContent() {
    const data = resumeData[currentLang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const keys = el.getAttribute('data-i18n').split('.');
        let value = data;
        for (const key of keys) {
            value = value ? value[key] : null;
        }
        if (value != null) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = value;
            else el.textContent = value;
        }
    });

    renderJobs(data.experience.jobs);
    renderSkillsDetail(data.skills.levels);
    renderEducation(data.education);
}

// --- Функция рендеринга опыта работы ---

function renderJobs(jobs) {
    const container = document.getElementById('experience-container');
    if(!container) return; 

    const jobsToShowInitial = 3;
    
    const html = jobs.map((job, index) => {
        const isHidden = index >= jobsToShowInitial ? 'job-hidden' : '';
        const alignLeft = index % 2 !== 0;

        // Мобильная верстка с исправленным отображением логотипов
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

    const centerLine = '<div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-muted md:-translate-x-1/2 z-0" aria-hidden="true"></div>';
    container.innerHTML = centerLine + html; 
    
    const hiddenCount = jobs.length - jobsToShowInitial;
    const btnText = document.getElementById('show-more-text');
    const wrapper = document.getElementById('show-more-wrapper');
    if (hiddenCount > 0) {
        if(btnText) btnText.innerText = `${resumeData[currentLang].experience.showMore} (${hiddenCount})`;
        if(wrapper) wrapper.style.display = '';
    } else {
        if(wrapper) wrapper.style.display = 'none';
    }
}

// --- Функция рендеринга навыков ---

function renderSkillsDetail(levels) {
    const container = document.getElementById('skills-detail-container');
    if (!container) return;

    const styleMap = {
        advanced: 'bg-surface text-accent border-accent',
        intermediate: 'bg-surface text-primary border-secondary',
        basic: 'bg-background text-muted border-muted'
    };

    container.innerHTML = levels.map(level => `
        <div>
            <h4 class="text-sm font-bold text-muted uppercase tracking-wider mb-3">${level.title}</h4>
            <div class="flex flex-wrap gap-2">
                ${level.items.map(item => `<span class="px-3 py-1 ${styleMap[level.type] || styleMap.basic} rounded-lg text-sm font-medium border shadow-sm">${item}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// --- Функция рендеринга образования ---

function renderEducation(edu) {
    const academicContainer = document.getElementById('education-academic-container');
    const coursesContainer = document.getElementById('education-courses-container');

    if (academicContainer) {
        academicContainer.innerHTML = edu.academic.map((item, i) => `
            <div class="bg-surface p-6 rounded-xl border-l-4 ${i === 0 ? 'border-accent' : 'border-muted'} shadow-sm hover:translate-x-2 transition-transform duration-300">
                <div class="flex flex-col justify-start items-start">
                    <h4 class="font-bold text-lg text-primary">${item.name}</h4>
                    <p class="text-secondary text-sm font-medium mt-1">${item.speciality}</p>
                    <div class="mt-2 flex items-center gap-2">
                        <span class="bg-surface border border-muted text-primary shadow-sm text-xs font-bold px-2 py-1 rounded">${item.year}</span>
                        <span class="text-xs text-muted">${item.note}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    if (coursesContainer) {
        coursesContainer.innerHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${edu.courses.map(item => `
                <div class="bg-surface p-4 rounded-xl border border-muted shadow-sm hover:border-accent hover:shadow-md transition-all group">
                    <div class="flex items-center justify-between mb-2">
                        <i class="${item.icon} text-2xl ${item.iconColor} group-hover:scale-110 transition-transform" aria-hidden="true"></i>
                        <span class="text-xs font-bold text-muted">${item.year}</span>
                    </div>
                    <h4 class="font-bold text-primary">${item.name}</h4>
                    <p class="text-xs text-secondary mt-1">${item.school}</p>
                </div>
            `).join('')}
        </div>`;
    }
}

// --- Продвинутая аналитика и уведомление в Telegram ---

const sendTelegramNotification = async () => {
    if (sessionStorage.getItem('resume_viewed')) return;

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxZryXC1jHMrRt_u8GJbtwexF-OVWaXLCfxbC6wBglLnGukZ7fmRh9ilrZJYWSp2e8X/exec'; 
    
    // Мгновенный сбор доступных данных (не зависит от внешних API)
    const browserData = {
        time: new Date().toLocaleTimeString('ru-RU'),
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ua: navigator.userAgent,
        ref: document.referrer || 'Прямой заход (или Instagram DM/Story)',
        screen: `${window.screen.width}x${window.screen.height}`
    };

    // Функция отправки (вынесена отдельно для надежности)
    const fireNotification = (payload) => {
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            cache: 'no-cache',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(payload)
        }).then(() => {
            sessionStorage.setItem('resume_viewed', 'true');
        }).catch(err => console.log('Final notification fail:', err));
    };

    // Попытка получить гео-данные с коротким таймаутом
    try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 2000); // Ждем максимум 2 секунды

        const geoRes = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        if (geoRes.ok) {
            const geo = await geoRes.json();
            fireNotification({
                ...browserData,
                city: geo.city || 'Неизвестно',
                country: geo.country_name || 'Неизвестно',
                ip: geo.ip || 'Скрыт',
                provider: geo.org || 'Неизвестно'
            });
        } else {
            throw new Error('Geo API error');
        }
        clearTimeout(id);
    } catch (error) {
        // Если сервис гео заблокирован или тормозит, отправляем базовые данные немедленно
        console.log('Falling back to basic data due to Instagram/AdBlock restrictions');
        fireNotification({
            ...browserData,
            city: 'Заблокировано браузером',
            country: 'Заблокировано браузером',
            ip: 'Скрыт',
            provider: 'Скрыт'
        });
    }
};

// --- Основной блок инициализации ---

document.addEventListener("DOMContentLoaded", function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    window.setTheme(savedTheme);

    updateLangButtons();
    renderContent();
    
    // Запуск уведомления максимально быстро
    sendTelegramNotification();

    // Обработка кликов
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

    // Графики Skills
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

    // Эффект IT-частиц при наведении
    let lastParticleTime = 0;
    const symbols = ['0', '1', '{ }', '</>', 'SELECT', 'JOIN', 'NULL', 'import', 'DAX'];

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastParticleTime < 40 || Math.random() > 0.5) return;
        lastParticleTime = now;

        const particle = document.createElement('div');
        particle.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        particle.className = 'pointer-events-none fixed z-[100] text-accent font-mono text-xs font-bold select-none';
        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;
        
        particle.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.8 },
            { transform: `translate(calc(-50% + ${(Math.random() - 0.5) * 100}px), calc(-50% + ${(Math.random() - 1) * 80 - 20}px)) scale(0.4)`, opacity: 0 }
        ], {
            duration: 800 + Math.random() * 600,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
        });

        document.body.appendChild(particle);
        particle.getAnimations()[0].onfinish = () => particle.remove();
    });
});
