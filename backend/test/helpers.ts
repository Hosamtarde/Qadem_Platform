import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { DataSource } from "typeorm";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { AllExceptionsFilter } from "../src/common/filters/all-exceptions.filter";

export async function createTestApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();

  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.init();
  return app;
}

export async function clearDatabase(app: INestApplication): Promise<void> {
  const dataSource = app.get(DataSource);
  await dataSource.query(
    'TRUNCATE TABLE "applications", "candidate_profiles", "jobs", "companies", "users" RESTART IDENTITY CASCADE',
  );
}

interface AuthResult {
  token: string;
  userId: string;
}

export async function registerUser(
  app: INestApplication,
  email: string,
  role: "CANDIDATE" | "COMPANY",
  fullName = "Test User",
): Promise<AuthResult> {
  const res = await request(app.getHttpServer())
    .post("/api/auth/register")
    .send({ email, password: "password123", fullName, role })
    .expect(201);

  return { token: res.body.accessToken, userId: res.body.user.id };
}

export async function addResume(
  app: INestApplication,
  token: string,
): Promise<void> {
  await request(app.getHttpServer())
    .patch("/api/candidates/me")
    .set("Authorization", `Bearer ${token}`)
    .send({ resumeUrl: "https://example.com/resume.pdf" })
    .expect(200);
}

export async function createJob(
  app: INestApplication,
  token: string,
  title = "Backend Engineer",
): Promise<string> {
  const res = await request(app.getHttpServer())
    .post("/api/jobs")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title,
      description:
        "Design and build the services behind our product, from schema to endpoint.",
      type: "FULL_TIME",
      location: "Ramallah",
      salaryMin: 4000,
      salaryMax: 8000,
    })
    .expect(201);

  return res.body.id;
}
