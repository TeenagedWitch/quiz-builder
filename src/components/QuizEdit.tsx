"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Quiz,
  Block,
  HeadingBlock,
  FooterBlock,
  ButtonBlock,
  QuestionBlock,
} from "@/types";
import { upsert } from "@/utility/quizStorage";
import { toast } from "@/utility/toast";
import { newId } from "@/utility/generateId";

type EditorProps = {
  initial?: Quiz;
};

const defaultQuiz = (): Quiz => ({
  id: newId(),
  title: "Untitled Quiz",
  updatedAt: new Date().toISOString(),
  published: false,
  blocks: [],
  createdAt: new Date().toISOString(),
});

export default function QuizEdit({ initial }: EditorProps) {
  const [quiz, setQuiz] = useState<Quiz>(() => initial ?? defaultQuiz());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedBlock = useMemo(
    () => (selectedIndex != null ? quiz.blocks[selectedIndex] : undefined),
    [quiz.blocks, selectedIndex]
  );

  useEffect(() => {
    if (initial) setQuiz(initial);
  }, [initial]);

  function makeBlock(type: Block["type"]): Block {
    switch (type) {
      case "heading":
        return { type: "heading", text: "Heading" } as HeadingBlock;
      case "footer":
        return { type: "footer", text: "Footer" } as FooterBlock;
      case "button":
        return { type: "button", label: "Submit" } as ButtonBlock;
      case "question":
      default:
        return {
          type: "question",
          question: "Your question?",
          options: ["Option 1", "Option 2"],
          multiple: false,
        } as QuestionBlock;
    }
  }

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
    if (ok) {
      toast("Saved", "success");
    } else {
      toast("Failed to save. Check storage quota.", "danger");
    }
  }

  function togglePublish() {
    const next = { ...quiz, published: !quiz.published };
    setQuiz(next);
    const ok = upsert(next);
    if (ok) {
      toast(next.published ? "Published" : "Unpublished", "success");
    } else {
      toast("Failed to update publish status.", "danger");
    }
  }

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
      <div className="row g-0" style={{ minHeight: "91vh" }}>
        <div className="col-12 col-md-3 col-lg-2 border-end p-3">
          <div className="fw-semibold mb-2">Building blocks</div>
          <div className="d-grid gap-2">
            <button
              className="btn btn-light"
              onClick={() => addBlock("heading")}
            >
              Heading
            </button>
            <button
              className="btn btn-light"
              onClick={() => addBlock("question")}
            >
              Question
            </button>
            <button
              className="btn btn-light"
              onClick={() => addBlock("button")}
            >
              Button
            </button>
            <button
              className="btn btn-light"
              onClick={() => addBlock("footer")}
            >
              Footer
            </button>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-8 p-3">
          <div className="fw-semibold mb-2">Canvas</div>
          {quiz.blocks.length === 0 ? (
            <div className="text-muted">
              Add blocks from the left to start building your quiz.
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {quiz.blocks.map((blk, idx) => (
                <div
                  key={idx}
                  className={`border rounded p-2 ${
                    selectedIndex === idx ? "border-primary" : ""
                  }`}
                >
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={idx === 0}
                      onClick={() => move(idx, -1)}
                    >
                      ↑
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={idx === quiz.blocks.length - 1}
                      onClick={() => move(idx, 1)}
                    >
                      ↓
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => insertBefore(idx, "heading")}
                      title="Insert heading above"
                    >
                      +Heading↑
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => insertBefore(idx, "question")}
                      title="Insert question above"
                    >
                      +Question↑
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => insertBefore(idx, "button")}
                      title="Insert button above"
                    >
                      +Button↑
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => insertBefore(idx, "footer")}
                      title="Insert footer above"
                    >
                      +Footer↑
                    </button>
                    <div className="ms-auto d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(idx)}
                      >
                        Delete
                      </button>
                      <button
                        className={`btn btn-sm ${
                          selectedIndex === idx
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => setSelectedIndex(idx)}
                      >
                        {selectedIndex === idx ? "Selected" : "Select"}
                      </button>
                    </div>
                  </div>

                  <div>
                    {blk.type === "heading" && (
                      <div className="text-muted">
                        Heading: {(blk as HeadingBlock).text}
                      </div>
                    )}
                    {blk.type === "footer" && (
                      <div className="text-muted">
                        Footer: {(blk as FooterBlock).text}
                      </div>
                    )}
                    {blk.type === "button" && (
                      <div className="text-muted">
                        Button: {(blk as ButtonBlock).label}
                      </div>
                    )}
                    {blk.type === "question" && (
                      <div>
                        <div className="fw-semibold">
                          Q: {(blk as QuestionBlock).question}
                        </div>
                        {Array.isArray((blk as QuestionBlock).options) && (
                          <ul className="mb-0">
                            {(blk as QuestionBlock).options!.map((o, oi) => (
                              <li key={oi}>{o}</li>
                            ))}
                          </ul>
                        )}
                        {!Array.isArray((blk as QuestionBlock).options) && (
                          <div className="text-muted">Free-text answer</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-12 col-md-3 col-lg-2 border-start p-3">
          <div className="fw-semibold mb-2">Properties</div>
          {selectedBlock ? (
            <div className="d-flex flex-column gap-3">
              {selectedBlock.type === "heading" && (
                <div>
                  <label className="form-label">Text</label>
                  <input
                    className="form-control"
                    value={(selectedBlock as HeadingBlock).text}
                    onChange={(e) =>
                      updateBlock({ text: e.target.value } as HeadingBlock)
                    }
                  />
                </div>
              )}

              {selectedBlock.type === "footer" && (
                <div>
                  <label className="form-label">Text</label>
                  <input
                    className="form-control"
                    value={(selectedBlock as FooterBlock).text}
                    onChange={(e) =>
                      updateBlock({ text: e.target.value } as FooterBlock)
                    }
                  />
                </div>
              )}

              {selectedBlock.type === "button" && (
                <div>
                  <label className="form-label">Label</label>
                  <input
                    className="form-control"
                    value={(selectedBlock as ButtonBlock).label}
                    onChange={(e) =>
                      updateBlock({ label: e.target.value } as ButtonBlock)
                    }
                  />
                </div>
              )}

              {selectedBlock.type === "question" && (
                <div className="d-flex flex-column gap-3">
                  <div>
                    <label className="form-label">Question</label>
                    <input
                      className="form-control"
                      value={(selectedBlock as QuestionBlock).question}
                      onChange={(e) =>
                        updateBlock({
                          question: e.target.value,
                        } as QuestionBlock)
                      }
                    />
                  </div>
                  <div className="form-check">
                    <input
                      id="q-multiple"
                      className="form-check-input"
                      type="checkbox"
                      checked={!!(selectedBlock as QuestionBlock).multiple}
                      onChange={(e) =>
                        updateBlock({
                          multiple: e.target.checked,
                        } as QuestionBlock)
                      }
                    />
                    <label className="form-check-label" htmlFor="q-multiple">
                      Multiple selection
                    </label>
                  </div>
                  <div>
                    <div className="d-flex align-items-center mb-2">
                      <div className="fw-semibold">Options</div>
                      <button
                        className="btn btn-sm btn-outline-secondary ms-auto"
                        onClick={() => {
                          const blk = selectedBlock as QuestionBlock;
                          const options = Array.isArray(blk.options)
                            ? [...blk.options]
                            : [];
                          options.push(`Option ${options.length + 1}`);
                          updateBlock({ options } as QuestionBlock);
                        }}
                      >
                        + Add option
                      </button>
                      <button
                        className="btn btn-sm btn-outline-warning ms-2"
                        title="Switch to free-text (clears options)"
                        onClick={() =>
                          updateBlock({ options: undefined } as QuestionBlock)
                        }
                      >
                        Free text
                      </button>
                    </div>

                    {Array.isArray((selectedBlock as QuestionBlock).options) ? (
                      <div className="d-flex flex-column gap-2">
                        {(selectedBlock as QuestionBlock).options!.map(
                          (opt, oi) => (
                            <div className="input-group" key={oi}>
                              <span className="input-group-text">{oi + 1}</span>
                              <input
                                className="form-control"
                                value={opt}
                                onChange={(e) => {
                                  const blk = selectedBlock as QuestionBlock;
                                  const options = [...(blk.options || [])];
                                  options[oi] = e.target.value;
                                  updateBlock({ options } as QuestionBlock);
                                }}
                              />
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => {
                                  const blk = selectedBlock as QuestionBlock;
                                  const options = [...(blk.options || [])];
                                  options.splice(oi, 1);
                                  updateBlock({ options } as QuestionBlock);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-muted">
                        This question uses a free-text answer.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-muted">
              Select a block to edit its properties.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
