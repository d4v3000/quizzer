/** pages/api/uploadthing.ts */
import { createNextPageApiHandler } from "uploadthing/next-legacy";
import { imageFileRouter } from "../../server/uploadthing";

const handler = createNextPageApiHandler({
  router: imageFileRouter,
});

export default handler;
