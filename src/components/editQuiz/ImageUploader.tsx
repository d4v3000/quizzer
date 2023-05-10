import Label from "@ui/Label";
import { generateReactHelpers } from "@uploadthing/react";
import { ImageFileRouter } from "../../server/uploadthing";
import { useEffect, useState } from "react";
import { useQuizStore } from "@utils/zustand/quizStore";

const { useUploadThing } = generateReactHelpers<ImageFileRouter>();

const ImageUploader = () => {
  const { getRootProps, getInputProps, isDragActive, files, startUpload } =
    useUploadThing("imageUploader");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const currentQuestionIndex = useQuizStore((state) => state.currentQuestion);
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const questions = useQuizStore((state) => state.questions);
  const currentQuestion = useQuizStore(
    (state) => state.questions[currentQuestionIndex]
  );

  const uploadImage = async () => {
    setIsUploading(true);
    const upload = await startUpload();
    currentQuestion!.imgUrl = upload[0].fileUrl;
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex]!.imgUrl = upload[0].fileUrl;
    setQuestions(newQuestions);
    setIsUploading(false);
  };

  useEffect(() => {
    if (files.length > 0 && !errorMessage) {
      uploadImage();
    }
  }, [files]);
  return (
    <>
      <Label text="Image" />
      <div
        className="flex w-full items-center justify-center"
        {...getRootProps()}
      >
        <label
          htmlFor="dropzone-file"
          className={`flex h-32 w-full flex-col items-center justify-center rounded-lg bg-zinc-800 md:h-44 lg:h-56 ${
            isUploading ? "" : "cursor-pointer hover:bg-zinc-700"
          }`}
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            {isUploading ? (
              <span>Uploading...</span>
            ) : (
              <>
                <svg
                  aria-hidden="true"
                  className="mb-3 h-10 w-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                {isDragActive ? (
                  <span>Drop the files here ...</span>
                ) : (
                  <>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or WEBP (MAX. 16MB)
                    </p>
                  </>
                )}
              </>
            )}
          </div>
          <input
            {...getInputProps({
              disabled: isUploading,
              type: "file",
              className: "hidden",
              id: "dropzone-file",
              onChange: (e) => {
                if (
                  e.target.files![0]?.size &&
                  e.target.files![0]?.size < 16777216
                ) {
                  setErrorMessage("");
                } else {
                  setErrorMessage("File too big");
                }
              },
              accept: "image/*",
              multiple: false,
            })}
          />
          {errorMessage && <div className="text-red-400">{errorMessage}</div>}
        </label>
      </div>
    </>
  );
};

export default ImageUploader;
