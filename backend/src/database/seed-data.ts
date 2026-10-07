import { UserRole, JobType } from "../common/enums";

export interface SeedJob {
  title: string;
  description: string;
  requirements?: string;
  type: JobType;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  isActive?: boolean;
}

export interface SeedCompany {
  email: string;
  name: string;
  description: string;
  website: string;
  location: string;
  jobs: SeedJob[];
}

export const SEED_PASSWORD = "lRYGrzau5WtLDS57";

export const seedCompanies: SeedCompany[] = [
  {
    email: "wahj@example.com",
    name: "Wahj",
    description:
      "A Palestinian software startup based in Hebron. We turn ideas into digital products and offer a full set of services for teams that want to build and grow online.",
    website: "https://wahj.co",
    location: "Hebron",
    jobs: [
      {
        title: "Frontend Development Intern",
        description:
          "Learn by shipping. You will work on real client interfaces alongside our team, with review and feedback at every step.",
        requirements: "HTML, CSS, JavaScript basics, some React exposure.",
        type: JobType.INTERNSHIP,
        location: "Hebron",
        salaryMin: 1000,
        salaryMax: 1800,
      },
      {
        title: "UI/UX Designer",
        description:
          "Design the interfaces for our client projects. A part time role for a designer who thinks in systems, not just screens.",
        requirements: "Figma, design systems, a portfolio of shipped work.",
        type: JobType.PART_TIME,
        location: "Hebron",
        salaryMin: 2500,
        salaryMax: 4500,
      },
      {
        title: "Full Stack Developer",
        description:
          "Own features end to end across our client products, from the database schema through to the interface the user touches.",
        requirements:
          "TypeScript, React, Node.js, relational databases, two years of experience.",
        type: JobType.FULL_TIME,
        location: "Hebron",
        salaryMin: 4500,
        salaryMax: 8000,
      },
    ],
  },
  {
    email: "asal@example.com",
    name: "ASAL Technologies",
    description:
      "A Palestinian software R&D and outsourcing company with offices across the West Bank and Gaza. We build frontend, backend, mobile and cloud systems for local and international partners.",
    website: "https://asaltech.com",
    location: "Rawabi",
    jobs: [
      {
        title: "Junior Full Stack Developer",
        description:
          "Join a delivery team building web applications for international clients. You will work across the stack, take ownership of features end to end, and review code with senior engineers.",
        requirements:
          "JavaScript or TypeScript, basic React, understanding of REST APIs, willingness to learn.",
        type: JobType.FULL_TIME,
        location: "Rawabi",
        salaryMin: 3000,
        salaryMax: 4500,
      },
      {
        title: "DevOps Engineer",
        description:
          "Own our build and deployment pipelines. You will automate releases, manage cloud infrastructure, and keep our environments reproducible and observable.",
        requirements:
          "Docker, CI/CD pipelines, Linux administration, one major cloud provider.",
        type: JobType.FULL_TIME,
        location: "Rawabi",
        salaryMin: 6000,
        salaryMax: 10000,
      },
      {
        title: "R&D Engineering Intern",
        description:
          "A three month internship inside our research and development group. You will shadow senior engineers, work on a scoped project, and present your results at the end of the term.",
        requirements:
          "Third or fourth year computer engineering or computer science student.",
        type: JobType.INTERNSHIP,
        location: "Rawabi",
        salaryMin: 1200,
        salaryMax: 2000,
      },
    ],
  },
  {
    email: "foothill@example.com",
    name: "Foothill Technology Solutions",
    description:
      "A software development company based in Nablus. We provide development and consulting services to clients in the United States, backed by an in house engineering function.",
    website: "https://foothillsolutions.com",
    location: "Nablus",
    jobs: [
      {
        title: "Backend Engineer",
        description:
          "Design and build the services behind our client products. You will model data, write APIs, and make decisions about how systems fit together.",
        requirements:
          "Node.js or .NET, relational databases, API design, two years of experience.",
        type: JobType.FULL_TIME,
        location: "Nablus",
        salaryMin: 5000,
        salaryMax: 9000,
      },
      {
        title: "QA Automation Engineer",
        description:
          "Build and maintain the automated test suites that protect our releases. You will work closely with developers to decide what deserves coverage.",
        requirements:
          "Test automation frameworks, scripting, attention to detail.",
        type: JobType.FULL_TIME,
        location: "Nablus",
        salaryMin: 4000,
        salaryMax: 7000,
      },
      {
        title: "Technical Writer",
        description:
          "Write the documentation our clients read. This is a part time role for someone who can turn engineering detail into clear English.",
        requirements:
          "Strong written English, comfort reading technical material.",
        type: JobType.PART_TIME,
        location: "Nablus",
        salaryMin: 2000,
        salaryMax: 3500,
      },
    ],
  },
  {
    email: "harri@example.com",
    name: "Harri",
    description:
      "A workforce platform for the hospitality industry, headquartered in New York. Our Ramallah office is the engineering and product foundation of the company.",
    website: "https://harri.com",
    location: "Ramallah",
    jobs: [
      {
        title: "Senior Frontend Engineer",
        description:
          "Lead frontend work on our scheduling product. You will shape the architecture, mentor other engineers, and care about how the interface feels under real use.",
        requirements:
          "Five years with React, state management at scale, performance profiling.",
        type: JobType.FULL_TIME,
        location: "Ramallah",
        salaryMin: 9000,
        salaryMax: 14000,
      },
      {
        title: "Mobile Developer",
        description:
          "Build and ship features in the mobile app used daily by hospitality staff. You will own releases and work directly with product.",
        requirements: "Flutter or React Native, REST API integration.",
        type: JobType.FULL_TIME,
        location: "Ramallah",
        salaryMin: 6000,
        salaryMax: 11000,
      },
      {
        title: "Software Testing Intern",
        description:
          "A structured internship in quality assurance. You will write test cases, run them, and learn how defects are tracked and resolved.",
        requirements: "Computer science student with an interest in quality.",
        type: JobType.INTERNSHIP,
        location: "Ramallah",
        salaryMin: 1000,
        salaryMax: 1500,
      },
    ],
  },
  {
    email: "northline@example.com",
    name: "Northline Labs",
    description:
      "A fictional company included in this demo to show how the response score behaves for an employer that rarely replies to applicants.",
    website: "https://example.com",
    location: "Bethlehem",
    jobs: [
      {
        title: "Junior Web Developer",
        description:
          "Build and maintain small web projects for local clients, with support from a senior developer.",
        requirements: "HTML, CSS, JavaScript, basic Git.",
        type: JobType.FULL_TIME,
        location: "Bethlehem",
        salaryMin: 2500,
        salaryMax: 4000,
      },
      {
        title: "Support Engineer",
        description:
          "Handle incoming issues from our clients and escalate what needs engineering attention.",
        requirements: "Clear written English, basic SQL, patience.",
        type: JobType.PART_TIME,
        location: "Bethlehem",
        salaryMin: 1800,
        salaryMax: 2800,
      },
    ],
  },
];

