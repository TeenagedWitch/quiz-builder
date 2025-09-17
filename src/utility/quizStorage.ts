import mockQuizzes from "@/constants/quizMock.json";
import { Quiz } from "@/types";
import { toast } from "@/utility/toast";

const STORAGE_KEY = "quizbuilder.quizzes";

function read(): Quiz[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.log(e);
      toast(
        "Saved quizzes are corrupted or unreadable. Showing empty list.",
        "danger"
      );
      return [];
    }
  } catch (e) {
    console.log(e);
    toast(
      "Unable to access local storage. Changes may not persist.",
      "warning"
    );
    return [];
  }
}

function write(data: Quiz[]): boolean {
  let payload = "[]";
  try {
    payload = JSON.stringify(data);
  } catch (e) {
    console.log(e);
    toast("Failed to save quizzes: invalid data format.", "danger");
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, payload);
    return true;
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : String(e);
    if (
      msg.toLowerCase().includes("quota") ||
      e?.name === "QuotaExceededError"
    ) {
      toast(
        "Storage is full. Cannot save more quizzes. Consider deleting some.",
        "warning"
      );
    } else {
      toast("Failed to write to local storage.", "danger");
    }
    return false;
  }
}

export function seedIfNeeded() {
  const existing = read();
  if (existing.length === 0) {
    write(mockQuizzes as Quiz[]);
  }
}

export function list(): Quiz[] {
  return read();
}

export function getQuizById(id: string): Quiz | undefined {
  const res = read().find((q) => q.id === id);
  return res;
}

export function upsert(quiz: Quiz): boolean {
  const all = read();
  const idx = all.findIndex((q) => q.id === quiz.id);

  const now = new Date().toISOString();
  const updatedQuiz = { ...quiz, updatedAt: now };

  if (idx >= 0) {
    all[idx] = updatedQuiz;
  } else {
    all.push({ ...updatedQuiz, updatedAt: now, createdAt: now });
  }

  return write(all);
}
