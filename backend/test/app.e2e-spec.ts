import { INestApplication } from "@nestjs/common";
import request from "supertest";
import {
  addResume,
  clearDatabase,
  createJob,
  createTestApp,
  registerUser,
} from "./helpers";

describe("Qadem API", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await clearDatabase(app);
  });

  describe("Duplicate applications", () => {
    it("accepts the first application and rejects the second with 409", async () => {
      const company = await registerUser(app, "co@test.com", "COMPANY");
      const jobId = await createJob(app, company.token);

      const candidate = await registerUser(app, "cand@test.com", "CANDIDATE");
      await addResume(app, candidate.token);

      await request(app.getHttpServer())
        .post(`/api/jobs/${jobId}/apply`)
        .set("Authorization", `Bearer ${candidate.token}`)
        .send({})
        .expect(201);

      const second = await request(app.getHttpServer())
        .post(`/api/jobs/${jobId}/apply`)
        .set("Authorization", `Bearer ${candidate.token}`)
        .send({})
        .expect(409);

      expect(second.body.message).toContain("already applied");
    });

    it("allows the same candidate to apply to two different jobs", async () => {
      const company = await registerUser(app, "co@test.com", "COMPANY");
      const jobA = await createJob(app, company.token, "Backend Engineer");
      const jobB = await createJob(app, company.token, "Frontend Engineer");

      const candidate = await registerUser(app, "cand@test.com", "CANDIDATE");
      await addResume(app, candidate.token);

      await request(app.getHttpServer())
        .post(`/api/jobs/${jobA}/apply`)
        .set("Authorization", `Bearer ${candidate.token}`)
        .send({})
        .expect(201);

      await request(app.getHttpServer())
        .post(`/api/jobs/${jobB}/apply`)
        .set("Authorization", `Bearer ${candidate.token}`)
        .send({})
        .expect(201);
    });

    it("blocks applying without a resume", async () => {
      const company = await registerUser(app, "co@test.com", "COMPANY");
      const jobId = await createJob(app, company.token);

      const candidate = await registerUser(app, "cand@test.com", "CANDIDATE");

      const res = await request(app.getHttpServer())
        .post(`/api/jobs/${jobId}/apply`)
        .set("Authorization", `Bearer ${candidate.token}`)
        .send({})
        .expect(400);

      expect(res.body.message).toContain("resume");
    });
  });

  describe("Job ownership", () => {
    it("stops a company from editing another company job", async () => {
      const owner = await registerUser(app, "owner@test.com", "COMPANY");
      const jobId = await createJob(app, owner.token);

      const rival = await registerUser(app, "rival@test.com", "COMPANY");

      await request(app.getHttpServer())
        .patch(`/api/jobs/${jobId}`)
        .set("Authorization", `Bearer ${rival.token}`)
        .send({ title: "Hijacked" })
        .expect(403);
    });

    it("stops a company from deleting another company job", async () => {
      const owner = await registerUser(app, "owner@test.com", "COMPANY");
      const jobId = await createJob(app, owner.token);

      const rival = await registerUser(app, "rival@test.com", "COMPANY");

      await request(app.getHttpServer())
        .delete(`/api/jobs/${jobId}`)
        .set("Authorization", `Bearer ${rival.token}`)
        .expect(403);

      await request(app.getHttpServer())
        .get(`/api/jobs/${jobId}`)
        .expect(200);
    });

    it("lets the owner edit its own job", async () => {
      const owner = await registerUser(app, "owner@test.com", "COMPANY");
      const jobId = await createJob(app, owner.token);

      const res = await request(app.getHttpServer())
        .patch(`/api/jobs/${jobId}`)
        .set("Authorization", `Bearer ${owner.token}`)
        .send({ title: "Senior Backend Engineer" })
        .expect(200);

      expect(res.body.title).toBe("Senior Backend Engineer");
    });

    it("hides another company applicants", async () => {
      const owner = await registerUser(app, "owner@test.com", "COMPANY");
      const jobId = await createJob(app, owner.token);

      const rival = await registerUser(app, "rival@test.com", "COMPANY");

      await request(app.getHttpServer())
        .get(`/api/jobs/${jobId}/applications`)
        .set("Authorization", `Bearer ${rival.token}`)
        .expect(403);
    });
  });

  describe("Role restrictions", () => {
    it("stops a candidate from publishing a job", async () => {
      const candidate = await registerUser(app, "cand@test.com", "CANDIDATE");

      await request(app.getHttpServer())
        .post("/api/jobs")
        .set("Authorization", `Bearer ${candidate.token}`)
        .send({
          title: "Fake role",
          description:
            "This request should never reach the service behind the guard.",
          type: "FULL_TIME",
          location: "Ramallah",
        })
        .expect(403);
    });

    it("stops a company from applying to a job", async () => {
      const owner = await registerUser(app, "owner@test.com", "COMPANY");
      const jobId = await createJob(app, owner.token);

      const other = await registerUser(app, "other@test.com", "COMPANY");

      await request(app.getHttpServer())
        .post(`/api/jobs/${jobId}/apply`)
        .set("Authorization", `Bearer ${other.token}`)
        .send({})
        .expect(403);
    });

    it("rejects protected routes without a token", async () => {
      await request(app.getHttpServer()).get("/api/auth/me").expect(401);
      await request(app.getHttpServer()).get("/api/jobs/my-jobs").expect(401);
      await request(app.getHttpServer()).get("/api/companies/me").expect(401);
    });

    it("keeps the public board open to visitors", async () => {
      const company = await registerUser(app, "co@test.com", "COMPANY");
      await createJob(app, company.token);

      const res = await request(app.getHttpServer())
        .get("/api/jobs")
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.meta.total).toBe(1);
    });
  });

  describe("Status transitions", () => {
    it("refuses to move a decided application again", async () => {
      const company = await registerUser(app, "co@test.com", "COMPANY");
      const jobId = await createJob(app, company.token);

      const candidate = await registerUser(app, "cand@test.com", "CANDIDATE");
      await addResume(app, candidate.token);

      const applied = await request(app.getHttpServer())
        .post(`/api/jobs/${jobId}/apply`)
        .set("Authorization", `Bearer ${candidate.token}`)
        .send({})
        .expect(201);

      const applicationId = applied.body.id;

      await request(app.getHttpServer())
        .patch(`/api/applications/${applicationId}/status`)
        .set("Authorization", `Bearer ${company.token}`)
        .send({ status: "ACCEPTED" })
        .expect(200);

      await request(app.getHttpServer())
        .patch(`/api/applications/${applicationId}/status`)
        .set("Authorization", `Bearer ${company.token}`)
        .send({ status: "REVIEWING" })
        .expect(400);
    });
  });
});
