import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { quizRouter } from "./quiz";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  quiz: quizRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
