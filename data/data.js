/* ============================================================
   data.js
   Ye file aapke poore portfolio ka "content" hai.
   Naam, tagline, bio, skills, projects, contact — sab kuch
   yahan hai. Website ka design (HTML/CSS/JS) bilkul touch
   kiye baghair, sirf isi file mein values badal kar aap
   poori site apne liye personalize kar sakte hain.
   ============================================================ */

const portfolioData = {

    // Browser tab ka title aur nav mein dikhne wala chhota naam/logo
    site: {
        title: "Zara Malik — Portfolio",
        logo: "ZM"
    },

    // Hero section (sabse pehli screen)
    hero: {
        eyebrow: "Creative Technologist",
        name: "Zara Malik",
        line1: "I design,",
        line2: "build & ship",
        line3: "digital things.",
        subtitle: "Multi-disciplinary maker working across product design, front-end development and 3D motion — turning rough ideas into polished, working experiences.",
        primaryCta: { label: "View My Work", href: "#work" },
        secondaryCta: { label: "Get In Touch", href: "#contact" }
    },

    // About section
    about: {
        eyebrow: "About",
        heading: "A little about how I work",
        paragraphs: [
            "I'm a multi-disciplinary creative based in Karachi, Pakistan — I spend my time moving between design tools and code editors, because the best ideas usually need both to feel finished.",
            "Over the last few years I've helped startups and small studios take products from a rough sketch to something people actually enjoy using — covering everything from brand identity to interactive front-ends and the occasional 3D experiment."
        ],
        stats: [
            { value: "30+", label: "Projects shipped" },
            { value: "5", label: "Years experience" },
            { value: "12", label: "Happy clients" }
        ]
    },

    // Skills section — groups of chips
    skills: {
        eyebrow: "Skills",
        heading: "Tools & things I'm good at",
        groups: [
            {
                title: "Design",
                items: ["Product Design", "Brand Identity", "Motion Design", "Figma", "UI Systems"]
            },
            {
                title: "Development",
                items: ["JavaScript", "React", "Three.js / WebGL", "CSS Animation", "Node.js"]
            },
            {
                title: "Practice",
                items: ["Prototyping", "Design Systems", "Agile Collaboration", "Accessibility"]
            }
        ]
    },

    // Work / Projects section
    work: {
        eyebrow: "Selected Work",
        heading: "Things I've recently built",
        projects: [
            {
                title: "Nimbus",
                category: "Web App",
                description: "A redesigned analytics dashboard for a SaaS startup — focused on making dense data feel calm and readable.",
                tags: ["Product Design", "React", "Data Viz"],
                gradient: ["#FF5F6D", "#7C4DFF"],
                href: "#"
            },
            {
                title: "Aurora",
                category: "Brand Identity",
                description: "Full brand identity for a wellness studio — logo, type system and print guidelines built around calm, organic shapes.",
                tags: ["Logo", "Brand Guidelines", "Print"],
                gradient: ["#7C4DFF", "#00D9C0"],
                href: "#"
            },
            {
                title: "Pulse",
                category: "Mobile App",
                description: "A fitness tracking app with a friendly, motion-led interface designed to make daily check-ins feel rewarding.",
                tags: ["iOS", "Flutter", "UI/UX"],
                gradient: ["#00D9C0", "#FFC65C"],
                href: "#"
            },
            {
                title: "Floating Type",
                category: "3D / Motion",
                description: "A generative WebGL experiment — gradient-lit typography that drifts and reacts to cursor movement in real time.",
                tags: ["WebGL", "Three.js", "Shader Art"],
                gradient: ["#FFC65C", "#FF5F6D"],
                href: "#"
            }
        ]
    },

    // Contact section
    contact: {
        eyebrow: "Contact",
        heading: "Let's build something together",
        text: "Have a project in mind, or just want to say hi? My inbox is open.",
        email: "hello@zaramalik.com",
        location: "Karachi, Pakistan",
        socials: [
            { name: "GitHub", href: "#" },
            { name: "LinkedIn", href: "#" },
            { name: "Behance", href: "#" },
            { name: "Instagram", href: "#" }
        ]
    },

    footer: {
        text: "Built with curiosity, coffee and a little too much WebGL."
    }
};