export const seedCandidates = [
  {
    email: "layla@example.com",
    fullName: "Layla Odeh",
    headline: "Frontend Developer",
    location: "Ramallah",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    yearsOfExperience: 3,
    bio: "Demo profile. Frontend developer who cares about how an interface behaves under real use, not just how it looks.",
    resumeUrl: "https://example.com/layla-cv",
    isOpenToWork: true,
  },
  {
    email: "karim@example.com",
    fullName: "Karim Hijazi",
    headline: "Backend Developer",
    location: "Nablus",
    skills: ["NestJS", "TypeScript", "PostgreSQL", "Docker"],
    yearsOfExperience: 2,
    bio: "Demo profile. Builds REST APIs with NestJS and PostgreSQL, and thinks about structure before writing code.",
    resumeUrl: "https://example.com/karim-cv",
    isOpenToWork: true,
  },
  {
    email: "nour@example.com",
    fullName: "Nour Salameh",
    headline: "Mobile Developer",
    location: "Hebron",
    skills: ["Flutter", "Dart", "Firebase", "REST APIs"],
    yearsOfExperience: 4,
    bio: "Demo profile. Cross platform mobile developer shipping production apps for local businesses.",
    resumeUrl: "https://example.com/nour-cv",
    isOpenToWork: true,
  },
  {
    email: "adam@example.com",
    fullName: "Adam Barakat",
    headline: "Computer Science Student",
    location: "Bethlehem",
    skills: ["JavaScript", "Python", "Git", "SQL"],
    yearsOfExperience: 0,
    bio: "Demo profile. Final year student looking for a first internship with a real codebase.",
    isOpenToWork: false,
  },
];

