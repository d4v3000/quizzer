import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const quizRouter = router({
  getUserQuizzes: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.quiz.findMany({
      where: {
        authorId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
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
      return ctx.prisma.quiz.findFirst({
        where: {
          AND: [
            {
              authorId: ctx.session.user.id,
            },
            {
              id: input.id,
            },
          ],
        },
        include: {
          questions: {
            include: {
              answers: true,
            },
          },
        },
      });
    }),
  editQuiz: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        numberTeams: z.number(),
        questions: z
          .array(
            z.object({
              title: z.string(),
              imgUrl: z.string().optional(),
              type: z.string(),
              answers: z.array(
                z.object({
                  title: z.string().optional(),
                  placeholder: z.string().optional(),
                  isCorrect: z.boolean().optional(),
                  x: z.number().optional(),
                  y: z.number().optional(),
                })
              ),
            })
          )
          .optional(),
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
