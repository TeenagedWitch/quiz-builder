import ListItem from "../components/ListItem";
import { seedIfNeeded, list } from "@/utility/quizStorage";
import { useState, useEffect } from "react";
import { Quiz } from "@/types";

export default function Home() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    seedIfNeeded();

    const data = list();
    setQuizzes(data);
  }, []);

  return (
    <div>
      <main>
        <div className="container">
          {quizzes.map((el) => (
            <ListItem key={el.id} item={el} />
          ))}
        </div>
      </main>
    </div>
  );
}