export interface SeedApplication {
  candidateEmail: string;
  companyEmail: string;
  jobTitle: string;
  status: "SUBMITTED" | "REVIEWING" | "ACCEPTED" | "REJECTED";
  coverLetter?: string;
  companyNote?: string;
}

export const seedApplications: SeedApplication[] = [
  {
    candidateEmail: "layla@example.com",
    companyEmail: "harri@example.com",
    jobTitle: "Senior Frontend Engineer",
    status: "REVIEWING",
    coverLetter:
      "Three years on React products with real traffic, including a rewrite that cut our first paint in half.",
    companyNote: "Strong portfolio. Worth a technical screen.",
  },
  {
    candidateEmail: "layla@example.com",
    companyEmail: "wahj@example.com",
    jobTitle: "UI/UX Designer",
    status: "REJECTED",
    coverLetter:
      "I design the interfaces I build, and I would like to focus more on the design side.",
    companyNote: "Looking for a dedicated designer rather than a hybrid role.",
  },
  {
    candidateEmail: "karim@example.com",
    companyEmail: "foothill@example.com",
    jobTitle: "Backend Engineer",
    status: "ACCEPTED",
    coverLetter:
      "NestJS and PostgreSQL are what I use daily, and I have taken a project from schema design through to deployment.",
    companyNote: "Offer sent. Start date to be confirmed.",
  },
  {
    candidateEmail: "karim@example.com",
    companyEmail: "wahj@example.com",
    jobTitle: "Full Stack Developer",
    status: "SUBMITTED",
    coverLetter:
      "I work across React and NestJS, so I understand both sides of the contract between them.",
  },
  {
    candidateEmail: "nour@example.com",
    companyEmail: "harri@example.com",
    jobTitle: "Mobile Developer",
    status: "REVIEWING",
    coverLetter:
      "Four years with Flutter, including two apps currently live on both stores.",
  },
  {
    candidateEmail: "adam@example.com",
    companyEmail: "asal@example.com",
    jobTitle: "R&D Engineering Intern",
    status: "SUBMITTED",
    coverLetter:
      "Final year computer science student. I want an internship where I read real code, not tutorials.",
  },
  {
    candidateEmail: "adam@example.com",
    companyEmail: "wahj@example.com",
    jobTitle: "Frontend Development Intern",
    status: "SUBMITTED",
    coverLetter:
      "I have built a few small React projects and I am ready to work on something with real users.",
  },
];

export interface SeedResponseProfile {
  companyEmail: string;
  totalApplications: number;
  answeredRatio: number;
  avgDays: number;
}

export const seedResponseProfiles: SeedResponseProfile[] = [
  {
    companyEmail: "wahj@example.com",
    totalApplications: 38,
    answeredRatio: 0.91,
    avgDays: 2,
  },
  {
    companyEmail: "foothill@example.com",
    totalApplications: 52,
    answeredRatio: 0.83,
    avgDays: 4,
  },
  {
    companyEmail: "asal@example.com",
    totalApplications: 44,
    answeredRatio: 0.72,
    avgDays: 6,
  },
  {
    companyEmail: "northline@example.com",
    totalApplications: 31,
    answeredRatio: 0.29,
    avgDays: 19,
  },
  {
    companyEmail: "harri@example.com",
    totalApplications: 6,
    answeredRatio: 0.5,
    avgDays: 5,
  },
];

export interface SeedHistoryCandidate {
  email: string;
  fullName: string;
  headline: string;
  location: string;
}


