import ListItem from "../components/ListItem";
import Link from "next/link";
import { seedIfNeeded, list, Quiz } from "@/utility/quizStorage";
import { useState, useEffect } from "react";

export default function Home() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    seedIfNeeded();

    const data = list();
    setQuizzes(data);
  }, []);

  console.log(quizzes);

  return (
    <div>
      <header className="mb-3">
        <nav className="navbar navbar-expand-lg navbar-light  bg-dark px-3">
          <Link className="navbar-brand text-white" href="/">
            Quiz Builder
          </Link>
          <div className="ms-auto">
            <Link className="btn btn-outline-primary me-2" href="/">
              Home
            </Link>
            <Link className="btn btn-primary" href="/quiz/edit">
              Create Quiz
            </Link>
          </div>
        </nav>
      </header>
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
