/** pages/api/uploadthing.ts */
import { createNextPageApiHandler } from "uploadthing/server";
import { imageFileRouter } from "../../server/uploadthing";

const handler = createNextPageApiHandler({
  router: imageFileRouter,
});

export default handler;
