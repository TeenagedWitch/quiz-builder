"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import type { Quiz, Block } from "@/types";
import { upsert } from "@/utility/quizStorage";
import { toast } from "@/utility/toast";
import { defaultQuiz, makeBlock } from "@/utility/quizUtils";
import { blockPalette } from "@/constants/blocks";
import Canvas from "./editor/Canvas";
import Palette from "./editor/Palette";
import PropertiesPanel from "./editor/PropertiesPanel";

type EditorProps = {
  initial?: Quiz;
};

export default function QuizEdit({ initial }: EditorProps) {
  const [quiz, setQuiz] = useState<Quiz>(() => initial ?? defaultQuiz());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedBlock = useMemo(
    () => (selectedIndex != null ? quiz.blocks[selectedIndex] : undefined),
    [quiz.blocks, selectedIndex]
  );

  function addBlock(type: Block["type"]) {
    const block = makeBlock(type);
    setQuiz((q) => ({ ...q, blocks: [...q.blocks, block] }));
    setSelectedIndex(quiz.blocks.length);
  }

  function insertBefore(index: number, type: Block["type"]) {
    const block = makeBlock(type);
    setQuiz((q) => {
      const next = [...q.blocks];
      next.splice(index, 0, block);
      return { ...q, blocks: next };
    });
    setSelectedIndex(index);
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

  useEffect(() => {
    if (initial) setQuiz(initial);
  }, [initial]);

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center gap-3 py-3 border-bottom px-3">
        <Link style={{ textDecoration: "none" }} href="/">
          Back
        </Link>
        <input
          className="form-control form-control-lg"
          style={{ maxWidth: 480 }}
          value={quiz.title}
          onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          placeholder="Quiz title"
        />
        <div className="ms-auto d-flex align-items-center gap-2">
          <span
            className={`badge ${
              quiz.published ? "bg-success" : "bg-secondary"
            }`}
          >
            {quiz.published ? "Published" : "Draft"}
          </span>
          <button className="btn btn-outline-primary" onClick={save}>
            Save
          </button>
          <button className="btn btn-primary" onClick={togglePublish}>
            {quiz.published ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="row g-0" style={{ minHeight: "91vh" }}>
          <div className="col-12 col-md-3 col-lg-2 border-end p-3">
            <Palette palette={blockPalette} onAdd={addBlock} />
          </div>
          <div className="col-12 col-md-6 col-lg-8 p-3">
            <Canvas
              blocks={quiz.blocks}
              selectedIndex={selectedIndex}
              setSelectedIndex={(i) => setSelectedIndex(i)}
              move={move}
              insertBefore={insertBefore}
              remove={remove}
            />
          </div>
          <div className="col-12 col-md-3 col-lg-2 border-start p-3">
            <PropertiesPanel
              selectedBlock={selectedBlock}
              updateBlock={updateBlock}
            />
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
