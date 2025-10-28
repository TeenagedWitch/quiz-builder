"use client";

import { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import Modal from "@/components/Modal";
import { BlockType } from "@/constants/blockTypes";
import {
  Block,
  ButtonBlock,
  FooterBlock,
  HeadingBlock,
  QuestionBlock,
} from "@/types/types";

type Props = {
  blocks: Block[];
  selectedIndex: number | null;
  setSelectedIndex: (i: number) => void;
  move: (index: number, dir: -1 | 1) => void;
  remove: (index: number) => void;
};

export default function Canvas({
  blocks,
  selectedIndex,
  setSelectedIndex,
  move,
  remove,
}: Props) {
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);
  const targetLabel =
    confirmIndex != null
      ? `block #${confirmIndex + 1}${
          blocks[confirmIndex]?.type ? ` (${blocks[confirmIndex]?.type})` : ""
        }`
      : "";

  function closeConfirm() {
    setConfirmIndex(null);
  }
  function confirmDelete() {
    if (confirmIndex !== null) {
      remove(confirmIndex);
      closeConfirm();
    }
  }

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <div className="fw-semibold mb-2">Canvas</div>
      <Droppable droppableId="blocks">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="d-flex flex-column gap-3 flex-grow-1 overflow-auto"
            style={{ minHeight: 0 }}
          >
            {blocks.length === 0 && (
              <div className="text-muted border rounded p-3">
                Drag blocks here to build your quiz.
              </div>
            )}

            {blocks.map((blk, idx) => (
              <Draggable key={idx} draggableId={`blk-${idx}`} index={idx}>
                {(dragProvided, snapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    className={`border rounded p-2 ${
                      selectedIndex === idx ? "border-primary" : ""
                    } ${snapshot.isDragging ? "bg-light" : ""}`}
                  >
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        disabled={idx === 0}
                        onClick={() => move(idx, -1)}
                      >
                        Up
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        disabled={idx === blocks.length - 1}
                        onClick={() => move(idx, 1)}
                      >
                        Down
                      </button>
                      <div className="ms-auto d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setConfirmIndex(idx)}
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
                          {selectedIndex === idx ? "Selected" : "Edit"}
                        </button>
                      </div>
                    </div>

                    <div>
                      {blk.type === BlockType.Heading && (
                        <div className="text-muted">
                          Heading: {(blk as HeadingBlock).text}
                        </div>
                      )}
                      {blk.type === BlockType.Footer && (
                        <div className="text-muted">
                          Footer: {(blk as FooterBlock).text}
                        </div>
                      )}
                      {blk.type === BlockType.Button && (
                        <div className="text-muted">
                          Button: {(blk as ButtonBlock).label}
                        </div>
                      )}
                      {blk.type === BlockType.Question && (
                        <div>
                          <div className="fw-semibold">
                            Q: {(blk as QuestionBlock).question}
                          </div>
                          {Array.isArray((blk as QuestionBlock).options) ? (
                            <ul className="mb-0">
                              {(blk as QuestionBlock).options!.map((o, oi) => (
                                <li key={oi}>{o}</li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-muted">Free-text answer</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Modal
        open={confirmIndex !== null}
        onClose={closeConfirm}
        title="Delete block"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeConfirm}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </>
        }
      >
        <p className="mb-0">
          Are you sure you want to delete <strong>{targetLabel}</strong>?
        </p>
      </Modal>
    </div>
  );
}
