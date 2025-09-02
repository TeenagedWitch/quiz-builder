import { mockQuizzes } from "@/pages/constants/quizMock";

const STORAGE_KEY = "quizbuilder.quizzes";

export type Quiz = {
  id: string;
  title: string;
  updatedAt: string;
  published: boolean;
  blocks: any[];
};

function read(): Quiz[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(data: Quiz[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function seedIfNeeded() {
  const existing = read();
  if (existing.length === 0) {
    write(mockQuizzes);
  }
}

export function list(): Quiz[] {
  return read();
}

export function getQuizById(id: string): Quiz | undefined {
  const res = read().find((q) => q.id === id);
  return res;
}

export function upsert(quiz: Quiz) {
  const all = read();
  const idx = all.findIndex((q) => q.id === quiz.id);

  const now = new Date().toISOString();
  const updatedQuiz = { ...quiz, updatedAt: now };

  if (idx >= 0) {
    all[idx] = updatedQuiz;
  } else {
    all.push({ ...updatedQuiz, updatedAt: now });
  }

  write(all);
}
