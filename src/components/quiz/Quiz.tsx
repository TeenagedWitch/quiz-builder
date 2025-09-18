import {
  Block,
  ButtonBlock,
  FooterBlock,
  HeadingBlock,
  QuestionBlock,
  Quiz,
} from "@/types";
import React from "react";

const QuizItem = ({ title, blocks = [] }: Quiz) => {
  const renderBlock = (block: Block, idx: number) => {
    if (block.type === "heading") {
      const h = block as HeadingBlock;
      return <div className="d-flex mb-3">{h.text}</div>;
    }

    if (block.type === "question") {
      const q = block as QuestionBlock;
      return (
        <div className="border rounded p-3">
          <div className="fw-semibold mb-2">{q.question}</div>
          <div className="d-flex flex-column gap-2">
            {Array.isArray(q.options) && q.options.length > 0 ? (
              q.options.map((opt: string, oIdx: number) => (
                <label
                  key={`q-${idx}-o-${oIdx}`}
                  className="d-flex align-items-center gap-2"
                >
                  <input
                    type={q.multiple ? "checkbox" : "radio"}
                    name={`q-${idx}`}
                  />
                  <span>{opt}</span>
                </label>
              ))
            ) : (
              <input
                type="text"
                name={`q-${idx}-text`}
                className="form-control"
                placeholder="Enter your answer"
              />
            )}
          </div>
        </div>
      );
    }

    if (block.type === "footer") {
      const f = block as FooterBlock;
      return (
        <div className="d-flex align-items-center mt-3">
          <h5>{f.text}</h5>
        </div>
      );
    }

    if (block.type === "button") {
      const b = block as ButtonBlock;
      return (
        <div className="d-flex justify-content-end w-100">
          <button className="btn btn-md btn-primary">{b.label}</button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="border p-3 mt-5 d-flex flex-column">
      <div className="d-flex justify-content-center">
        <h1>{title}</h1>
      </div>
      <div className="d-flex flex-column gap-4">
        {blocks.map((blk, idx) => (
          <div key={`blk-${idx}`}>{renderBlock(blk, idx)}</div>
        ))}
      </div>
    </div>
  );
};

export default QuizItem;
