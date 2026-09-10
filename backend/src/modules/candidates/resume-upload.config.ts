import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";
import { randomBytes } from "crypto";
import { extname } from "path";
import { RESUME_DIR } from "./candidates.service";

const ALLOWED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ALLOWED_EXT = [".pdf", ".doc", ".docx"];

export const resumeUploadOptions = {
  storage: diskStorage({
    destination: RESUME_DIR,
    filename: (_req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase();
      const unique = randomBytes(16).toString("hex");
      cb(null, `${unique}${ext}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (
    _req: unknown,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const ext = extname(file.originalname).toLowerCase();

    if (!ALLOWED_EXT.includes(ext) || !ALLOWED_MIME.includes(file.mimetype)) {
      return cb(
        new BadRequestException("Only PDF, DOC and DOCX files are allowed"),
        false,
      );
    }

    cb(null, true);
  },
};
