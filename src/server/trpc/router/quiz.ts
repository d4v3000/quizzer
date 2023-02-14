import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const quizRouter = router({
  getUserQuizzes: protectedProcedure
    .input(
      z.object({
        orderBy: z.enum([
          "title",
          "createdAt",
          "questions",
          "numberTeams",
          "updatedAt",
        ]),
        orderDir: z.enum(["desc", "asc"]),
        skip: z.number(),
        take: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      let orderByObject: any = {};
      orderByObject[input.orderBy] =
        input.orderBy === "questions"
          ? { _count: input.orderDir }
          : input.orderDir;
      let orderBySet = [orderByObject];
      return ctx.prisma.quiz.findMany({
        where: {
          authorId: ctx.session.user.id,
        },
        include: {
          questions: {
            include: {
              answers: true,
            },
          },
          _count: {
            select: {
              questions: true,
            },
          },
        },
        orderBy: orderBySet,
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
        questions: z.array(
          z.object({
            title: z.string(),
            imgUrl: z.string().optional(),
            type: z.enum(["question", "location", "guessing"]),
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
        ),
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
          questions: {
            deleteMany: {},
            create: input.questions.map((question) => ({
              title: question.title,
              imgUrl: question.imgUrl,
              type: question.type,
              answers: {
                create: question.answers,
              },
            })),
          },
        },
      });
    }),
});
