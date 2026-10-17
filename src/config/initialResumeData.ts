import { DEFAULT_FIELD_ORDER } from "./constants";
import { GlobalSettings, DEFAULT_CONFIG, ResumeData } from "../types/resume";
const initialGlobalSettings: GlobalSettings = {
  baseFontSize: 16,
  pagePadding: 32,
  paragraphSpacing: 12,
  lineHeight: 1.5,
  sectionSpacing: 10,
  headerSize: 18,
  subheaderSize: 16,
  useIconMode: true,
  themeColor: "#000000",
  centerSubtitle: true,
};

const sampleCustomItem = (id: string, description: string) => ({
  id,
  title: "",
  subtitle: "",
  dateRange: "",
  description,
  visible: true,
});

export const initialResumeStateEn = {
  title: "New Resume",
  basic: {
    name: "Your Name",
    title: "BCA Student | Aspiring Full-Stack Developer",
    employementStatus: "",
    email: "yourname@example.com",
    phone: "+91 98765 43210",
    location: "Kanpur, Uttar Pradesh",
    birthDate: "",
    fieldOrder: DEFAULT_FIELD_ORDER,
    icons: {
      email: "Mail",
      phone: "Phone",
      birthDate: "CalendarRange",
      employementStatus: "Briefcase",
      location: "MapPin",
    },
    photoConfig: DEFAULT_CONFIG,
    customFields: [
      {
        id: "linkedin",
        label: "LinkedIn",
        value: "linkedin.com/in/yourname",
        icon: "Globe",
      },
      {
        id: "github",
        label: "GitHub",
        value: "github.com/yourname",
        icon: "Globe",
      },
    ],
    photo: "",
    githubKey: "",
    githubUseName: "",
    githubContributionsVisible: false,
  },
  education: [
    {
      id: "1",
      school: "Your University",
      major: "Computer Applications",
      degree: "Bachelor of Computer Applications (BCA)",
      startDate: "2023-07",
      endDate: "2026-06",
      visible: true,
      gpa: "CGPA: 8.0 / 10",
      description: `<ul>
        <li>Relevant coursework: Data Structures, DBMS, Operating Systems, Web Technologies, Python Programming</li>
      </ul>`,
    },
    {
      id: "2",
      school: "Your School",
      major: "Class XII (PCM)",
      degree: "",
      startDate: "2022-04",
      endDate: "2023-03",
      visible: true,
      gpa: "Percentage: 80%",
      description: "",
    },
    {
      id: "3",
      school: "Your School",
      major: "Class X",
      degree: "",
      startDate: "2020-04",
      endDate: "2021-03",
      visible: true,
      gpa: "Percentage: 85%",
      description: "",
    },
  ],
  skillContent: `<div class="skill-content">
  <ul>
    <li>Programming Languages: Python (Intermediate), Java (Basic), JavaScript (Intermediate)</li>
    <li>Web Technologies: HTML5, CSS3, React (Basic), Node.js (Basic)</li>
    <li>Databases: MySQL, MongoDB (Basic)</li>
    <li>Tools: Git, GitHub, VS Code, Postman</li>
  </ul>
</div>`,
  selfEvaluationContent: `<p>BCA student with hands-on project experience in web development and databases, seeking an entry-level software developer role to apply my programming skills, learn from experienced teams, and contribute to real-world products.</p>`,
  experience: [
    {
      id: "1",
      company: "Your Company Name",
      position: "Web Development Intern",
      date: "2025-06 - 2025-08",
      visible: true,
      details: `<ul>
      <li>Built 3 responsive pages using HTML, CSS and JavaScript, improving mobile usability for 100+ daily visitors</li>
      <li>Fixed 15+ UI bugs and wrote clear documentation for the team</li>
    </ul>`,
    },
  ],
  draggingProjectId: null,
  projects: [
    {
      id: "p1",
      name: "Campus E-Commerce Platform",
      role: "Team Lead (Team of 4)",
      date: "2025-01 - 2025-04",
      techStack: ["React", "Node.js", "MySQL"],
      duration: "4 months",
      description: `<ul>
        <li>Situation: students had no single place to buy and sell used books and equipment on campus</li>
        <li>Built product listing, cart and order modules, serving 50+ test users</li>
        <li>Result: reduced manual order handling by 60% during the demo</li>
      </ul>`,
      visible: true,
    },
    {
      id: "p2",
      name: "Library Management System",
      role: "Developer",
      date: "2024-08 - 2024-10",
      techStack: ["Python", "SQLite"],
      duration: "2 months",
      description: `<ul>
        <li>Designed a database with 5 tables to track books, members and fines</li>
        <li>Added search and overdue alerts, cutting lookup time from minutes to seconds</li>
      </ul>`,
      visible: true,
    },
  ],
  menuSections: [
    { id: "basic", title: "Profile", icon: "👤", enabled: true, order: 0 },
    { id: "selfEvaluation", title: "Career Objective", icon: "🎯", enabled: true, order: 1 },
    { id: "education", title: "Education", icon: "🎓", enabled: true, order: 2 },
    { id: "skills", title: "Technical Skills", icon: "⚡", enabled: true, order: 3 },
    { id: "custom-competencies", title: "Core Competencies", icon: "🧠", enabled: true, order: 4 },
    { id: "projects", title: "Projects", icon: "🚀", enabled: true, order: 5 },
    { id: "experience", title: "Internships / Work Experience", icon: "💼", enabled: true, order: 6 },
    { id: "certificates", title: "Certifications & Workshops", icon: "🏆", enabled: true, order: 7 },
    { id: "custom-achievements", title: "Achievements & Co-curricular", icon: "🥇", enabled: true, order: 8 },
    { id: "custom-personal", title: "Personal Details", icon: "📌", enabled: true, order: 9 },
  ],
  certificates: [
    { id: "c1", name: "Programming in Java", issuer: "NPTEL", date: "2024" },
    { id: "c2", name: "Python for Everybody", issuer: "Coursera", date: "2024" },
  ],
  customData: {
    "custom-competencies": [
      sampleCustomItem(
        "cc1",
        `<ul><li>Problem solving and logical thinking</li><li>Team collaboration</li><li>Quick learner</li><li>Clear communication</li></ul>`
      ),
    ],
    "custom-achievements": [
      sampleCustomItem(
        "ca1",
        `<ul><li>Winner, college coding contest (2024)</li><li>Volunteer, annual tech fest organising committee</li></ul>`
      ),
    ],
    "custom-personal": [
      sampleCustomItem(
        "cp1",
        `<p>Languages: English, Hindi</p><p>Location: Kanpur, Uttar Pradesh</p><p>References available on request</p>`
      ),
    ],
  },
  activeSection: "basic",
  globalSettings: initialGlobalSettings,
};

/** English is the only supported language; kept as an alias for older imports. */
export const initialResumeState = initialResumeStateEn;

export const blankResumeStateEn = {
  ...initialResumeStateEn,
  title: "New Resume",
  basic: {
    ...initialResumeStateEn.basic,
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    birthDate: "",
    employementStatus: "",
    photo: "",
    customFields: [],
  },
  education: [],
  skillContent: "",
  selfEvaluationContent: "",
  experience: [],
  projects: [],
  certificates: [],
  customData: {
    "custom-competencies": [sampleCustomItem("cc1", "")],
    "custom-achievements": [sampleCustomItem("ca1", "")],
    "custom-personal": [sampleCustomItem("cp1", "")],
  },
};

export const blankResumeState = blankResumeStateEn;
