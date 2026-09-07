export type RotatingItem = {
  text: string;
  subtext?: string;
  status?: "live" | "development" | "rebuild";
  trustIndicators?: string[];
};

export const site = {
  name: "SolvicoSoft",
  legalName: "SolvicoSoft",
  tagline: "Software products that replace the paperwork.",
  description:
    "SolvicoSoft makes its own systems for universities and colleges — hall meal management, outcome-based education, and CV tooling. You don't send us a brief and wait. You adopt something that already works, and we keep it working.",
  founded: "2025",
  url: "https://solvicosoft.com",
  social: {
    handle: "@solvicosoft",
    facebook: "https://facebook.com/solvicosoft",
    youtube: "https://youtube.com/solvicosoft",
    linkedin: "https://linkedin.com/company/solvicosoft",
  },

  contact: {
    email: "solvicosoft_agency@gmail.com",
    phone: "+880 1906 373908",
    phoneHref: "+8801906373908",
    addressLines: [
      "Level-04, Jahir Smart Tower",
      "Shameem Sharani, Shewrapara",
      "Dhaka 1207, Bangladesh",
    ],
    addressOneLine:
      "Level-04, Jahir Smart Tower, Shameem Sharani, Shewrapara, Dhaka 1207",
    street: "Level-04, Jahir Smart Tower, Shameem Sharani, Shewrapara",
    locality: "Dhaka",
    region: "Dhaka",
    postalCode: "1207",
    country: "Bangladesh",
    countryCode: "BD",
  },

  heroMeta: ["Software product company", "Founded 2025", "Dhaka, Bangladesh"],

  rotatingItems: [
    {
      text: "Software products that replace the paperwork.",
      subtext:
        "SolvicoSoft makes its own systems for universities and colleges — hall meal management, outcome-based education, and CV tooling. You don't send us a brief and wait. You adopt something that already works, and we keep it working.",
    },
    {
      text: "HMMS",
      subtext: "Hall Meal Management System — Live in Production",
    },
    {
      text: "OBE_SOFT",
      subtext: "Outcome Based Education System — Building for Accreditation",
    },
    {
      text: "VitaCraft",
      subtext: "A Dynamic CV Generator — Free for Everyone",
    },
  ] as RotatingItem[],

  about: {
    lead: "SolvicoSoft is a software product company building systems for universities and colleges. We design, build, and run our own products — hall meal management, outcome-based education, and CV tooling.",
    vision: "Our goal is simple: to streamline university operations so educators and administrators can focus on what matters most. Universities already face immense pressure; the software running in the background shouldn't add to that burden. We design intuitive systems that staff can master without weeks of training, and we stay by our clients' side with dedicated support long after the initial go-live.",
    mission: "To make technology an asset for the education sector — transforming how universities manage hall meals, track student outcomes, and help graduates build their careers. We build software that replaces paperwork, reduces manual effort, and provides real-time visibility into operations.",
    recognition: "SolvicoSoft has gained notable recognition in Bangladesh. We have developed a range of software applications including Hall Meal Management Systems, Outcome Based Education Systems, and CV Building tools — all designed specifically for the higher education sector.",
    success: "SolvicoSoft succeeded in building trust with universities and colleges. Our products are in production at institutions across Bangladesh, helping students, faculty, and administrators work more efficiently.",
    successBadges: ["BAUET", "Multiple Halls", "100+ Students"],
    infoSystems: [
      { name: "HMMS - Hall Meal Management System", type: "Paid" },
      { name: "OBE_SOFT - Outcome Based Education System", type: "Paid" },
      { name: "VitaCraft - A Dynamic CV Generator", type: "Free" }
    ]
  },

  model: {
    heading: "A product company, not a development agency",
    body: [
      "We choose the problem, build the product, and run it. What reaches an institution is software that already works, already has users, and already has the next release planned.",
      "So there is no brief to write, no estimate to wait for and no six-month build. You adopt a product, and it keeps improving after you do.",
    ],
  },

  pillars: [
    {
      title: "We build our own products",
      body: "Every product in the catalogue is ours: our decision to build it, our codebase, our roadmap. Nothing here was ordered by a client.",
    },
    {
      title: "We put them into production",
      body: "A product is not finished when it compiles. It is finished when real students, staff and administrators are using it on a normal Tuesday.",
    },
    {
      title: "We market and support them",
      body: "We take each product to the institutions it was built for, set it up with their data, and stay reachable afterwards.",
    },
    {
      title: "We keep improving them",
      body: "Fixes and features ship to everyone on the product. Adopting it early means it gets better around you, instead of freezing at handover.",
    },
  ],

  steps: [
    {
      n: "01",
      title: "Pick the product",
      body: "Read what it does and what each role gets. Everything on these pages is already built — what you see is what you would be running.",
    },
    {
      n: "02",
      title: "Get your instance set up",
      body: "Tell us your institution. We configure your instance, load the records you already keep, and walk each role through their part of it.",
    },
    {
      n: "03",
      title: "Run it, and keep getting releases",
      body: "You operate the product day to day. Hosting, upgrades and fixes stay with us, and every improvement lands on your instance too.",
    },
  ],

  stack: [
    { k: "Backend", v: "C# · ASP.NET Core" },
    { k: "Frontend", v: "React · TypeScript" },
    { k: "Data", v: "MySQL · PostgreSQL" },
    { k: "Hosting", v: "VPS / AWS" },
  ],

  stackNote:
    "One stack across every product. A fix to the way we handle authentication, reporting or deployment lands everywhere at once, and nothing in the catalogue is left on a version nobody remembers how to build.",

  leadership: [
    {
      name: "Hafiz Ahmed",
      title: "Founder, CEO & CTO",
      img: "/img/team-hafiz.webp",
      bio: "Founded SolvicoSoft to build software for problems he had watched go wrong on paper. Owns the architecture and the server side of every product — ASP.NET Core services, data models, deployment — and sets what the company builds next.",
      focus: ["Company direction", "Architecture", "Backend & data", "Deployment"],
    },
    {
      name: "Marzia Mahorin Khan Momo",
      title: "Co-Founder & Product Lead",
      img: "/img/team-momo.webp",
      bio: "Decides how each product behaves in front of the people who use it daily. Works through what a student, a tutor, a kitchen and a provost each need on screen, then holds the release to that standard.",
      focus: ["Product definition", "Interface & flow", "Release quality", "Documentation"],
    },
  ],

  testimonials: [
    {
      name: "Marzia Momo",
      role: "Student | Bonolota Hall",
      quote: "The face recognition system has made meal collection so much faster. No more lost cards or waiting in long queues! The system is incredibly efficient.",
      rating: 4.8,
    },
    {
      name: "Dr. Md. Almotasim Mahmud",
      role: "Hall Provost | Boral Hall",
      quote: "This system has completely transformed how we manage meals in our hall. The students love the convenience and the real-time updates are a game changer!",
      rating: 5.0,
    },
    {
      name: "Md. Nasir Uddin",
      role: "Faculty | Teachers Mess",
      quote: "Faculty dining is now organized and dignified. With pre-booking and automated billing, our teachers can focus on discussions rather than paperwork.",
      rating: 4.7,
    },
  ],

  technologies: [
    { name: "HTML5", category: "Frontend", icon: "SiHtml5" },
    { name: "CSS3", category: "Frontend", icon: "SiCss3" },
    { name: "Bootstrap", category: "Frontend", icon: "SiBootstrap" },
    { name: "JavaScript", category: "Frontend", icon: "SiJavascript" },
    { name: "TypeScript", category: "Frontend", icon: "SiTypescript" },
    { name: "React", category: "Frontend", icon: "SiReact" },
    { name: "C#", category: "Backend", icon: "SiCsharp" },
    { name: "ASP.NET Core", category: "Backend", icon: "SiDotnet" },
    { name: "MySQL", category: "Database", icon: "SiMysql" },
    { name: "PostgreSQL", category: "Database", icon: "SiPostgresql" },
    { name: "Redis", category: "Database", icon: "SiRedis" },
    { name: "MinIO", category: "Storage", icon: "SiMinio" },
    { name: "C++", category: "Systems", icon: "SiCplusplus" },
    { name: "Grafana", category: "Monitoring", icon: "SiGrafana" },
    { name: "Docker", category: "DevOps", icon: "SiDocker" },
    { name: "Caddy", category: "DevOps", icon: "SiCaddy" },
  ],

  roles: [
    {
      title: "Founder & CEO",
      body: "Sets company direction, decides which problems become products, and answers for what ships.",
    },
    {
      title: "Co-Founder",
      body: "Shares ownership of the company and its roadmap, and leads how each product behaves for the people using it.",
    },
    {
      title: "CTO",
      body: "Owns the architecture across the catalogue: services, data models, and the one stack every product is built on.",
    },
    {
      title: "Product Manager",
      body: "Decides what belongs in the next release and what gets refused so the rest stays reliable.",
    },
    {
      title: "Business Analyst",
      body: "Reads the register, the spreadsheet and the approval chain an institution runs today, and works out what the software has to match before anyone will trust it.",
    },
    {
      title: "Developer",
      body: "Builds and maintains the products — ASP.NET Core services, React and TypeScript interfaces, MySQL underneath.",
    },
    {
      title: "UI / UX Designer",
      body: "Lays out screens for people who did not ask for new software: readable at a glance, obvious on a phone, honest about what an action will do.",
    },
    {
      title: "QA Engineer",
      body: "Exercises each release against realistic institutional data — a full month of meals, a whole cohort of marks — before it reaches a production instance.",
    },
    {
      title: "Deployment & Support",
      body: "Hosting, backups, upgrades and migrations, plus answering the message when something looks wrong.",
    },
  ],

  declines: [
    "Build-to-order software written from a specification",
    "Staff placement or hourly development work",
    "Redesigns and maintenance of systems we did not build",
    "Anything that would pull attention off the products in the catalogue",
  ],

  demoCta: {
    heading: "Ready to See a Demo?",
    body: "Request a demo, and we will walk you through the SolvicoSoft platform using your institution's actual workflow as the example. You will see how hall meal management, outcome-based education, and CV building work together in one system. We serve institutions of all sizes, from small colleges to large universities. If you have specific requirements, bring them to the demo, and we will show you how our systems handle them.",
    buttonLabel: "Request a Demo",
  },
} as const;

export const nav = [
  { href: "/", label: "Home" },
  {
    label: "Our Services",
    children: [
      { href: "/products/hmms", label: "Meal Management" },
      { href: "/products/obe", label: "Education Management" },
      { href: "/products/vitacraft", label: "CV/Resume Builder" },
    ],
  },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
] as const;

export const navCta = { href: "/contact", label: "Request a Demo" } as const;