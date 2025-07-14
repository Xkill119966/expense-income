import type { Request } from "express";
import { rateLimit } from "express-rate-limit";


export const rateLimiter = rateLimit({
	legacyHeaders: true,
	limit: 1000,
	message: "Too many requests, please try again later.",
	standardHeaders: true,
	windowMs: 15 * 60 * 20,
	keyGenerator: (req: Request) => req.ip as string,
});

