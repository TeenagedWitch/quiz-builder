"use client";

import type {
  Block,
  HeadingBlock,
  FooterBlock,
  ButtonBlock,
  QuestionBlock,
} from "@/types";

type Props = {
  updateBlock: (partial: Partial<Block>) => void;
  selectedBlock?: Block;
};

export default function PropertiesPanel({ selectedBlock, updateBlock }: Props) {
  return (
    <div>
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
                    updateBlock({ multiple: e.target.checked } as QuestionBlock)
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
        <div className="text-muted">Select a block to edit its properties.</div>
      )}
    </div>
  );
}
