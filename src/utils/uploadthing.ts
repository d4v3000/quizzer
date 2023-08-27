import { generateComponents } from "@uploadthing/react";
import { ImageFileRouter } from "../server/uploadthing";
 

 
export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<ImageFileRouter>();