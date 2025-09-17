import QuizEdit from "@/components/quiz/QuizEdit";
import { Quiz } from "@/types";
import { getQuizById } from "@/utility/quizStorage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function QuizEditPage() {
  const router = useRouter();
  const { id } = router.query;
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    if (!id) return;
    const q = getQuizById(String(id));
    setQuiz(q || null);
  }, [id]);

  if (!id) return <div className="container p-3">Loading…</div>;
  if (!quiz) return <div className="container p-3">Quiz not found.</div>;
  return <QuizEdit initial={quiz} />;
}
