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

export const SEED_PASSWORD = "password123";

export const seedCompanies: SeedCompany[] = [
  {
    email: "asal@example.com",
    name: "ASAL Technologies",
    description:
      "A Palestinian software R&D and outsourcing company with offices across the West Bank and Gaza. We build frontend, backend, mobile and cloud systems for local and international partners, and run a hardware design verification practice.",
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
        requirements: "Strong written English, comfort reading technical material.",
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
      "A workforce platform for the hospitality industry, headquartered in New York. Our Ramallah office on Jerusalem Street is the engineering and product foundation of the company.",
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
        title: "iOS Developer",
        description:
          "Build and ship features in our iOS application used daily by hospitality staff. You will own releases and work directly with product.",
        requirements: "Swift, UIKit or SwiftUI, App Store release experience.",
        type: JobType.FULL_TIME,
        location: "Ramallah",
        salaryMin: 6000,
        salaryMax: 11000,
      },
      {
        title: "Scrum Master",
        description:
          "Support two engineering teams. You will run the ceremonies, remove blockers, and keep delivery predictable without adding process for its own sake.",
        requirements:
          "Agile facilitation experience, comfort working with engineers.",
        type: JobType.FULL_TIME,
        location: "Ramallah",
        salaryMin: 5500,
        salaryMax: 9000,
      },
    ],
  },
  {
    email: "ahllogics@example.com",
    name: "AHL Logics",
    description:
      "A US company with its engineering team based in Hebron. We work on research, advanced design and applied engineering across technology, telecom, infrastructure and automation.",
    website: "https://ahllogics.com",
    location: "Hebron",
    jobs: [
      {
        title: "Site Reliability Engineer",
        description:
          "Keep our production systems healthy. You will handle monitoring, incident response, and the slow work of making failures less likely.",
        requirements:
          "Linux, monitoring and alerting tools, scripting, on call experience.",
        type: JobType.FULL_TIME,
        location: "Hebron",
        salaryMin: 7000,
        salaryMax: 12000,
      },
      {
        title: "NOC Engineer",
        description:
          "Monitor network and platform health, triage alerts, and escalate what needs a human. This role works on a rotating shift.",
        requirements: "Networking fundamentals, calm under pressure.",
        type: JobType.FULL_TIME,
        location: "Hebron",
        salaryMin: 3500,
        salaryMax: 6000,
      },
    ],
  },
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
    ],
  },
  {
    email: "aeliasoft@example.com",
    name: "Aeliasoft",
    description:
      "A Palestinian technology company building tailored digital solutions. Our work spans custom applications, web platforms, mobile apps, system integration and chip design verification.",
    website: "https://aeliasoft.com",
    location: "Ramallah",
    jobs: [
      {
        title: "Mobile Developer",
        description:
          "Build cross platform mobile applications for our clients. You will take features from design through to release.",
        requirements: "Flutter or React Native, REST API integration.",
        type: JobType.FULL_TIME,
        location: "Ramallah",
        salaryMin: 4500,
        salaryMax: 8000,
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
  { email: "ahmad@example.com", fullName: "Ahmad Nasser" },
  { email: "layan@example.com", fullName: "Layan Odeh" },
  { email: "omar@example.com", fullName: "Omar Haddad" },
  { email: "sara@example.com", fullName: "Sara Khalil" },
];

export const seedRole = UserRole;
