import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const quizRouter = router({
  getUserQuizzes: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.quiz.findMany({
      where: {
        authorId: ctx.session.user.id,
      },
    });
  }),
  createQuiz: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.quiz.create({
      data: {
        authorId: ctx.session.user.id,
      },
    });
  }),
  getQuiz: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.quiz.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  editQuiz: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        numberTeams: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.quiz.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          numberTeams: input.numberTeams,
        },
      });
    }),
});