export const seedHistoryCandidates: SeedHistoryCandidate[] = [
  { email: "ahmad.zaid@example.com", fullName: "Ahmad Zaid", headline: "Frontend Developer", location: "Ramallah" },
  { email: "dana.hamed@example.com", fullName: "Dana Hamed", headline: "Backend Developer", location: "Nablus" },
  { email: "omar.nassar@example.com", fullName: "Omar Nassar", headline: "Full Stack Developer", location: "Hebron" },
  { email: "rawan.shaheen@example.com", fullName: "Rawan Shaheen", headline: "QA Engineer", location: "Bethlehem" },
  { email: "yousef.khalil@example.com", fullName: "Yousef Khalil", headline: "Mobile Developer", location: "Rawabi" },
  { email: "sara.abed@example.com", fullName: "Sara Abed", headline: "UI/UX Designer", location: "Ramallah" },
  { email: "mahmoud.awad@example.com", fullName: "Mahmoud Awad", headline: "DevOps Engineer", location: "Nablus" },
  { email: "maryam.jarrar@example.com", fullName: "Maryam Jarrar", headline: "Frontend Developer", location: "Hebron" },
  { email: "ibrahim.saleh@example.com", fullName: "Ibrahim Saleh", headline: "Backend Developer", location: "Bethlehem" },
  { email: "aya.hijazi@example.com", fullName: "Aya Hijazi", headline: "Data Analyst", location: "Rawabi" },
  { email: "khaled.mansour@example.com", fullName: "Khaled Mansour", headline: "Full Stack Developer", location: "Ramallah" },
  { email: "lina.darwish@example.com", fullName: "Lina Darwish", headline: "QA Engineer", location: "Nablus" },
  { email: "rami.haddad@example.com", fullName: "Rami Haddad", headline: "Mobile Developer", location: "Hebron" },
  { email: "hiba.zubaidi@example.com", fullName: "Hiba Zubaidi", headline: "UI/UX Designer", location: "Bethlehem" },
  { email: "tareq.jaber@example.com", fullName: "Tareq Jaber", headline: "DevOps Engineer", location: "Rawabi" },
  { email: "noor.ammar@example.com", fullName: "Noor Ammar", headline: "Frontend Developer", location: "Ramallah" },
  { email: "basel.qasem@example.com", fullName: "Basel Qasem", headline: "Backend Developer", location: "Nablus" },
  { email: "reem.ghanem@example.com", fullName: "Reem Ghanem", headline: "Data Analyst", location: "Hebron" },
  { email: "anas.hamdan@example.com", fullName: "Anas Hamdan", headline: "Full Stack Developer", location: "Bethlehem" },
  { email: "salma.khader@example.com", fullName: "Salma Khader", headline: "QA Engineer", location: "Rawabi" },
  { email: "majd.shaheen@example.com", fullName: "Majd Shaheen", headline: "Mobile Developer", location: "Ramallah" },
  { email: "yasmin.tawil@example.com", fullName: "Yasmin Tawil", headline: "UI/UX Designer", location: "Nablus" },
  { email: "zaid.aburish@example.com", fullName: "Zaid Abu Rish", headline: "DevOps Engineer", location: "Hebron" },
  { email: "farah.natsheh@example.com", fullName: "Farah Natsheh", headline: "Frontend Developer", location: "Bethlehem" },
  { email: "hamza.daoud@example.com", fullName: "Hamza Daoud", headline: "Backend Developer", location: "Rawabi" },
  { email: "rana.barghouti@example.com", fullName: "Rana Barghouti", headline: "Data Analyst", location: "Ramallah" },
  { email: "sami.khoury@example.com", fullName: "Sami Khoury", headline: "Full Stack Developer", location: "Nablus" },
  { email: "dima.shaath@example.com", fullName: "Dima Shaath", headline: "QA Engineer", location: "Hebron" },
  { email: "waleed.ashqar@example.com", fullName: "Waleed Ashqar", headline: "Mobile Developer", location: "Bethlehem" },
  { email: "tala.abusneineh@example.com", fullName: "Tala Abu Sneineh", headline: "UI/UX Designer", location: "Rawabi" },
  { email: "firas.tamimi@example.com", fullName: "Firas Tamimi", headline: "DevOps Engineer", location: "Ramallah" },
  { email: "jana.salah@example.com", fullName: "Jana Salah", headline: "Frontend Developer", location: "Nablus" },
  { email: "mustafa.alami@example.com", fullName: "Mustafa Alami", headline: "Backend Developer", location: "Hebron" },
  { email: "hala.zaghloul@example.com", fullName: "Hala Zaghloul", headline: "Data Analyst", location: "Bethlehem" },
  { email: "jamal.sabbah@example.com", fullName: "Jamal Sabbah", headline: "Full Stack Developer", location: "Rawabi" },
  { email: "rania.mishal@example.com", fullName: "Rania Mishal", headline: "QA Engineer", location: "Ramallah" },
  { email: "nadeem.bishara@example.com", fullName: "Nadeem Bishara", headline: "Mobile Developer", location: "Nablus" },
  { email: "amal.qudah@example.com", fullName: "Amal Qudah", headline: "UI/UX Designer", location: "Hebron" },
  { email: "osama.rabah@example.com", fullName: "Osama Rabah", headline: "DevOps Engineer", location: "Bethlehem" },
  { email: "lama.hammad@example.com", fullName: "Lama Hammad", headline: "Frontend Developer", location: "Rawabi" },
  { email: "ayman.khatib@example.com", fullName: "Ayman Khatib", headline: "Backend Developer", location: "Ramallah" },
  { email: "shaima.abuzaid@example.com", fullName: "Shaima Abu Zaid", headline: "Data Analyst", location: "Nablus" },
  { email: "suhaib.abdallah@example.com", fullName: "Suhaib Abdallah", headline: "Full Stack Developer", location: "Hebron" },
  { email: "haneen.kamal@example.com", fullName: "Haneen Kamal", headline: "QA Engineer", location: "Bethlehem" },
  { email: "marwan.ismail@example.com", fullName: "Marwan Ismail", headline: "Mobile Developer", location: "Rawabi" },
  { email: "razan.sweiti@example.com", fullName: "Razan Sweiti", headline: "UI/UX Designer", location: "Ramallah" },
  { email: "qusai.zahran@example.com", fullName: "Qusai Zahran", headline: "DevOps Engineer", location: "Nablus" },
  { email: "leen.arafat@example.com", fullName: "Leen Arafat", headline: "Frontend Developer", location: "Hebron" },
  { email: "baha.shaath@example.com", fullName: "Baha Shaath", headline: "Backend Developer", location: "Bethlehem" },
  { email: "nisreen.hilal@example.com", fullName: "Nisreen Hilal", headline: "Data Analyst", location: "Rawabi" },
  { email: "hadi.masri@example.com", fullName: "Hadi Masri", headline: "Full Stack Developer", location: "Ramallah" },
  { email: "zeina.marzouq@example.com", fullName: "Zeina Marzouq", headline: "QA Engineer", location: "Nablus" },
  { email: "tamer.nabulsi@example.com", fullName: "Tamer Nabulsi", headline: "Mobile Developer", location: "Hebron" },
  { email: "mays.qaisi@example.com", fullName: "Mays Qaisi", headline: "UI/UX Designer", location: "Bethlehem" },
  { email: "laith.rayyan@example.com", fullName: "Laith Rayyan", headline: "DevOps Engineer", location: "Rawabi" },
  { email: "bayan.idris@example.com", fullName: "Bayan Idris", headline: "Frontend Developer", location: "Ramallah" },
  { email: "saif.dweik@example.com", fullName: "Saif Dweik", headline: "Backend Developer", location: "Nablus" },
  { email: "doaa.sarsour@example.com", fullName: "Doaa Sarsour", headline: "Data Analyst", location: "Hebron" },
  { email: "amjad.qattan@example.com", fullName: "Amjad Qattan", headline: "Full Stack Developer", location: "Bethlehem" },
  { email: "asil.hroub@example.com", fullName: "Asil Hroub", headline: "QA Engineer", location: "Rawabi" },
];

export const seedRole = UserRole;