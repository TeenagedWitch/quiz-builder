"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QuizEdit from "@/components/quiz/QuizEdit";
import type { Quiz } from "@/types/types";
import { getQuizById } from "@/utility/quizStorage";

export default function EditQuizPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const existing = getQuizById(id) ?? null;
    setQuiz(existing);
    setLoading(false);
  }, [id]);

  if (!id) {
    return <div className="container p-3">Loading…</div>;
  }

  if (loading) {
    return <div className="container p-3">Loading…</div>;
  }

  if (!quiz) {
    return <div className="container p-3">Quiz not found.</div>;
  }

  return <QuizEdit initial={quiz} />;
}
