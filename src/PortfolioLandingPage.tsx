import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Code2,
  ExternalLink,
  Github,
  Instagram,
  Layers,
  Linkedin,
  Menu,
  PenTool,
  Star,
  Twitter,
  X,
  Zap,
  Sparkles,
  Mail,
} from 'lucide-react';

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

type StatProps = {
  label: string;
  value: number;
  suffix?: string;
  inView: boolean;
};

const AnimatedStat: React.FC<StatProps> = ({ label, value, suffix = '', inView }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 2000;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = value / steps;
    let frame = 0;

    const interval = setInterval(() => {
      frame += 1;
      start += increment;
      if (frame >= steps || start >= value) {
        setDisplay(value);
        clearInterval(interval);
      } else {
        setDisplay(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [inView, value]);

  return (
    <div className="flex flex-col gap-1">
      <div className="text-4xl md:text-5xl font-semibold tracking-tight bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-transparent">
        {display}
        {suffix}
      </div>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
};

const PortfolioLandingPage: React.FC = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [aboutRef, aboutInView] = useInView(0.25);
  const [skillsRef, skillsInView] = useInView(0.25);
  const [statsRef, statsInView] = useInView(0.3);
  const [projectsRef, projectsInView] = useInView(0.25);
  const [recommendationsRef, recommendationsInView] = useInView(0.25);
  const [faqRef, faqInView] = useInView(0.25);
  const [ctaRef, ctaInView] = useInView(0.2);

  useEffect(() => {
    setHeroVisible(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { id: 'about', label: 'Обо мне' },
    { id: 'skills', label: 'Навыки' },
    { id: 'work', label: 'Проекты' },
    { id: 'recommendations', label: 'Отзывы' },
    { id: 'faq', label: 'FAQ' },
    { id: 'cta', label: 'Контакты' },
  ];

  const skills = [
    { icon: Code2, title: 'React & TypeScript', desc: 'Современный стек: хуки, типизация, компонентный подход.' },
    { icon: PenTool, title: 'UI / UX', desc: 'Интерфейсы с акцентом на ясность, доступность и визуальную согласованность.' },
    { icon: Zap, title: 'Производительность', desc: 'Оптимизация загрузки, ленивая подгрузка, плавные анимации.' },
    { icon: Layers, title: 'Дизайн‑системы', desc: 'Компоненты, токены, гайдлайны для масштабируемых продуктов.' },
    { icon: Sparkles, title: 'Motion & микровзаимодействия', desc: 'Анимации, которые помогают понимать интерфейс.' },
    { icon: Layers, title: 'Tailwind & CSS', desc: 'Утилитарный CSS, кастомные свойства, адаптивная вёрстка.' },
  ];

  const stats = [
    { label: 'Проектов в портфолио', value: 12, suffix: '+' },
    { label: 'Лет в веб‑разработке', value: 5, suffix: '+' },
    { label: 'Open source репозиториев', value: 8, suffix: '+' },
    { label: 'Чашек кофе в неделю', value: 14, suffix: '' },
  ];

  const projects = [
    {
      title: 'E‑commerce Dashboard',
      description: 'Админ‑панель с графиками, таблицами и тёмной темой. React, Recharts, Tailwind.',
      tags: ['React', 'TypeScript', 'Tailwind'],
      href: '#',
      gradient: 'from-cyan-500/20 to-sky-600/20',
    },
    {
      title: 'Landing для стартапа',
      description: 'Одностраничник с анимациями при скролле и формой захвата лидов.',
      tags: ['React', 'Framer Motion', 'Vite'],
      href: '#',
      gradient: 'from-violet-500/20 to-fuchsia-600/20',
    },
    {
      title: 'Мобильное приложение (PWA)',
      description: 'Прогрессивное веб‑приложение с офлайн‑режимом и push‑уведомлениями.',
      tags: ['PWA', 'React', 'Workbox'],
      href: '#',
      gradient: 'from-amber-500/20 to-orange-600/20',
    },
    {
      title: 'Портфолио‑сайт',
      description: 'Персональный сайт с секциями проектов, навыков и контактов. Этот же стек.',
      tags: ['React', 'Tailwind', 'Vite'],
      href: '#',
      gradient: 'from-emerald-500/20 to-teal-600/20',
    },
  ];

  const recommendations = [
    { name: 'Анна Мороз', role: 'Team Lead, Product', quote: 'Надёжный разработчик: всегда в срок, код чистый, с дизайном на одной волне.' },
    { name: 'Игорь Белый', role: 'CEO, Startup', quote: 'Помог вывести продукт из прототипа в прод. Рекомендую для сложных интерфейсов.' },
    { name: 'Мария Лебедева', role: 'Designer', quote: 'Приятно работать в одной команде: слышит фидбек и доводит детали до конца.' },
  ];

  const faqs = [
    { q: 'Где ты находишься?', a: 'Работаю удалённо. Часовой пояс — UTC+3, открыт к созвонам по Европе и СНГ.' },
    { q: 'Как с тобой связаться?', a: 'Лучше всего по email (см. блок «Контакты») или через LinkedIn. Отвечаю в течение 1–2 дней.' },
    { q: 'Ты доступен для проектов?', a: 'Да. Открыт к фрилансу, контрактам и полноценной занятости в сильных продуктовых командах.' },
    { q: 'Делаешь ли фриланс?', a: 'Да. Готов к разовым задачам и долгосрочному сотрудничеству — напиши, обсудим формат.' },
  ];

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <style>{`
        :root {
          --bg-primary: #050816;
          --accent-from: #22d3ee;
          --accent-to: #a855f7;
          --card-bg: rgba(15, 23, 42, 0.85);
          --border: rgba(148, 163, 184, 0.35);
        }

        html, body {
          scroll-behavior: smooth;
          background-color: var(--bg-primary);
        }

        .page-gradient {
          background:
            radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 55%),
            radial-gradient(circle at top right, rgba(168, 85, 247, 0.18), transparent 55%),
            radial-gradient(circle at bottom, rgba(14, 165, 233, 0.12), transparent 55%),
            #020617;
        }

        .section-hidden {
          opacity: 0;
          transform: translateY(40px);
        }

        .section-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .section-animate {
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .hero-content {
          opacity: 0;
          transform: translateY(40px);
          animation-fill-mode: forwards;
        }

        .hero-content.hero-visible {
          animation: fadeInUp 0.9s ease-out forwards;
        }

        .hero-content.hero-visible[data-delay="1"] {
          animation-delay: 0.1s;
        }
        .hero-content.hero-visible[data-delay="2"] {
          animation-delay: 0.2s;
        }
        .hero-content.hero-visible[data-delay="3"] {
          animation-delay: 0.3s;
        }

        .btn-glow {
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease;
        }

        .btn-glow:hover {
          transform: scale(1.05) translateY(-1px);
          box-shadow: 0 0 35px rgba(56, 189, 248, 0.45);
        }

        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 0 40px rgba(56, 189, 248, 0.35);
          border-color: var(--accent-from);
          background: rgba(15, 23, 42, 0.95);
        }

        .blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(55px);
          opacity: 0.65;
          mix-blend-mode: screen;
          animation: float 18s ease-in-out infinite alternate;
        }

        .blob:nth-child(2) {
          animation-duration: 22s;
          animation-delay: -4s;
        }
        .blob:nth-child(3) {
          animation-duration: 26s;
          animation-delay: -8s;
        }

        .faq-panel {
          overflow: hidden;
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) scale(1);
          }
          50% {
            transform: translateY(-20px) translateX(10px) scale(1.08);
          }
          100% {
            transform: translateY(10px) translateX(-10px) scale(1.02);
          }
        }
      `}</style>

      <div className="pointer-events-none" aria-hidden="true">
        <div className="blob w-[420px] h-[420px] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.6),transparent_55%)] top-[-120px] left-[-80px]" />
        <div className="blob w-[520px] h-[520px] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.55),transparent_55%)] top-[40%] right-[-180px]" />
        <div className="blob w-[380px] h-[380px] bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.45),transparent_55%)] bottom-[-160px] left-[12%]" />
      </div>

      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-[0_18px_40px_rgba(15,23,42,0.9)]'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-6">
          <button
            className="flex items-center gap-2 text-slate-100"
            onClick={(e) => handleNavClick(e as any, 'hero')}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] shadow-[0_0_32px_rgba(56,189,248,0.6)]">
              <Code2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold tracking-tight">Aziz</span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Frontend & UI
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={(e) => handleNavClick(e, item.id)}
                className="text-slate-300 hover:text-sky-300 transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => handleNavClick(e, 'cta')}
              className="hidden md:inline-flex btn-glow items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-5 py-2.5 text-sm font-medium text-slate-900 shadow-[0_0_28px_rgba(56,189,248,0.8)]"
            >
              <span>Написать</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-900/60 backdrop-blur-lg"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden transform transition-transform duration-300 origin-top ${
            mobileOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur-2xl p-4 space-y-2">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={(e) => handleNavClick(e, item.id)}
                className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800/70"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={(e) => handleNavClick(e, 'cta')}
              className="mt-2 inline-flex w-full justify-center btn-glow items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-4 py-2.5 text-sm font-semibold text-slate-900"
            >
              Написать
            </button>
          </div>
        </div>
      </header>

      <main className="relative page-gradient">
        {/* HERO */}
        <section id="hero" className="relative pt-28 md:pt-32 pb-20 md:pb-28">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.16]">
            <div className="absolute inset-x-6 top-24 bottom-6 rounded-[32px] border border-dashed border-slate-700/70" />
            <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.6),transparent_60%)]" />
          </div>

          <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8 md:flex-row md:items-center">
            <div className={`hero-content ${heroVisible ? 'hero-visible' : ''}`} data-delay="1">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300 backdrop-blur-xl">
                <Sparkles className="h-3 w-3 text-sky-300" />
                <span>Frontend • UI • React</span>
              </span>

              <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl lg:text-[3.7rem] font-semibold leading-tight tracking-tight">
                <span className="block text-slate-50">Привет, я</span>
                <span className="mt-1 block bg-gradient-to-r from-[var(--accent-from)] via-cyan-400 to-[var(--accent-to)] bg-clip-text text-transparent">
                  Aziz.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm sm:text-base text-slate-300">
                Делаю интерфейсы на React: от лендингов до дашбордов. Люблю чёткую типографику, плавные анимации и код, который легко поддерживать.
              </p>

              <div
                className={`mt-7 flex flex-wrap items-center gap-4 hero-content ${
                  heroVisible ? 'hero-visible' : ''
                }`}
                data-delay="2"
              >
                <button
                  onClick={(e) => handleNavClick(e as any, 'work')}
                  className="btn-glow inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-7 py-3.5 text-sm sm:text-base font-semibold text-slate-900 shadow-[0_0_40px_rgba(56,189,248,0.8)]"
                >
                  Смотреть проекты
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => handleNavClick(e as any, 'cta')}
                  className="btn-glow inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-slate-950/60 px-6 py-3 text-sm sm:text-base font-medium text-slate-100 hover:border-sky-400/60"
                >
                  Написать мне
                </button>
              </div>

              <div
                className={`mt-8 flex flex-wrap items-center gap-5 text-xs text-slate-400 hero-content ${
                  heroVisible ? 'hero-visible' : ''
                }`}
                data-delay="3"
              >
                <span>Открыт к новым проектам</span>
                <span className="h-1 w-1 rounded-full bg-slate-500" />
                <span>Удалённо • UTC+3</span>
              </div>
            </div>

            <div className="relative mt-10 md:mt-0 md:flex-1">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.3),transparent_70%)] opacity-50" />
              <div className="relative mx-auto max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.9)] backdrop-blur-2xl card-hover">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="truncate text-[11px]">aziz.dev</span>
                </div>

                <div className="mt-3 space-y-4">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/70 to-slate-900/40 p-4 border border-white/10">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent opacity-80" />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Сейчас</p>
                    <p className="mt-1 text-lg font-semibold text-slate-50">Фокус на продуктах</p>
                    <p className="mt-1 text-xs text-slate-300">
                      React, TypeScript, дизайн‑системы и быстрые прототипы.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <span className="inline-flex items-center rounded-full bg-sky-500/15 px-2 py-1 text-[10px] text-sky-300">
                        React
                      </span>
                      <span className="inline-flex items-center rounded-full bg-fuchsia-500/15 px-2 py-1 text-[10px] text-fuchsia-300">
                        UI
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-3">
                      <p className="text-slate-400">Проектов</p>
                      <p className="mt-1 text-xl font-semibold text-emerald-300">12+</p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        в портфолио
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-3">
                      <p className="text-slate-400">Опыт</p>
                      <p className="mt-1 text-xl font-semibold text-sky-300">5+</p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        лет в вебе
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-dashed border-slate-700/70 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-300">
                    <span>Открыт к коллаборациям</span>
                    <ArrowRight className="h-3.5 w-3.5 text-sky-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          ref={aboutRef as any}
          className={`relative py-16 md:py-20 section-animate ${
            aboutInView ? 'section-visible' : 'section-hidden'
          }`}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-white/10 bg-[var(--card-bg)]/90 p-6 sm:p-8 md:p-10 backdrop-blur-2xl card-hover">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
                Обо мне
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
                Фронтенд-разработчик с упором на интерфейсы
              </h2>
              <p className="mt-4 max-w-2xl text-sm md:text-base text-slate-300 leading-relaxed">
                Пишу на React и TypeScript, верстаю с Tailwind, люблю продуманные анимации и читаемый код.
                Работал над лендингами, дашбордами и продуктовыми интерфейсами. Сейчас открыт к новым проектам:
                фриланс, контракт или полноценная занятость в продуктовой команде.
              </p>
              <p className="mt-3 text-sm text-slate-400">
                Базируюсь удалённо, удобный часовой пояс — UTC+3. Связаться можно по почте или через соцсети внизу страницы.
              </p>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section
          id="skills"
          ref={skillsRef as any}
          className={`relative py-16 md:py-20 section-animate ${
            skillsInView ? 'section-visible' : 'section-hidden'
          }`}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
                  Чем пользуюсь
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
                  Навыки и инструменты
                </h2>
                <p className="mt-3 max-w-xl text-sm md:text-base text-slate-300">
                  Стек и подход: от вёрстки и компонентов до дизайн‑систем и анимаций.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <article
                    key={skill.title}
                    className="group card-hover flex flex-col rounded-2xl border border-white/10 bg-[var(--card-bg)]/90 p-4 sm:p-5 backdrop-blur-2xl"
                    style={{ transitionDelay: `${index * 60}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-from)]/90 to-[var(--accent-to)]/80 text-slate-950 shadow-[0_0_25px_rgba(56,189,248,0.9)]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base sm:text-lg font-semibold text-slate-50">
                      {skill.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">{skill.desc}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--accent-from)]/70 to-transparent opacity-70" />
        </div>

        {/* STATS */}
        <section
          id="stats"
          ref={statsRef as any}
          className={`relative py-14 md:py-18 section-animate ${
            statsInView ? 'section-visible' : 'section-hidden'
          }`}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 md:grid-cols-[1.2fr,1fr] md:items-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
                  В цифрах
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
                  Немного фактов
                </h2>
                <p className="mt-3 text-sm md:text-base text-slate-300">
                  Проекты, опыт и привычки — коротко и по делу.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-5 md:gap-6">
                {stats.map((s) => (
                  <AnimatedStat
                    key={s.label}
                    label={s.label}
                    value={s.value}
                    suffix={s.suffix}
                    inView={statsInView}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section
          id="work"
          ref={projectsRef as any}
          className={`relative py-16 md:py-20 section-animate ${
            projectsInView ? 'section-visible' : 'section-hidden'
          }`}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
                  Избранное
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
                  Проекты
                </h2>
                <p className="mt-3 max-w-xl text-sm md:text-base text-slate-300">
                  Лендинги, дашборды и веб‑приложения — то, над чем работал в последнее время.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {projects.map((project, index) => (
                <a
                  key={project.title}
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group card-hover flex flex-col rounded-2xl border border-white/10 bg-[var(--card-bg)]/95 overflow-hidden backdrop-blur-2xl"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className={`aspect-video bg-gradient-to-br ${project.gradient} border-b border-white/10 flex items-center justify-center`}>
                    <Code2 className="h-10 w-10 text-white/30" />
                  </div>
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h3 className="text-base font-semibold text-slate-50 group-hover:text-sky-200 transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-300 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-slate-800/60 px-2 py-0.5 text-[10px] text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs text-sky-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Смотреть
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* RECOMMENDATIONS */}
        <section
          id="recommendations"
          ref={recommendationsRef as any}
          className={`relative py-16 md:py-20 section-animate ${
            recommendationsInView ? 'section-visible' : 'section-hidden'
          }`}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
                  Отзывы
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
                  Что говорят коллеги и заказчики
                </h2>
                <p className="mt-3 max-w-xl text-sm md:text-base text-slate-300">
                  Краткие рекомендации от тех, с кем работал в команде или над проектами.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 md:mt-0">
                <Star className="h-4 w-4 text-amber-300 fill-amber-300" />
                <span>Рекомендации с LinkedIn</span>
              </div>
            </div>

            <div className="mt-8 overflow-x-auto pb-2">
              <div className="flex gap-5 md:grid md:grid-cols-3 md:gap-5 min-w-full">
                {recommendations.map((r, index) => (
                  <article
                    key={r.name}
                    className="min-w-[260px] flex-1 rounded-2xl border border-white/10 bg-[var(--card-bg)]/95 p-4 sm:p-5 backdrop-blur-2xl card-hover snap-start"
                    style={{ transitionDelay: `${index * 80}ms` }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] text-xs font-semibold text-slate-900">
                          {getInitials(r.name)}
                        </div>
                        <div className="leading-tight">
                          <p className="text-sm font-semibold text-slate-50">{r.name}</p>
                          <p className="text-[11px] text-slate-400">{r.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-300">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-300" />
                        ))}
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-200">“{r.quote}”</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          ref={faqRef as any}
          className={`relative py-16 md:py-20 section-animate ${
            faqInView ? 'section-visible' : 'section-hidden'
          }`}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-md">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
                  Частые вопросы
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
                  Частые вопросы
                </h2>
                <p className="mt-3 text-sm md:text-base text-slate-300">
                  Где я нахожусь, как связаться и открыт ли к проектам — коротко и по делу.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {faqs.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={item.q}
                    className="rounded-2xl border border-white/10 bg-[var(--card-bg)]/95 p-4 sm:p-5 backdrop-blur-2xl card-hover"
                  >
                    <button
                      className="flex w-full items-center justify-between gap-4 text-left"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                    >
                      <span className="text-sm sm:text-base font-medium text-slate-50">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className="faq-panel mt-2 text-xs sm:text-sm text-slate-300 transition-all duration-300"
                      style={{
                        maxHeight: isOpen ? '220px' : '0px',
                        opacity: isOpen ? 1 : 0,
                        marginTop: isOpen ? '0.5rem' : '0rem',
                      }}
                    >
                      <p>{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          id="cta"
          ref={ctaRef as any}
          className={`relative py-16 md:py-20 section-animate ${
            ctaInView ? 'section-visible' : 'section-hidden'
          }`}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--accent-from)] via-cyan-400 to-[var(--accent-to)] p-[1px] shadow-[0_24px_80px_rgba(8,47,73,0.8)]">
              <div className="relative flex flex-col items-start gap-6 rounded-[22px] bg-slate-950/95 px-6 py-8 sm:px-8 sm:py-10 md:flex-row md:items-center md:justify-between">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-8 top-0 h-40 w-40 rounded-full bg-cyan-400/30 blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-fuchsia-500/25 blur-3xl"
                />

                <div className="relative max-w-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
                    Связаться
                  </p>
                  <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
                    Давайте поработаем вместе
                  </h2>
                  <p className="mt-3 text-sm md:text-base text-slate-200">
                    Открыт к новым проектам: фриланс, контракт или полноценная занятость. Напишите на почту или в соцсети — отвечу в течение 1–2 дней.
                  </p>
                </div>

                <div className="relative flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="mailto:hello@example.com"
                    className="btn-glow inline-flex h-11 flex-none items-center justify-center gap-2 rounded-full bg-slate-50 px-6 text-xs sm:text-sm font-semibold text-slate-950 hover:bg-slate-200"
                  >
                    <Mail className="h-4 w-4" />
                    Написать на email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="relative border-t border-white/10 bg-slate-950/95 py-10 md:py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-[1.2fr,2fr] md:gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-100">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] shadow-[0_0_30px_rgba(56,189,248,0.7)]">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold tracking-tight">Aziz</span>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      Frontend & UI
                    </span>
                  </div>
                </div>
                <p className="max-w-sm text-sm text-slate-400">
                  Фронтенд-разработчик. React, TypeScript, интерфейсы и анимации. Открыт к проектам и коллаборациям.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>Работаю удалённо по всему миру</span>
                  <span className="h-1 w-1 rounded-full bg-slate-600" />
                  <span>Отвечаю в течение 24 часов</span>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <a
                    href="#"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-300 hover:text-sky-300"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-300 hover:text-sky-300"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-300 hover:text-sky-300"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-300 hover:text-sky-300"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 text-sm">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Навигация
                  </h4>
                  <button
                    onClick={(e) => handleNavClick(e as any, 'hero')}
                    className="block text-slate-300 hover:text-sky-300"
                  >
                    Главная
                  </button>
                  <button
                    onClick={(e) => handleNavClick(e as any, 'about')}
                    className="block text-slate-300 hover:text-sky-300"
                  >
                    Обо мне
                  </button>
                  <button
                    onClick={(e) => handleNavClick(e as any, 'work')}
                    className="block text-slate-300 hover:text-sky-300"
                  >
                    Проекты
                  </button>
                  <button
                    onClick={(e) => handleNavClick(e as any, 'recommendations')}
                    className="block text-slate-300 hover:text-sky-300"
                  >
                    Отзывы
                  </button>
                  <button
                    onClick={(e) => handleNavClick(e as any, 'faq')}
                    className="block text-slate-300 hover:text-sky-300"
                  >
                    FAQ
                  </button>
                  <button
                    onClick={(e) => handleNavClick(e as any, 'cta')}
                    className="block text-slate-300 hover:text-sky-300"
                  >
                    Контакты
                  </button>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Ресурсы
                  </h4>
                  <a href="#" className="block text-slate-300 hover:text-sky-300">
                    Резюме
                  </a>
                  <a href="#" className="block text-slate-300 hover:text-sky-300">
                    GitHub
                  </a>
                  <a href="#" className="block text-slate-300 hover:text-sky-300">
                    LinkedIn
                  </a>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Контакты
                  </h4>
                  <a
                    href="mailto:hello@example.com"
                    className="block text-slate-300 hover:text-sky-300"
                  >
                    hello@example.com
                  </a>
                  <span className="block text-slate-400">UTC+3</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
              <p>© {new Date().getFullYear()} Aziz. Портфолио.</p>
              <div className="flex flex-wrap items-center gap-3">
                <a href="#" className="hover:text-sky-300">
                  GitHub
                </a>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <a href="#" className="hover:text-sky-300">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default PortfolioLandingPage;

