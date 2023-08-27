import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { authOptions } from "../pages/api/auth/[...nextauth]";

const f = createUploadthing();

export const imageFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async (opts) => {
      const session = await getServerSession(opts.req, opts.res, authOptions);
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user?.id };
    })
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type ImageFileRouter = typeof imageFileRouter;
