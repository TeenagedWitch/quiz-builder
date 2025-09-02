"use client";

import { Quiz } from "@/utility/quizStorage";
import React from "react";

const QuizItem = ({ title, blocks = [] }: Quiz) => {
  const renderHeading = () => {
    const res = blocks.find((block) => block.type === "heading");
    if (!res) return null;
    return <div className="d-flex mb-3">{res.text}</div>;
  };

  const renderQuestions = () => {
    const questions = blocks.filter((block) => block.type === "question");
    if (questions.length === 0) return null;

    return (
      <div className="d-flex flex-column gap-4">
        {questions.map((q: any, idx: number) => (
          <div key={`q-${idx}`} className="border rounded p-3">
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
        ))}
      </div>
    );
  };

  const renderFooter = () => {
    const res = blocks.find((block) => block.type === "footer");
    if (!res) return;

    return (
      <div className="d-flex">
        <h5>{res.text}</h5>
      </div>
    );
  };

  const renderButton = () => {
    const res = blocks.find((block) => block.type === "button");
    return (
      <div className="d-flex justify-content-end w-100">
        <button className="btn btn-md btn-primary">{res?.label}</button>
      </div>
    );
  };

  return (
    <div className="border p-3 mt-5 d-flex flex-column">
      <div className="d-flex justify-content-center">
        <h1>{title}</h1>
      </div>
      {renderHeading()}
      {renderQuestions()}
      {renderFooter()}
      {renderButton()}
    </div>
  );
};

export default QuizItem;
