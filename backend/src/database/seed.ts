import * as bcrypt from "bcrypt";
import dataSource from "./data-source";
import { User } from "../modules/users/entities/user.entity";
import { Company } from "../modules/companies/entities/company.entity";
import { Job } from "../modules/jobs/entities/job.entity";
import { UserRole } from "../common/enums";
import { SEED_PASSWORD, seedCandidates, seedCompanies } from "./seed-data";

async function seed() {
  console.log("Connecting to the database...");
  await dataSource.initialize();

  console.log("");
  console.log("WARNING: this will delete all jobs, companies and users.");
  console.log("");

  const jobsRepo = dataSource.getRepository(Job);
  const companiesRepo = dataSource.getRepository(Company);
  const usersRepo = dataSource.getRepository(User);

  console.log("Clearing existing data...");
  await dataSource.query(
    'TRUNCATE TABLE "jobs", "companies", "users" RESTART IDENTITY CASCADE',
  );

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);

  let companyCount = 0;
  let jobCount = 0;

  for (const item of seedCompanies) {
    const user = await usersRepo.save(
      usersRepo.create({
        email: item.email,
        password: hashedPassword,
        fullName: item.name,
        role: UserRole.COMPANY,
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

    companyCount += 1;

    for (const job of item.jobs) {
      await jobsRepo.save(
        jobsRepo.create({
          ...job,
          isActive: job.isActive ?? true,
          companyId: company.id,
        }),
      );
      jobCount += 1;
    }

    console.log(`  ${item.name} (${item.jobs.length} jobs)`);
  }

  for (const candidate of seedCandidates) {
    await usersRepo.save(
      usersRepo.create({
        email: candidate.email,
        password: hashedPassword,
        fullName: candidate.fullName,
        role: UserRole.CANDIDATE,
      }),
    );
    console.log(`  ${candidate.fullName}`);
  }

  console.log("");
  console.log("Done.");
  console.log(`  Companies: ${companyCount}`);
  console.log(`  Jobs:      ${jobCount}`);
  console.log(`  Candidates: ${seedCandidates.length}`);
  console.log("");
  console.log(`  Password for every account: ${SEED_PASSWORD}`);
  console.log("");

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
