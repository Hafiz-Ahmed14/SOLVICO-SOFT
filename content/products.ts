

export type ProductStatus = "live" | "development";

export type Product = {
  slug: string;
  name: string;
  fullName: string;
  code: string;
  status: ProductStatus;
  statusLabel: string;
  liveUrl?: string;
  liveLabel?: string;
  oneLine: string;
  summary: string;
  audience: string;
  since: string;
  isFree?: boolean;
  screenshot?: { src: string; alt: string; caption: string; width: number; height: number };
  capabilities: { title: string; body: string }[];
  roles: { name: string; items: string[] }[];
  showMatrix?: boolean;
};

export const products: Product[] = [
  {
    slug: "hmms",
    name: "HMMS",
    fullName: "Hall Meal Management System",
    code: "Product 01",
    status: "live",
    statusLabel: "Live",
    liveUrl: "https://bauet-hmms.runasp.net/bauet/home",
    liveLabel: "bauet-hmms.runasp.net",
    oneLine: "Meal registers, costs and month-end accounts for a residential hall.",
    summary:
      "A residential hall runs on a paper meal register: who ate, who switched off, what it cost, who still owes. HMMS replaces that register. Students set meals on and off from a phone, house tutors approve the exceptions, staff see tomorrow's headcount before they shop, and the provost gets the month's cost without adding anything up.",
    audience: "University and college residential halls",
    since: "In production at a university residential hall",
    screenshot: {
      src: "/img/bauet-hmms-main.png",
      alt: "The HMMS home page, offering separate student and administrator sign-in for a university hall meal management system.",
      caption: "The live deployment — in production",
      width: 1600,
      height: 868,
    },
    capabilities: [
      {
        title: "Meal on / off",
        body: "Students set their own meals for the days ahead and see their credit and balance without asking anyone.",
      },
      {
        title: "Late exceptions",
        body: "Forgot to switch off? Submit a request. The house tutor approves or declines it, and the register stays correct.",
      },
      {
        title: "Meal calendar",
        body: "One calendar for the month with announcements attached, so nobody is guessing what is being served.",
      },
      {
        title: "Daily and monthly cost",
        body: "Per-day and per-month cost per student, calculated from the register rather than reconstructed at month end.",
      },
      {
        title: "Kitchen headcount",
        body: "Staff see the on/off list for each day and plan purchasing against a real number.",
      },
      {
        title: "Feedback on record",
        body: "Students rate and comment on meals, giving the provost something better than hearsay to act on.",
      },
    ],
    roles: [
      {
        name: "Student",
        items: [
          "View and select the daily meal",
          "Track meal credits and balance",
          "Request a correction after a missed meal on/off",
          "See the meal calendar and hall announcements",
          "Rate meals and leave feedback",
        ],
      },
      {
        name: "House tutor",
        items: [
          "Approve or decline student meal requests",
          "Monitor meal participation across the hall",
          "Generate hall meal cost reports",
          "Review individual student meal cost",
          "Raise issues with the hall provost",
        ],
      },
      {
        name: "Kitchen staff",
        items: [
          "Work from the daily meal on/off list",
          "Manage daily meal preparation",
          "Track inventory and supplies",
          "Publish the meal plan",
          "Enter daily and monthly meal cost",
        ],
      },
      {
        name: "Hall provost",
        items: [
          "Oversee the whole meal plan",
          "Financial oversight and reporting",
          "Approve special requests",
          "Configure the system for the hall",
          "Manage users and permissions",
        ],
      },
    ],
  },

  {
    slug: "obe",
    name: "OBE_SOFT",
    fullName: "Outcome Based Education System",
    code: "Product 02",
    status: "development",
    statusLabel: "In development",
    oneLine: "CO–PO mapping and attainment reporting for accreditation.",
    summary:
      "Accreditation asks a department to prove that each course outcome feeds the programme outcomes, and that students actually attained them. Most departments answer with a stack of spreadsheets rebuilt every cycle. OBE_SOFT holds the mapping and the marks in one place, so attainment is computed from assessment data and the report is a query rather than a project.",
    audience: "Engineering departments and accreditation committees",
    since: "Building now — first deployment in preparation",
    showMatrix: false,
    screenshot: {
      src: "/img/obe-soft-main.png",
      alt: "OBE_SOFT - Outcome Based Education System dashboard showing CO-PO mapping and attainment tracking.",
      caption: "OBE_SOFT — Outcome Based Education System",
      width: 1600,
      height: 868,
    },
    capabilities: [
      {
        title: "Outcome mapping",
        body: "Map course outcomes to programme outcomes and institutional objectives, and see the whole matrix at once.",
      },
      {
        title: "Assessment tracking",
        body: "Tie every assessment item to the outcome it measures, so marks carry meaning beyond a total.",
      },
      {
        title: "Rubric management",
        body: "Define rubrics once and apply them consistently, so two teachers scoring the same outcome mean the same thing.",
      },
      {
        title: "Attainment calculation",
        body: "CO and PO attainment computed from entered marks, with the gap visible per course and per cohort.",
      },
      {
        title: "Accreditation reporting",
        body: "Produce the outcome evidence an accreditation visit asks for, from data already in the system.",
      },
      {
        title: "Continuous improvement",
        body: "Track what was changed in response to a shortfall and whether attainment moved the next cycle.",
      },
    ],
    roles: [
      {
        name: "Administrator",
        items: [
          "System configuration and setup",
          "User management and permissions",
          "Institutional outcome framework",
          "Accreditation reporting tools",
          "Data analytics dashboard",
          "Institution-wide assessment coordination",
        ],
      },
      {
        name: "Head of department",
        items: [
          "Programme outcome monitoring",
          "Department-level assessment coordination",
          "Curriculum alignment tools",
          "Faculty coverage tracking",
          "Programme improvement planning",
          "Comparative analysis reports",
        ],
      },
      {
        name: "Teacher",
        items: [
          "Course outcome mapping",
          "Assessment creation and management",
          "Student performance tracking",
          "Rubric development and application",
          "Individual progress reports",
          "Curriculum improvement notes",
        ],
      },
      {
        name: "Batch advisor",
        items: [
          "Cohort performance tracking",
          "Early warning for at-risk students",
          "Advising session records",
          "Individual learning path notes",
          "Progress reporting",
          "Coordination with faculty",
        ],
      },
      {
        name: "PCO committee",
        items: [
          "Programme outcome assessment",
          "Curriculum evaluation dashboard",
          "Continuous improvement tracking",
          "Accreditation documentation",
          "Stakeholder feedback analysis",
          "Action plan development",
        ],
      },
      {
        name: "Student",
        items: [
          "Personal learning dashboard",
          "Outcome progress tracking",
          "Assessment results and feedback",
          "Recommended learning resources",
          "Portfolio development",
          "Advisor communication",
        ],
      },
    ],
  },

  {
    slug: "vitacraft",
    name: "VitaCraft",
    fullName: "A Dynamic CV Generator",
    code: "Product 03",
    status: "development",
    statusLabel: "Free for Everyone",
    oneLine: "Fill in the blanks, pick a template, download a clean CV.",
    summary:
      "Most students lose an afternoon to a word processor before their first application and still hand in something misaligned. VitaCraft asks for the content in a form, renders it into a template that was laid out properly, and exports a PDF. It's completely free for everyone to use.",
    audience: "Students and early-career applicants",
    since: "Free for all — no cost, no limits",
    isFree: true,
    screenshot: {
      src: "/img/vitacraft-main.png",
      alt: "The VitaCraft CV builder home page, with a Create CV call to action and template navigation.",
      caption: "VitaCraft — Free CV Builder",
      width: 1600,
      height: 792,
    },
    capabilities: [
      {
        title: "Template library",
        body: "Several finished layouts, including a plain formal one for academic and public-sector applications.",
      },
      {
        title: "Form-driven editing",
        body: "Enter experience, education and skills as fields. Spacing and alignment are the template's job, not yours.",
      },
      {
        title: "Custom CV builder",
        body: "Add, remove and reorder sections when the standard shape does not fit what you need to show.",
      },
      {
        title: "PDF export",
        body: "Download a print-ready PDF that keeps its layout when it lands in somebody else's inbox.",
      },
      {
        title: "Live preview",
        body: "See the rendered CV beside the form while you fill it in, so nothing is a surprise at export.",
      },
      {
        title: "Works on a phone",
        body: "The builder is usable on the device most students actually have to hand.",
      },
    ],
    roles: [],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export const productSlugs = products.map((p) => p.slug);