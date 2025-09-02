import { useRouter } from "next/router";

export default function QuizEditPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return <div>Loading…</div>;

  return <div>Quiz page for editing {id}</div>;
}
