import { getQuizById, Quiz } from "@/utility/quizStorage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import QuizItem from "./components/Quiz";

export default function QuizPage() {
  const [quiz, setQuiz] = useState<Quiz>();
  const router = useRouter();
  const { id } = router.query;

  console.log(quiz);

  useEffect(() => {
    const res = getQuizById(id as string);
    if (res) {
      setQuiz(res);
    }
  }, [id]);

  return (
    <div className="container">
      {quiz?.published ? <QuizItem {...quiz} /> : <h1>unpublished</h1>}
    </div>
  );
}
