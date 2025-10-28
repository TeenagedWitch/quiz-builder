"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QuizItem from "@/components/quiz/Quiz";
import type { Quiz } from "../../../types/types";
import { getQuizById } from "../../../utility/quizStorage";

export default function QuizPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [quiz, setQuiz] = useState<Quiz>();

  useEffect(() => {
    if (!id) return;
    const found = getQuizById(id);
    if (found) setQuiz(found);
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
