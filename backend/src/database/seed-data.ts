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

// Demo accounts only. Rotate this before sharing the platform publicly.
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
  },
  {
    email: "adam@example.com",
    fullName: "Adam Barakat",
    headline: "Computer Science Student",
    location: "Bethlehem",
    skills: ["JavaScript", "Python", "Git", "SQL"],
    yearsOfExperience: 0,
    bio: "Demo profile. Final year student looking for a first internship with a real codebase.",
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

export const seedRole = UserRole;