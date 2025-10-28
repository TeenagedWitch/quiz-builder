import { blockPalette } from "@/constants/blocks";
import { Block, Quiz } from "@/types/types";
import { upsert } from "@/utility/quizStorage";
import { makeBlock } from "@/utility/quizUtils";
import { toast } from "@/utility/toast";
import { type DropResult } from "@hello-pangea/dnd";
import { Dispatch, SetStateAction } from "react";

export type useQuizEditorProps = {
  setSelectedIndex: Dispatch<SetStateAction<number | null>>;
  setQuiz: Dispatch<SetStateAction<Quiz>>;
  quiz: Quiz;
  selectedIndex: number | null;
};

export const useQuizEditor = ({
  setQuiz,
  setSelectedIndex,
  quiz,
  selectedIndex,
}: useQuizEditorProps) => {
  function addBlock(type: Block["type"]) {
    const block = makeBlock(type);
    setQuiz((q) => ({ ...q, blocks: [...q.blocks, block] }));
    setSelectedIndex(quiz.blocks.length);
  }

  function move(index: number, dir: -1 | 1) {
    setQuiz((q) => {
      const next = [...q.blocks];
      const target = index + dir;
      if (target < 0 || target >= next.length) return q;
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return { ...q, blocks: next };
    });
    setSelectedIndex((prev) => (prev == null ? prev : prev + dir));
  }

  function remove(index: number) {
    setQuiz((q) => {
      const next = [...q.blocks];
      next.splice(index, 1);
      return { ...q, blocks: next };
    });
    setSelectedIndex((prev) => {
      if (prev == null) return prev;
      if (prev === index) return null;
      if (prev > index) return prev - 1;
      return prev;
    });
  }

  function onDragEnd(result: DropResult) {
    const { destination, source } = result;
    if (!destination) return;

    if (
      source.droppableId === "blocks" &&
      destination.droppableId === "blocks"
    ) {
      if (destination.index === source.index) return;
      setQuiz((q) => {
        const next = [...q.blocks];
        const [moved] = next.splice(source.index, 1);
        next.splice(destination.index, 0, moved);
        return { ...q, blocks: next };
      });
      setSelectedIndex((prev) => {
        if (prev == null) return prev;
        if (prev === source.index) return destination.index;
        if (source.index < prev && prev <= destination.index) return prev - 1;
        if (destination.index <= prev && prev < source.index) return prev + 1;
        return prev;
      });
      return;
    }

    if (
      source.droppableId === "palette" &&
      destination.droppableId === "blocks"
    ) {
      const type = blockPalette[source.index];
      const block = makeBlock(type);
      setQuiz((q) => {
        const next = [...q.blocks];
        next.splice(destination.index, 0, block);
        return { ...q, blocks: next };
      });
      setSelectedIndex(destination.index);
      return;
    }
  }

  function updateBlock(partial: Partial<Block>) {
    if (selectedIndex == null) return;
    setQuiz((q) => {
      const next = [...q.blocks];
      const current = next[selectedIndex];
      next[selectedIndex] = { ...current, ...partial } as Block;
      return { ...q, blocks: next };
    });
  }

  function save() {
    const ok = upsert(quiz);
    if (ok) toast("Saved", "success");
    else toast("Failed to save. Check storage quota.", "danger");
  }

  function togglePublish() {
    const next = { ...quiz, published: !quiz.published };
    setQuiz(next);
    const ok = upsert(next);
    if (ok) toast(next.published ? "Published" : "Unpublished", "success");
    else toast("Failed to update publish status.", "danger");
  }

  return {
    togglePublish,
    save,
    updateBlock,
    onDragEnd,
    move,
    addBlock,
    remove,
  };
};
