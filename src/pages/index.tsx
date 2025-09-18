import ListItem from "../components/ListItem";
import { seedIfNeeded, list, removeQuiz } from "@/utility/quizStorage";
import { useState, useEffect } from "react";
import { Quiz } from "@/types";
import { toast } from "@/utility/toast";

export default function Home() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    seedIfNeeded();
    setQuizzes(list());
  }, []);

  function handleDelete(id: string) {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
    removeQuiz(id);
    toast(`The quiz ${id} has been deleted successfully`, "success");
  }

  return (
    <div>
      <main>
        <div className="container">
          {quizzes.map((el) => (
            <ListItem key={el.id} item={el} onDelete={handleDelete} />
          ))}
        </div>
      </main>
    </div>
  );
}
