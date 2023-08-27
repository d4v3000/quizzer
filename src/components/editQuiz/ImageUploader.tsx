import { UploadDropzone } from "@utils/uploadthing";
import "@uploadthing/react/styles.css";
import { useQuizStore } from "@utils/zustand/quizStore";

const ImageUploader = () => {
  const currentQuestionIndex = useQuizStore((state) => state.currentQuestion);
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const questions = useQuizStore((state) => state.questions);
  const currentQuestion = useQuizStore(
    (state) => state.questions[currentQuestionIndex]
  );

  return (
    <UploadDropzone
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        currentQuestion!.imgUrl = res?.[0]?.url;
        const newQuestions = [...questions];
        newQuestions[currentQuestionIndex]!.imgUrl = res?.[0]?.url;
        setQuestions(newQuestions);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};

export default ImageUploader;
