import * as bcrypt from "bcrypt";
import dataSource from "./data-source";
import { User } from "../modules/users/entities/user.entity";
import { Company } from "../modules/companies/entities/company.entity";
import { Job } from "../modules/jobs/entities/job.entity";
import { CandidateProfile } from "../modules/candidates/entities/candidate-profile.entity";
import { Application } from "../modules/applications/entities/application.entity";
import { ApplicationStatus, UserRole } from "../common/enums";
import { seedResponseProfiles } from "./seed-data";
import {
  SEED_PASSWORD,
  seedApplications,
  seedCandidates,
  seedCompanies,
} from "./seed-data";

async function seed() {
  console.log("Connecting to the database...");
  await dataSource.initialize();

  console.log("");
  console.log("WARNING: this will delete all existing data.");
  console.log("");

  const jobsRepo = dataSource.getRepository(Job);
  const companiesRepo = dataSource.getRepository(Company);
  const usersRepo = dataSource.getRepository(User);
  const profilesRepo = dataSource.getRepository(CandidateProfile);
  const applicationsRepo = dataSource.getRepository(Application);

  console.log("Clearing existing data...");
  await dataSource.query(
    'TRUNCATE TABLE "applications", "candidate_profiles", "jobs", "companies", "users" RESTART IDENTITY CASCADE',
  );

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);

  const companyByEmail = new Map<string, Company>();
  const jobByKey = new Map<string, Job>();
  const userByEmail = new Map<string, User>();

  let jobCount = 0;

  console.log("");
  console.log("Companies:");

  for (const item of seedCompanies) {
    const user = await usersRepo.save(
      usersRepo.create({
        email: item.email,
        password: hashedPassword,
        fullName: item.name,
        role: UserRole.COMPANY,
        isEmailVerified: true,
      }),
    );

    const company = await companiesRepo.save(
      companiesRepo.create({
        userId: user.id,
        name: item.name,
        description: item.description,
        website: item.website,
        location: item.location,
        
      }),
    );

    companyByEmail.set(item.email, company);

    for (const job of item.jobs) {
      const saved = await jobsRepo.save(
        jobsRepo.create({
          ...job,
          isActive: job.isActive ?? true,
          companyId: company.id,
        }),
      );
      jobByKey.set(`${item.email}::${job.title}`, saved);
      jobCount += 1;
    }

    console.log(`  ${item.name} (${item.jobs.length} jobs)`);
  }

  console.log("");
  console.log("Candidates:");

  for (const candidate of seedCandidates) {
    const user = await usersRepo.save(
      usersRepo.create({
        email: candidate.email,
        password: hashedPassword,
        fullName: candidate.fullName,
        role: UserRole.CANDIDATE,
        isEmailVerified: true,
      }),
    );

    userByEmail.set(candidate.email, user);

    await profilesRepo.save(
      profilesRepo.create({
        userId: user.id,
        headline: candidate.headline ?? null,
        bio: candidate.bio ?? null,
        location: candidate.location ?? null,
        skills: candidate.skills ?? [],
        yearsOfExperience: candidate.yearsOfExperience ?? null,
        resumeUrl: candidate.resumeUrl ?? null,
        isOpenToWork: candidate.isOpenToWork ?? false,
        openToWorkSince: candidate.isOpenToWork ? new Date() : null,
      }),
    );

    console.log(`  ${candidate.fullName}`);
  }

  console.log("");
  console.log("Applications:");

  let applicationCount = 0;
  let skipped = 0;

  for (const item of seedApplications) {
    const user = userByEmail.get(item.candidateEmail);
    const job = jobByKey.get(`${item.companyEmail}::${item.jobTitle}`);

    if (!user || !job) {
      console.log(`  skipped: ${item.jobTitle} for ${item.candidateEmail}`);
      skipped += 1;
      continue;
    }

    const decided = item.status !== ApplicationStatus.SUBMITTED;

    await applicationsRepo.save(
      applicationsRepo.create({
        jobId: job.id,
        candidateId: user.id,
        coverLetter: item.coverLetter ?? null,
        status: item.status as ApplicationStatus,
        companyNote: item.companyNote ?? null,
        respondedAt: decided ? new Date() : null,
      }),
    );

    console.log(`  ${user.fullName} applied to ${job.title} (${item.status})`);
    applicationCount += 1;
  }

  console.log("");
    console.log("");
  console.log("Response history:");

  const bulkCandidates: User[] = [];

  // Filler candidates exist only to carry applications. They are not open
  // to work, so they never surface in talent search.
  for (let i = 0; i < 60; i += 1) {
    const user = await usersRepo.save(
      usersRepo.create({
        email: `applicant${i + 1}@example.com`,
        password: hashedPassword,
        fullName: `Applicant ${i + 1}`,
        role: UserRole.CANDIDATE,
        isEmailVerified: true,
      }),
    );

    await profilesRepo.save(
      profilesRepo.create({
        userId: user.id,
        headline: "Software Developer",
        location: "Palestine",
        skills: [],
        isOpenToWork: false,
      }),
    );

    bulkCandidates.push(user);
  }

  let historyCount = 0;

  for (const profile of seedResponseProfiles) {
    const company = companyByEmail.get(profile.companyEmail);
    if (!company) continue;

    const companyJobs = Array.from(jobByKey.entries())
      .filter(([key]) => key.startsWith(`${profile.companyEmail}::`))
      .map(([, job]) => job);

    if (companyJobs.length === 0) continue;

    const answeredTarget = Math.round(
      profile.totalApplications * profile.answeredRatio,
    );

    for (let i = 0; i < profile.totalApplications; i += 1) {
      const candidate = bulkCandidates[i % bulkCandidates.length];
      const job = companyJobs[i % companyJobs.length];

      const existing = await applicationsRepo.findOne({
        where: { jobId: job.id, candidateId: candidate.id },
      });
      if (existing) continue;

      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - (20 + (i % 100)));

      const answered = i < answeredTarget;
      let respondedAt: Date | null = null;
      let status = ApplicationStatus.SUBMITTED;

      if (answered) {
        // Vary each response around the company's average.
        const spread = (i % 5) - 2;
        const days = Math.max(1, profile.avgDays + spread);
        respondedAt = new Date(createdAt);
        respondedAt.setDate(respondedAt.getDate() + days);

        status =
          i % 4 === 0
            ? ApplicationStatus.ACCEPTED
            : i % 3 === 0
              ? ApplicationStatus.REVIEWING
              : ApplicationStatus.REJECTED;
      }

      await applicationsRepo.save(
        applicationsRepo.create({
          jobId: job.id,
          candidateId: candidate.id,
          coverLetter: null,
          status,
          respondedAt,
          createdAt,
        }),
      );

      historyCount += 1;
    }

    console.log(
      `  ${company.name}: ${profile.totalApplications} applications, ${Math.round(profile.answeredRatio * 100)}% answered`,
    );
  }

  console.log("");
  console.log(`  History applications: ${historyCount}`);
  console.log("Done.");
  console.log(`  Companies:    ${companyByEmail.size}`);
  console.log(`  Jobs:         ${jobCount}`);
  console.log(`  Candidates:   ${seedCandidates.length}`);
  console.log(`  Applications: ${applicationCount}`);
  if (skipped > 0) {
    console.log(`  Skipped:      ${skipped} (job title did not match)`);
  }
  console.log("");
  console.log(`  Password for every account: ${SEED_PASSWORD}`);
  console.log("");

  await dataSource.destroy();
  
}



seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
