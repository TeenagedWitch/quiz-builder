import QuizItem from "@/components/quiz/Quiz";
import { Quiz } from "@/types";
import { getQuizById } from "@/utility/quizStorage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function QuizPage() {
  const [quiz, setQuiz] = useState<Quiz>();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const res = getQuizById(id as string);
    if (res) {
      setQuiz(res);
    }
  }, [id]);

  return (
    <div className="container" style={{ height: "100vh" }}>
      {quiz?.published ? (
        <QuizItem {...quiz} />
      ) : (
        <div className="d-flex justify-content-center gap-3 align-items-center">
          <h1>Not published yet.</h1>
        </div>
      )}
    </div>
  );
}
