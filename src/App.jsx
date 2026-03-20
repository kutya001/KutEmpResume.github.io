import { useState, useEffect } from 'react';
import RESUME_DATA from './data.json';
import InteractiveBackground from './components/InteractiveBackground';
import TiltCard from './components/TiltCard';

const BASE = import.meta.env.BASE_URL;

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxZryXC1jHMrRt_u8GJbtwexF-OVWaXLCfxbC6wBglLnGukZ7fmRh9ilrZJYWSp2e8X/exec';

const skillColors = {
  advanced: 'border-blue-500/50 text-blue-400',
  intermediate: 'border-purple-500/50 text-purple-400',
  basic: 'border-slate-600 text-slate-400',
};

export default function App() {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'ru');
  const data = RESUME_DATA[lang];

  const handleLangChange = (l) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  useEffect(() => {
    if (sessionStorage.getItem('resume_viewed')) return;

    const browserData = {
      time: new Date().toLocaleTimeString('ru-RU'),
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ua: navigator.userAgent,
      ref: document.referrer || 'Прямой заход (или Instagram DM/Story)',
      screen: `${window.screen.width}x${window.screen.height}`,
    };

    const fireNotification = (payload) => {
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      })
        .then(() => sessionStorage.setItem('resume_viewed', 'true'))
        .catch((err) => console.log('Final notification fail:', err));
    };

    (async () => {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 2000);
        const geoRes = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        if (geoRes.ok) {
          const geo = await geoRes.json();
          fireNotification({
            ...browserData,
            city: geo.city || 'Неизвестно',
            country: geo.country_name || 'Неизвестно',
            ip: geo.ip || 'Скрыт',
            provider: geo.org || 'Неизвестно',
          });
        } else {
          throw new Error('Geo API error');
        }
        clearTimeout(id);
      } catch {
        fireNotification({
          ...browserData,
          city: 'Заблокировано браузером',
          country: 'Заблокировано браузером',
          ip: 'Скрыт',
          provider: 'Скрыт',
        });
      }
    })();
  }, []);

  return (
    <div className="relative w-full">
      <InteractiveBackground />

      {/* Навигация */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            KO.
          </div>

          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#about" className="hover:text-blue-400 transition-colors">{data.nav.about}</a>
            <a href="#experience" className="hover:text-blue-400 transition-colors">{data.nav.experience}</a>
            <a href="#skills" className="hover:text-blue-400 transition-colors">{data.nav.skills}</a>
            <a href="#education" className="hover:text-blue-400 transition-colors">{data.nav.education}</a>
          </div>

          <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            {['ru', 'kg', 'en'].map(l => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
                className={`px-3 py-1 text-xs font-bold rounded-md uppercase transition-all ${
                  lang === l ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 flex flex-col gap-32">

        {/* Hero */}
        <section id="about" className="flex flex-col items-center text-center pt-10">
          <div className="relative group cursor-pointer mb-8">
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full border-2 border-blue-500/50 p-1">
              <img
                src={`${BASE}MyImage.jpeg`}
                alt={data.hero.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 px-3 py-1 rounded-full flex items-center gap-2 whitespace-nowrap">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-300">Open to Work</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
            {data.hero.name}
          </h1>
          <p className="text-lg md:text-xl text-blue-400 font-mono mb-12 flex flex-wrap justify-center gap-2">
            <span>Data Analyst</span> <span className="text-slate-600">|</span>
            <span>BI Specialist</span> <span className="text-slate-600">|</span>
            <span>Mentor</span>
          </p>

          <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
            <TiltCard className="flex flex-col items-center text-center p-8">
              <i className="fa-solid fa-bullseye text-3xl text-blue-400 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">{data.hero.missionTitle}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{data.hero.missionDesc}</p>
            </TiltCard>
            <TiltCard className="flex flex-col items-center text-center p-8">
              <i className="fa-solid fa-briefcase text-3xl text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">{data.hero.expTitle}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{data.hero.expDesc}</p>
            </TiltCard>
            <TiltCard className="flex flex-col items-center text-center p-8">
              <i className="fa-solid fa-layer-group text-3xl text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">{data.hero.stackTitle}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{data.hero.stackDesc}</p>
            </TiltCard>
          </div>
        </section>

        {/* Опыт работы */}
        <section id="experience" className="w-full">
          <div className="text-center mb-12">
            <span className="text-blue-400 font-mono text-xs tracking-[0.2em] uppercase border border-blue-500/20 px-3 py-1 rounded-full">
              {data.experience.sectionTag}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">{data.experience.sectionTitle}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.experience.jobs.map((job, idx) => (
              <TiltCard key={idx} className="flex flex-col h-full">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 mb-4 overflow-hidden">
                  <img src={`${BASE}${job.img}`} alt={job.company} className="w-full h-full object-cover" />
                </div>
                <div className="mt-auto">
                  <span className="text-xs font-mono text-slate-500 block mb-1">{job.dates}</span>
                  <h3 className="text-lg font-bold text-white mb-1">{job.role}</h3>
                  <h4 className="text-sm text-blue-400 font-medium mb-3">{job.company}</h4>
                  <p className="text-sm text-slate-400">{job.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* Навыки */}
        <section id="skills" className="w-full">
          <div className="text-center mb-12">
            <span className="text-blue-400 font-mono text-xs tracking-[0.2em] uppercase border border-blue-500/20 px-3 py-1 rounded-full">
              {data.skills.sectionTag}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">{data.skills.sectionTitle}</h2>
          </div>
          <div className="space-y-8">
            {data.skills.levels.map((level, idx) => (
              <div key={idx}>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">{level.title}</h3>
                <div className="flex flex-wrap gap-3">
                  {level.items.map((item, i) => (
                    <span
                      key={i}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border backdrop-blur-sm bg-slate-800/30 shadow-sm ${skillColors[level.type] || skillColors.basic}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Образование */}
        <section id="education" className="w-full">
          <div className="text-center mb-12">
            <span className="text-blue-400 font-mono text-xs tracking-[0.2em] uppercase border border-blue-500/20 px-3 py-1 rounded-full">
              {data.education.sectionTag}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">{data.education.sectionTitle}</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="font-bold text-xl border-b border-slate-700 pb-2 mb-4">
                <i className="fas fa-graduation-cap text-blue-400 mr-2" />
                {data.education.academicTitle}
              </h3>
              {data.education.academic.map((item, idx) => (
                <TiltCard key={idx} className={`border-l-4 ${idx === 0 ? 'border-l-blue-500' : 'border-l-slate-600'}`}>
                  <h4 className="font-bold text-lg text-white">{item.name}</h4>
                  <p className="text-slate-400 text-sm mt-1">{item.speciality}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="bg-slate-800 border border-slate-700 text-xs font-bold px-2 py-1 rounded">{item.year}</span>
                    <span className="text-xs text-slate-500">{item.note}</span>
                  </div>
                </TiltCard>
              ))}
            </div>
            <div className="space-y-6">
              <h3 className="font-bold text-xl border-b border-slate-700 pb-2 mb-4">
                <i className="fas fa-certificate text-blue-400 mr-2" />
                {data.education.coursesTitle}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.education.courses.map((item, idx) => (
                  <TiltCard key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <i className={`${item.icon} text-2xl ${item.iconColor}`} />
                      <span className="text-xs font-bold text-slate-500">{item.year}</span>
                    </div>
                    <h4 className="font-bold text-white">{item.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{item.school}</p>
                  </TiltCard>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Контакты */}
        <section id="contact" className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">{data.nav.contact}</h2>
          </div>
          <div className="flex justify-center gap-6">
            <a href="https://t.me/kutya_omuraliev" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 text-3xl transition-transform hover:-translate-y-1">
              <i className="fab fa-telegram" />
            </a>
            <a href="https://wa.me/996500888268" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-green-400 text-3xl transition-transform hover:-translate-y-1">
              <i className="fab fa-whatsapp" />
            </a>
            <a href="https://www.instagram.com/_omuraliev_kutman_/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-400 text-3xl transition-transform hover:-translate-y-1">
              <i className="fab fa-instagram" />
            </a>
            <a href="tel:+996500888268" className="text-slate-400 hover:text-cyan-400 text-3xl transition-transform hover:-translate-y-1">
              <i className="fas fa-phone-alt" />
            </a>
          </div>
        </section>
      </main>

      {/* Футер */}
      <footer className="relative z-10 border-t border-slate-800/50 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <span className="font-bold text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              KO.
            </span>
          </div>
          <p className="text-slate-500 text-sm">{data.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
