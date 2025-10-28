"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Canvas from "./editor/Canvas";
import Palette from "./editor/Palette";
import PropertiesPanel from "./editor/PropertiesPanel";
import { blockPalette } from "@/constants/blocks";
import { Quiz } from "@/types/types";
import { defaultQuiz } from "@/utility/quizUtils";
import Badge from "../Badge";
import { useQuizEditor } from "hooks/useQuizEditor";
import { DragDropContext } from "@hello-pangea/dnd";

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

  const {
    save,
    onDragEnd,
    move,
    updateBlock,
    togglePublish,
    remove,
    addBlock,
  } = useQuizEditor({ setQuiz, setSelectedIndex, quiz, selectedIndex });

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
          <Badge isPublished={quiz.published} />
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
          <div
            className="col-12 col-md-6 col-lg-8 p-3 d-flex flex-column"
            style={{ minHeight: "91vh" }}
          >
            <Canvas
              blocks={quiz.blocks}
              selectedIndex={selectedIndex}
              setSelectedIndex={(i) => setSelectedIndex(i)}
              move={move}
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
