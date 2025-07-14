import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
  }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  GOOGLE_CLIENT_ID: str({
    desc: "Google OAuth Client ID",
    example: "123456789-abcdef.apps.googleusercontent.com",
  }),
  GOOGLE_CLIENT_SECRET: str({
    desc: "Google OAuth Client Secret",
    example: "GOCSPX-xxxxxxxxxxxxxxxxxxxxxx",
  }),
  GOOGLE_REDIRECT_URI: str({
    desc: "Google OAuth Redirect URI",
    example: "http://localhost:3000/api/auth/google/callback",
  }),
  JWT_SECRET: str({
    desc: "JWT Secret Key for token signing",
    example: "your-256-bit-secret",
  }),
  JWT_EXPIRES_IN: str({
    desc: "JWT Token expiration time",
    default: "1d",
    example: "1d",
  }),
  SMTP_HOST: str(),
  SMTP_PORT: num(),
  SMTP_USER: str(),
  SMTP_PASSWORD: str(),
  SMTP_FROM_NAME: str(),
});
