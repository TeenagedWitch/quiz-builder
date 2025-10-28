"use client";

import { useEffect, useState } from "react";
import type { Quiz } from "@/types/types";
import { list, removeQuiz, seedIfNeeded } from "@/utility/quizStorage";
import ListItem from "@/components/ListItem";
import { toast } from "@/utility/toast";

export default function HomePage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    seedIfNeeded();
    setQuizzes(list());
  }, []);

  function handleDelete(id: string) {
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
    removeQuiz(id);
    toast(`The quiz ${id} has been deleted successfully`, "success");
  }

  return (
    <main>
      <div className="container">
        {quizzes.map((quiz) => (
          <ListItem key={quiz.id} item={quiz} onDelete={handleDelete} />
        ))}
      </div>
    </main>
  );
}
