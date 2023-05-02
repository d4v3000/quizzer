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
        search: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      const orderByObject: any = {};
      orderByObject[input.orderBy] =
        input.orderBy === "questions"
          ? { _count: input.orderDir }
          : input.orderDir;
      const orderBySet = [orderByObject];
      return ctx.prisma.quiz.findMany({
        where: {
          authorId: ctx.session.user.id,
          title: {
            contains: input.search,
          },
        },
        include: {
          _count: {
            select: {
              questions: true,
            },
          },
          questions: true,
        },
        orderBy: orderBySet,
        take: input.take,
        skip: input.skip,
      });
    }),
  getNumberOfQuizzes: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.quiz.count({ where: { authorId: ctx.session.user.id } });
  }),
  getAllQuizzes: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.quiz.findMany({
      where: {
        authorId: ctx.session.user.id,
      },
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            questions: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }),
  createQuiz: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.quiz.create({
      data: {
        authorId: ctx.session.user.id,
      },
    });
  }),
  deleteQuiz: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.quiz.delete({
        where: {
          id: input.id,
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
              guessingAnswer: true,
              locationAnswer: true,
              multipleChoiceAnswers: {
                include: {
                  answers: true,
                },
              },
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
        questions: z.array(
          z.object({
            title: z.string(),
            imgUrl: z.string().optional(),
            type: z.enum(["question", "location", "guessing"]),
            multipleChoiceAnswers: z
              .object({
                answers: z.array(
                  z.object({ name: z.string(), isCorrect: z.boolean() })
                ),
              })
              .nullable(),
            locationAnswer: z
              .object({
                mapName: z.string(),
                lat: z.number().nullable(),
                lon: z.number().nullable(),
                placeName: z.string().nullable(),
                withOutlines: z.boolean(),
              })
              .nullable(),
            guessingAnswer: z.object({ answer: z.number() }).nullable(),
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
          questions: {
            deleteMany: {},
            create: input.questions.map((question) => ({
              title: question.title,
              imgUrl: question.imgUrl,
              type: question.type,
              guessingAnswer:
                question.guessingAnswer != null
                  ? {
                      create: question.guessingAnswer,
                    }
                  : undefined,
              locationAnswer:
                question.locationAnswer != null
                  ? {
                      create: question.locationAnswer,
                    }
                  : undefined,
              multipleChoiceAnswers: {
                create: {
                  answers: {
                    create: question.multipleChoiceAnswers?.answers.map(
                      (answer) => ({
                        name: answer.name,
                        isCorrect: answer.isCorrect,
                      })
                    ),
                  },
                },
              },
            })),
          },
        },
      });
    }),
});
