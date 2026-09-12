import { config } from "dotenv";
import { join } from "path";

config({ path: join(process.cwd(), ".env") });

process.env.NODE_ENV = "test";
