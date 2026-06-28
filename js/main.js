/* ============================================================
   main.js
   Ye file:
   1) data.js (portfolioData) se content le kar HTML mein bharti hai
   2) Nav, mobile menu, scroll-spy handle karti hai
   3) Custom gradient cursor chalati hai
   4) Scroll-reveal animations aur project-card 3D tilt karti hai
   ============================================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    renderContent();
    runLoader();
    setupNav();
    setupScrollSpy();
    setupRevealObserver();
    setupCursor();
    setupCardTilt();
});

/* ====================== 1. RENDER CONTENT FROM data.js ====================== */

function renderContent() {
    const d = portfolioData;
    document.title = d.site.title;
    document.getElementById('navLogo').textContent = d.site.logo;

    // Hero
    document.getElementById('heroEyebrow').textContent = d.hero.eyebrow;
    document.getElementById('heroLine1').textContent = d.hero.line1;
    document.getElementById('heroLine2').textContent = d.hero.line2;
    document.getElementById('heroLine3').textContent = d.hero.line3;
    document.getElementById('heroSubtitle').textContent = d.hero.subtitle;

    const primaryCta = document.getElementById('heroPrimaryCta');
    primaryCta.textContent = d.hero.primaryCta.label;
    primaryCta.href = d.hero.primaryCta.href;

    const secondaryCta = document.getElementById('heroSecondaryCta');
    secondaryCta.textContent = d.hero.secondaryCta.label;
    secondaryCta.href = d.hero.secondaryCta.href;

    // About
    document.getElementById('aboutEyebrow').textContent = d.about.eyebrow;
    document.getElementById('aboutHeading').textContent = d.about.heading;

    const aboutText = document.getElementById('aboutText');
    aboutText.innerHTML = d.about.paragraphs
        .map(p => `<p class="reveal">${p}</p>`)
        .join('');

    const aboutStats = document.getElementById('aboutStats');
    aboutStats.innerHTML = d.about.stats.map(stat => `
        <div class="stat-card reveal">
            <div class="stat-value">${stat.value}</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `).join('');

    // Skills
    document.getElementById('skillsEyebrow').textContent = d.skills.eyebrow;
    document.getElementById('skillsHeading').textContent = d.skills.heading;

    const skillsGrid = document.getElementById('skillsGrid');
    skillsGrid.innerHTML = d.skills.groups.map(group => `
        <div class="skill-group reveal">
            <h3>${group.title}</h3>
            <div class="skill-chips">
                ${group.items.map(item => `<span class="skill-chip">${item}</span>`).join('')}
            </div>
        </div>
    `).join('');

    // Work
    document.getElementById('workEyebrow').textContent = d.work.eyebrow;
    document.getElementById('workHeading').textContent = d.work.heading;

    const workGrid = document.getElementById('workGrid');
    workGrid.innerHTML = d.work.projects.map(project => `
        <a href="${project.href}" class="project-card reveal" style="--card-gradient: linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})">
            <span class="project-glow"></span>
            <span class="project-category">${project.category}</span>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-desc">${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
            </div>
            <span class="project-link">View project <span class="arrow">→</span></span>
        </a>
    `).join('');

    // Contact
    document.getElementById('contactEyebrow').textContent = d.contact.eyebrow;
    document.getElementById('contactHeading').textContent = d.contact.heading;
    document.getElementById('contactText').textContent = d.contact.text;

    const emailLink = document.getElementById('contactEmail');
    emailLink.textContent = d.contact.email;
    emailLink.href = `mailto:${d.contact.email}`;

    document.getElementById('contactLocation').textContent = d.contact.location;

    const socials = document.getElementById('contactSocials');
    socials.innerHTML = d.contact.socials
        .map(s => `<a href="${s.href}" target="_blank" rel="noopener">${s.name}</a>`)
        .join('');

    // Footer
    document.getElementById('footerText').textContent = d.footer.text;
}

/* ====================== 2. PRELOADER ====================== */

function runLoader() {
    const loader = document.getElementById('loader');
    const progressBar = document.getElementById('loaderProgress');

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 18 + 8;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            progressBar.style.width = progress + '%';
            setTimeout(() => {
                loader.classList.add('is-hidden');
                revealHeroSequence();
            }, 250);
            return;
        }
        progressBar.style.width = progress + '%';
    }, 140);
}

function revealHeroSequence() {
    const heroEls = document.querySelectorAll('.hero .reveal');
    heroEls.forEach((el, i) => {
        setTimeout(() => el.classList.add('is-visible'), i * 130);
    });
}

/* ====================== 3. NAV ====================== */

function setupNav() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('is-scrolled', window.scrollY > 30);
    }, { passive: true });

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('is-open');
        toggle.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile menu after tapping a link
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('is-open');
            toggle.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

/* ====================== 4. SCROLL-SPY (active nav link) ====================== */

function setupScrollSpy() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: '-45% 0px -45% 0px' });

    sections.forEach(section => observer.observe(section));
}

/* ====================== 5. SCROLL REVEAL ====================== */

function setupRevealObserver() {
    const revealEls = Array.from(document.querySelectorAll('.reveal')).filter(el => !el.closest('.hero'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
}

/* ====================== 6. CUSTOM CURSOR ====================== */

function setupCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    document.querySelectorAll('a, button, .skill-chip').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
        el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
    });

    function followCursor() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(followCursor);
    }
    followCursor();
}

/* ====================== 7. 3D TILT ON PROJECT CARDS ====================== */

function setupCardTilt() {
    if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

    // Cards are rendered dynamically, so use event delegation on the grid
    const grid = document.getElementById('workGrid');

    grid.addEventListener('mousemove', (e) => {
        const card = e.target.closest('.project-card');
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const rotateX = (-y * 10).toFixed(2);
        const rotateY = (x * 12).toFixed(2);

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    grid.addEventListener('mouseleave', (e) => {
        const card = e.target.closest('.project-card');
        if (!card) return;
        card.style.transform = '';
    }, true);

    // mouseleave on individual cards (delegation needs capture for leave events)
    grid.addEventListener('mouseout', (e) => {
        const card = e.target.closest('.project-card');
        const toCard = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.project-card');
        if (card && card !== toCard) {
            card.style.transform = '';
        }
    });
}
